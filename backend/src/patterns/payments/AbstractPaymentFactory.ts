export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface IPaymentProcessor {
  processPayment(amount: number, currency: string, details: any): Promise<PaymentResult>;
}

export class CashOnDeliveryProcessor implements IPaymentProcessor {
  async processPayment(amount: number, currency: string, details: any): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `COD-${Date.now()}`,
      message: 'Cash on delivery authorized. Payment due on handover.',
      status: 'pending'
    };
  }
}

export class CardPaymentProcessor implements IPaymentProcessor {
  async processPayment(amount: number, currency: string, details: any): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `CARD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      message: 'Card payment authorized securely.',
      status: 'completed'
    };
  }
}

export class ApplePayProcessor implements IPaymentProcessor {
  async processPayment(amount: number, currency: string, details: any): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `APAY-${Date.now()}`,
      message: 'Apple Pay biometric token verified.',
      status: 'completed'
    };
  }
}

export interface IPaymentGatewayFactory {
  createProcessor(method: string): IPaymentProcessor;
}

export class EnterprisePaymentGatewayFactory implements IPaymentGatewayFactory {
  createProcessor(method: string): IPaymentProcessor {
    const m = (method || '').toLowerCase();
    if (m.includes('apple')) return new ApplePayProcessor();
    if (m.includes('card') || m.includes('visa') || m.includes('mastercard')) return new CardPaymentProcessor();
    return new CashOnDeliveryProcessor();
  }
}

export const PaymentGatewayFactory = new EnterprisePaymentGatewayFactory();
