/**
 * ============================================================================
 * ABSTRACT FACTORY DESIGN PATTERN — E-COMMERCE PAYMENT ECOSYSTEM
 * ============================================================================
 * 
 * USE CASE:
 * In a modern enterprise E-Commerce application, integrating a payment provider
 * is NOT just about making a simple HTTP call. Each provider requires a cohesive
 * family of tightly coupled, provider-specific services:
 * 
 * 1. IPaymentValidator: Provider-specific validation rules (e.g. Stripe card tokens,
 *    PayPal order IDs, or COD physical delivery & phone verification).
 * 2. IPaymentProcessor: The actual charge / authorization execution.
 * 3. IPaymentReceiptHandler: Formatting & generating provider-specific receipts,
 *    metadata, refund references, and audit logs.
 * 
 * The Abstract Factory Pattern ensures that the Client code (Checkout / Order Service)
 * works with a matching, guaranteed compatible family of objects without coupling
 * to any concrete vendor SDK or implementation.
 */

// ============================================================================
// 1. DATA MODELS & TYPES
// ============================================================================

export interface PaymentPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    country?: string;
    postalCode?: string;
  };
  cardToken?: string;
  paypalOrderId?: string;
  billingNotes?: string;
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface TransactionResult {
  success: boolean;
  transactionId: string;
  provider: 'stripe' | 'paypal' | 'cod' | string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  message: string;
  rawResponse?: Record<string, any>;
}

export interface PaymentReceipt {
  receiptId: string;
  transactionId: string;
  provider: string;
  timestamp: Date;
  customerEmail: string;
  amountFormatted: string;
  paymentSummary: string;
  instructionsOrDownloadUrl?: string;
}

export interface PaymentExecutionResult {
  success: boolean;
  transaction: TransactionResult;
  receipt?: PaymentReceipt;
  errors?: string[];
}

// ============================================================================
// 2. ABSTRACT PRODUCTS (INTERFACES)
// ============================================================================

/**
 * Abstract Product A: Payment Processor
 * Responsible for authorizing and executing the financial transaction.
 */
export interface IPaymentProcessor {
  processPayment(amount: number, currency: string, payload: PaymentPayload): Promise<TransactionResult>;
}

/**
 * Abstract Product B: Payment Validator
 * Responsible for verifying that the required provider credentials/payload are valid.
 */
export interface IPaymentValidator {
  validate(payload: PaymentPayload, amount: number): ValidationResult;
}

/**
 * Abstract Product C: Payment Receipt Handler
 * Responsible for building formatted receipts, transaction proof, and post-sale instructions.
 */
export interface IPaymentReceiptHandler {
  generateReceipt(transaction: TransactionResult, payload: PaymentPayload): PaymentReceipt;
}

// ============================================================================
// 3. CONCRETE PRODUCTS — STRIPE ECOSYSTEM
// ============================================================================

export class StripePaymentProcessor implements IPaymentProcessor {
  async processPayment(amount: number, currency: string, payload: PaymentPayload): Promise<TransactionResult> {
    // In production, this interacts with stripe.paymentIntents.create()
    const isMockSuccess = true;
    const transactionId = `ch_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (!isMockSuccess) {
      return {
        success: false,
        transactionId,
        provider: 'stripe',
        amount,
        currency,
        status: 'failed',
        message: 'Stripe 3D Secure authentication failed or card was declined.'
      };
    }

    return {
      success: true,
      transactionId,
      provider: 'stripe',
      amount,
      currency,
      status: 'completed',
      message: 'Stripe charge captured successfully via tokenized gateway.',
      rawResponse: {
        network: 'Visa / Mastercard SecureNet',
        riskLevel: 'normal',
        sellerMessage: 'Payment complete.'
      }
    };
  }
}

export class StripePaymentValidator implements IPaymentValidator {
  validate(payload: PaymentPayload, amount: number): ValidationResult {
    const errors: string[] = [];
    if (!payload.customerEmail || !payload.customerEmail.includes('@')) {
      errors.push('Stripe requires a valid client email address for invoice delivery.');
    }
    if (amount <= 0) {
      errors.push('Stripe transaction amount must be greater than zero.');
    }
    // Card or Token checks
    if (!payload.cardToken && !payload.paymentMethodId) {
      // In dev mode allow fallback mock token
      payload.cardToken = `tok_visa_demo_${Date.now()}`;
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class StripeReceiptHandler implements IPaymentReceiptHandler {
  generateReceipt(transaction: TransactionResult, payload: PaymentPayload): PaymentReceipt {
    return {
      receiptId: `REC-STRIPE-${transaction.transactionId.slice(-8).toUpperCase()}`,
      transactionId: transaction.transactionId,
      provider: 'Stripe Payments Inc.',
      timestamp: new Date(),
      customerEmail: payload.customerEmail,
      amountFormatted: `$${transaction.amount.toFixed(2)} ${transaction.currency.toUpperCase()}`,
      paymentSummary: `Paid via Encrypted Credit/Debit Card (Ref: ${transaction.transactionId})`,
      instructionsOrDownloadUrl: `https://pay.stripe.com/receipts/invoices/${transaction.transactionId}`
    };
  }
}

// ============================================================================
// 4. CONCRETE PRODUCTS — PAYPAL ECOSYSTEM
// ============================================================================

export class PayPalPaymentProcessor implements IPaymentProcessor {
  async processPayment(amount: number, currency: string, payload: PaymentPayload): Promise<TransactionResult> {
    // In production, interacts with @paypal/checkout-server-sdk
    const transactionId = `PAYPAL-CAPTURE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId,
      provider: 'paypal',
      amount,
      currency,
      status: 'completed',
      message: 'PayPal wallet capture executed and verified.',
      rawResponse: {
        payerId: `PAYER_${Date.now()}`,
        vaultStatus: 'APPROVED'
      }
    };
  }
}

export class PayPalPaymentValidator implements IPaymentValidator {
  validate(payload: PaymentPayload, amount: number): ValidationResult {
    const errors: string[] = [];
    if (!payload.customerEmail) {
      errors.push('PayPal requires a valid PayPal account email address.');
    }
    if (amount < 1) {
      errors.push('PayPal minimum checkout transaction value is $1.00.');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class PayPalReceiptHandler implements IPaymentReceiptHandler {
  generateReceipt(transaction: TransactionResult, payload: PaymentPayload): PaymentReceipt {
    return {
      receiptId: `REC-PAYPAL-${transaction.transactionId.slice(-6).toUpperCase()}`,
      transactionId: transaction.transactionId,
      provider: 'PayPal Holdings, Inc.',
      timestamp: new Date(),
      customerEmail: payload.customerEmail,
      amountFormatted: `$${transaction.amount.toFixed(2)} ${transaction.currency.toUpperCase()}`,
      paymentSummary: `Debited from PayPal Balance / Linked Bank (Capture ID: ${transaction.transactionId})`,
      instructionsOrDownloadUrl: `https://www.paypal.com/activity/payment/${transaction.transactionId}`
    };
  }
}

// ============================================================================
// 5. CONCRETE PRODUCTS — CASH ON DELIVERY (COD) ECOSYSTEM
// ============================================================================

export class CashOnDeliveryProcessor implements IPaymentProcessor {
  async processPayment(amount: number, currency: string, payload: PaymentPayload): Promise<TransactionResult> {
    const transactionId = `COD-ATELIER-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return {
      success: true,
      transactionId,
      provider: 'cod',
      amount,
      currency,
      status: 'pending', // Payment will be completed upon physical handover
      message: 'Cash on Delivery order booked. Courier will collect payment upon delivery.',
      rawResponse: {
        collectionCurrency: currency,
        cashOnDeliveryFee: 0
      }
    };
  }
}

export class CashOnDeliveryValidator implements IPaymentValidator {
  validate(payload: PaymentPayload, amount: number): ValidationResult {
    const errors: string[] = [];
    if (!payload.customerPhone || payload.customerPhone.trim().length < 6) {
      errors.push('Cash on Delivery requires a verified mobile phone number for courier dispatch.');
    }
    if (!payload.shippingAddress?.street || !payload.shippingAddress?.city) {
      errors.push('Cash on Delivery requires a full physical street & city shipping address.');
    }
    if (amount > 5000) {
      errors.push('Cash on Delivery is limited to orders below $5,000 for courier insurance reasons.');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class CashOnDeliveryReceiptHandler implements IPaymentReceiptHandler {
  generateReceipt(transaction: TransactionResult, payload: PaymentPayload): PaymentReceipt {
    return {
      receiptId: `INV-COD-${transaction.transactionId.slice(-6).toUpperCase()}`,
      transactionId: transaction.transactionId,
      provider: 'Maison Odoratus Courier Cashier',
      timestamp: new Date(),
      customerEmail: payload.customerEmail,
      amountFormatted: `$${transaction.amount.toFixed(2)} ${transaction.currency.toUpperCase()}`,
      paymentSummary: `Payable in Cash upon Courier Delivery at ${payload.shippingAddress?.street || 'Provided Address'}`,
      instructionsOrDownloadUrl: 'Please prepare the exact cash amount for our white-glove concierge.'
    };
  }
}

// ============================================================================
// 6. ABSTRACT FACTORY INTERFACE
// ============================================================================

/**
 * The Abstract Factory interface declares a set of creation methods
 * for each abstract product in the payment family.
 */
export interface IPaymentProviderFactory {
  getProviderName(): string;
  createProcessor(): IPaymentProcessor;
  createValidator(): IPaymentValidator;
  createReceiptHandler(): IPaymentReceiptHandler;
}

// ============================================================================
// 7. CONCRETE FACTORIES
// ============================================================================

export class StripePaymentFactory implements IPaymentProviderFactory {
  getProviderName(): string {
    return 'Stripe';
  }
  createProcessor(): IPaymentProcessor {
    return new StripePaymentProcessor();
  }
  createValidator(): IPaymentValidator {
    return new StripePaymentValidator();
  }
  createReceiptHandler(): IPaymentReceiptHandler {
    return new StripeReceiptHandler();
  }
}

export class PayPalPaymentFactory implements IPaymentProviderFactory {
  getProviderName(): string {
    return 'PayPal';
  }
  createProcessor(): IPaymentProcessor {
    return new PayPalPaymentProcessor();
  }
  createValidator(): IPaymentValidator {
    return new PayPalPaymentValidator();
  }
  createReceiptHandler(): IPaymentReceiptHandler {
    return new PayPalReceiptHandler();
  }
}

export class CashOnDeliveryPaymentFactory implements IPaymentProviderFactory {
  getProviderName(): string {
    return 'Cash on Delivery';
  }
  createProcessor(): IPaymentProcessor {
    return new CashOnDeliveryProcessor();
  }
  createValidator(): IPaymentValidator {
    return new CashOnDeliveryValidator();
  }
  createReceiptHandler(): IPaymentReceiptHandler {
    return new CashOnDeliveryReceiptHandler();
  }
}

// ============================================================================
// 8. FACTORY REGISTRY & PROVIDER RESOLVER
// ============================================================================

/**
 * Factory Registry: Maps payment method identifiers to their respective
 * Concrete Factories without hardcoding logic inside the Client.
 */
export class PaymentProviderRegistry {
  private static factories: Map<string, IPaymentProviderFactory> = new Map([
    ['stripe', new StripePaymentFactory()],
    ['card', new StripePaymentFactory()],
    ['credit_card', new StripePaymentFactory()],
    ['paypal', new PayPalPaymentFactory()],
    ['cod', new CashOnDeliveryPaymentFactory()],
    ['cash on delivery', new CashOnDeliveryPaymentFactory()],
    ['cash on delivery (cod)', new CashOnDeliveryPaymentFactory()]
  ]);

  /**
   * Register a new payment provider dynamically at runtime.
   * Enables adding new payment gateways (e.g. ApplePay, Klarna, Crypto)
   * without modifying existing business logic (Open/Closed Principle).
   */
  public static registerProvider(identifier: string, factory: IPaymentProviderFactory): void {
    this.factories.set(identifier.toLowerCase().trim(), factory);
  }

  public static getFactory(methodName: string): IPaymentProviderFactory {
    const key = (methodName || '').toLowerCase().trim();
    const factory = this.factories.get(key);
    if (!factory) {
      // Fallback default: Cash on Delivery
      return new CashOnDeliveryPaymentFactory();
    }
    return factory;
  }
}

// ============================================================================
// 9. CLIENT / PAYMENT ORCHESTRATION SERVICE
// ============================================================================

/**
 * The Client depends ONLY on the IPaymentProviderFactory interface and
 * the abstract product interfaces (IPaymentProcessor, IPaymentValidator, IPaymentReceiptHandler).
 * 
 * It has ZERO coupling to Stripe, PayPal, or CashOnDelivery classes.
 */
export class CheckoutPaymentService {
  /**
   * Orchestrates the complete payment lifecycle:
   * 1. Factory creates the Validator -> validates payload
   * 2. Factory creates the Processor -> processes payment
   * 3. Factory creates the ReceiptHandler -> generates standardized receipt
   */
  public async executePayment(
    factory: IPaymentProviderFactory,
    amount: number,
    currency: string,
    payload: PaymentPayload
  ): Promise<PaymentExecutionResult> {
    // 1. Instantiate the family members through the Abstract Factory
    const validator: IPaymentValidator = factory.createValidator();
    const processor: IPaymentProcessor = factory.createProcessor();
    const receiptHandler: IPaymentReceiptHandler = factory.createReceiptHandler();

    // 2. Validate provider-specific inputs
    const validation: ValidationResult = validator.validate(payload, amount);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        transaction: {
          success: false,
          transactionId: `FAILED-VAL-${Date.now()}`,
          provider: factory.getProviderName(),
          amount,
          currency,
          status: 'failed',
          message: `Validation failed for ${factory.getProviderName()}: ${validation.errors.join(', ')}`
        }
      };
    }

    // 3. Process the transaction
    const transaction: TransactionResult = await processor.processPayment(amount, currency, payload);

    if (!transaction.success) {
      return {
        success: false,
        transaction,
        errors: [transaction.message]
      };
    }

    // 4. Generate the post-payment proof & receipt
    const receipt: PaymentReceipt = receiptHandler.generateReceipt(transaction, payload);

    return {
      success: true,
      transaction,
      receipt
    };
  }
}

// Singleton instances for clean injection across controllers
export const paymentService = new CheckoutPaymentService();
export const PaymentGatewayFactory = {
  createProcessor(method: string): IPaymentProcessor {
    return PaymentProviderRegistry.getFactory(method).createProcessor();
  },
  getFactory(method: string): IPaymentProviderFactory {
    return PaymentProviderRegistry.getFactory(method);
  }
};
