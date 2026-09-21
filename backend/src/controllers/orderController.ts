import { Request, Response } from 'express';
import { RepositoryFactory } from '../patterns/database/AbstractRepositoryFactory';
import { PaymentGatewayFactory, paymentService, PaymentProviderRegistry } from '../patterns/payments/AbstractPaymentFactory';
import { FulfillmentProviderRegistry, fulfillmentService } from '../patterns/fulfillment/AbstractFulfillmentFactory';
import { NotificationFactory } from '../patterns/notifications/AbstractNotificationFactory';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { User } from '../models/User';

const orderRepo = RepositoryFactory.createOrderRepository();
const emailService = NotificationFactory.createEmailService();

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      tax,
      discount,
      total,
      appliedCoupon,
      paymentMethod,
      shippingTier
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // 1. ABSTRACT FACTORY 1: Order Fulfillment & Consignment Ecosystem
    // Resolve matching Fulfillment Factory (Standard Ground / DHL Express / VIP White-Glove)
    const fulfillmentFactory = FulfillmentProviderRegistry.resolveFactory(shippingTier, total, shippingAddress);
    
    // Client executes complete fulfillment preparation polymorphically
    const consignment = fulfillmentService.prepareOrderConsignment(
      fulfillmentFactory,
      total,
      items,
      shippingAddress
    );

    // 2. ABSTRACT FACTORY 2: Payment & Settlement Ecosystem
    // Resolve matching Payment Factory (Stripe / PayPal / Cash on Delivery)
    const paymentFactory = PaymentProviderRegistry.getFactory(paymentMethod);

    // Client executes complete payment lifecycle polymorphically
    const paymentExecution = await paymentService.executePayment(paymentFactory, total, 'USD', {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      ...req.body
    });

    if (!paymentExecution.success) {
      return res.status(400).json({
        success: false,
        message: paymentExecution.transaction?.message || 'Payment execution failed',
        errors: paymentExecution.errors
      });
    }

    const paymentResult = paymentExecution.transaction;
    const paymentReceipt = paymentExecution.receipt;

    // 3. Persist Order with fully coordinated fulfillment & payment ecosystems
    const order = await Order.create({
      user: req.user?._id,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      tax: tax || 0,
      shippingFee: consignment.shipping.finalShippingFee,
      discount: discount || 0,
      total,
      appliedCoupon,
      paymentMethod,
      paymentStatus: paymentResult.status,
      orderStatus: 'processing',
      fulfillmentTier: consignment.fulfillmentTier,
      packaging: {
        tierName: consignment.packaging.tierName,
        boxType: consignment.packaging.boxType,
        insulationType: consignment.packaging.insulationType,
        complimentarySamplesCount: consignment.packaging.complimentarySamplesCount,
        specialInstructions: consignment.packaging.specialInstructions
      },
      trackingNumber: consignment.trackingNumber,
      carrier: consignment.carrier.carrierName,
      estimatedDelivery: consignment.estimatedDelivery,
      timeline: consignment.timeline
    });

    // Add loyalty points to user if logged in
    if (req.user?._id) {
      const earnedPoints = Math.round(total * 10);
      await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: earnedPoints } });
    }

    // Send luxury branded HTML order confirmation email from os6100050@gmail.com
    await emailService.sendOrderConfirmation(order);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      payment: paymentResult,
      receipt: paymentReceipt,
      consignment: {
        tier: consignment.fulfillmentTier,
        packaging: consignment.packaging,
        documents: consignment.documents,
        carrier: consignment.carrier
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier;
    const order = await Order.findOne({
      $or: [
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : undefined },
        { trackingNumber: identifier.toUpperCase() }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'No consignment found with this tracking reference' });
    }

    res.json({
      success: true,
      tracking: {
        orderId: order._id,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        status: order.orderStatus,
        fulfillmentTier: order.fulfillmentTier || 'Standard Maison Ground',
        packaging: order.packaging,
        customerName: order.customerName,
        destination: `${order.shippingAddress.city}, ${order.shippingAddress.country || 'Global'}`,
        estimatedDelivery: order.estimatedDelivery,
        timeline: order.timeline,
        items: order.items,
        total: order.total
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
