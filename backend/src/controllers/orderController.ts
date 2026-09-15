import { Request, Response } from 'express';
import { RepositoryFactory } from '../patterns/database/AbstractRepositoryFactory';
import { PaymentGatewayFactory } from '../patterns/payments/AbstractPaymentFactory';
import { NotificationFactory } from '../patterns/notifications/AbstractNotificationFactory';
import { AuthRequest } from '../middleware/auth';

const orderRepo = RepositoryFactory.createOrderRepository();
const emailService = NotificationFactory.createEmailService();

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, subtotal, tax, shippingFee, discount, total, appliedCoupon, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    const paymentProcessor = PaymentGatewayFactory.createProcessor(paymentMethod);
    const paymentResult = await paymentProcessor.processPayment(total, 'USD', { customerEmail, customerName });

    const order = await orderRepo.create({
      user: req.user?._id,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      tax: tax || 0,
      shippingFee: shippingFee || 0,
      discount: discount || 0,
      total,
      appliedCoupon,
      paymentMethod,
      paymentStatus: paymentResult.status,
      orderStatus: 'processing'
    });

    await emailService.send(customerEmail, `Order Confirmation #${order._id}`, `Order for $${total} confirmed.`);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      payment: paymentResult
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderRepo.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderRepo.find({ user: req.user!._id }, { createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
