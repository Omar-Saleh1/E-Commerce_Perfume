export interface INotificationService {
  send(recipient: string, subject: string, message: string): Promise<boolean>;
}

export class EmailNotificationService implements INotificationService {
  async send(recipient: string, subject: string, message: string): Promise<boolean> {
    console.log(`📧 [EMAIL] To: ${recipient} | Subject: ${subject}`);
    return true;
  }
}

export class SMSNotificationService implements INotificationService {
  async send(recipient: string, subject: string, message: string): Promise<boolean> {
    console.log(`📱 [SMS] To: ${recipient} | Text: ${message}`);
    return true;
  }
}

export interface INotificationFactory {
  createEmailService(): INotificationService;
  createSMSService(): INotificationService;
}

export class EnterpriseNotificationFactory implements INotificationFactory {
  createEmailService(): INotificationService { return new EmailNotificationService(); }
  createSMSService(): INotificationService { return new SMSNotificationService(); }
}

export const NotificationFactory = new EnterpriseNotificationFactory();
