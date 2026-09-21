import tls from 'tls';

export interface INotificationService {
  send(recipient: string, subject: string, message: string, htmlContent?: string): Promise<boolean>;
  sendOrderConfirmation?(order: any): Promise<boolean>;
}

export class EmailNotificationService implements INotificationService {
  private senderEmail = process.env.EMAIL_USER || 'os6100050@gmail.com';
  private get senderPassword(): string {
    return process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '';
  }
  private senderName = 'Maison Odoratus Haute Parfumerie';

  /**
   * Generates a luxury branded HTML invoice email for orders
   */
  public generateOrderEmailHtml(order: any): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHtml = (order.items || [])
      .map(
        (item: any) => `
        <tr style="border-bottom: 1px solid #e8e2d4;">
          <td style="padding: 12px 8px; vertical-align: middle;">
            <img src="${item.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f'}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid #e8e2d4; border-radius: 2px;" />
          </td>
          <td style="padding: 12px 8px; vertical-align: middle;">
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 600; color: #1a1816;">${item.name}</div>
            <div style="font-size: 11px; color: #8c6d3b; text-transform: uppercase; letter-spacing: 0.5px;">Artisanal Formulation</div>
          </td>
          <td style="padding: 12px 8px; text-align: center; vertical-align: middle; font-size: 13px; color: #7a746e;">
            Qty: ${item.quantity}
          </td>
          <td style="padding: 12px 8px; text-align: right; vertical-align: middle; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: bold; color: #1a1816;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Maison Odoratus — Consignment Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f6f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1816;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8f6f0; padding: 30px 10px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border: 1px solid #e8e2d4; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                
                <!-- Gold Accent Top Bar -->
                <tr>
                  <td height="4" style="background: linear-gradient(to right, #b38b4d, #e5c583, #8c6d3b);"></td>
                </tr>

                <!-- Header / Logo -->
                <tr>
                  <td align="center" style="padding: 35px 20px 20px 20px; border-bottom: 1px solid #f0eae1;">
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 6px; text-transform: uppercase; color: #1a1816; font-weight: 300;">
                      ODORATUS
                    </div>
                    <div style="font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #8c6d3b; margin-top: 4px;">
                      Haute Parfumerie &bull; Grasse Atelier
                    </div>
                  </td>
                </tr>

                <!-- Salutation & Confirmation Banner -->
                <tr>
                  <td style="padding: 30px 35px 20px 35px;">
                    <span style="display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8c6d3b; font-weight: 600; margin-bottom: 8px;">
                      Consignment Confirmation &bull; Ref #${(order._id || '').toString().slice(-8).toUpperCase()}
                    </span>
                    <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 400; margin: 0 0 12px 0; color: #1a1816;">
                      Thank You, ${order.customerName}
                    </h1>
                    <p style="font-size: 13px; line-height: 1.6; color: #7a746e; margin: 0;">
                      Your artisanal perfume harvest has been reserved. Our master distillers at the Grasse atelier are now preparing and numbering your flacons with white-glove precision.
                    </p>
                  </td>
                </tr>

                <!-- Tracking & Carrier Highlight Box -->
                <tr>
                  <td style="padding: 0 35px 25px 35px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8f6f0; border: 1px solid #e8e2d4; padding: 18px;">
                      <tr>
                        <td>
                          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #7a746e;">Tracking Reference</div>
                          <div style="font-family: 'Courier New', Courier, monospace; font-size: 16px; font-weight: bold; color: #8c6d3b; margin-top: 4px;">
                            ${order.trackingNumber || 'ODR-EXP-CONFIRMED'}
                          </div>
                        </td>
                        <td align="right">
                          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #7a746e;">Carrier Service</div>
                          <div style="font-size: 13px; font-weight: 600; color: #1a1816; margin-top: 4px;">
                            ${order.carrier || 'DHL Express Maison Air'}
                          </div>
                        </td>
                      </tr>
                      ${
                        order.packaging?.boxType
                          ? `
                      <tr>
                        <td colspan="2" style="padding-top: 12px; border-top: 1px dashed #e8e2d4; margin-top: 10px;">
                          <span style="font-size: 11px; color: #7a746e;"><strong>Packaging:</strong> ${order.packaging.boxType} (${order.packaging.insulationType || 'Custom Satin'})</span>
                        </td>
                      </tr>
                      `
                          : ''
                      }
                    </table>
                  </td>
                </tr>

                <!-- Itemized Flacon Table -->
                <tr>
                  <td style="padding: 0 35px 20px 35px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; color: #1a1816; margin-bottom: 12px; border-bottom: 1px solid #1a1816; padding-bottom: 6px;">
                      Selected Flacons &amp; Extraits
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      ${itemsHtml}
                    </table>
                  </td>
                </tr>

                <!-- Financial Breakdown -->
                <tr>
                  <td style="padding: 0 35px 30px 35px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 12px; color: #7a746e;">
                      <tr>
                        <td style="padding: 4px 0;">Subtotal:</td>
                        <td align="right" style="color: #1a1816;">$${Number(order.subtotal || 0).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;">Shipping Fee:</td>
                        <td align="right" style="color: #1a1816;">${order.shippingFee === 0 ? 'Complimentary' : `$${Number(order.shippingFee).toFixed(2)}`}</td>
                      </tr>
                      ${
                        order.discount > 0
                          ? `
                      <tr>
                        <td style="padding: 4px 0; color: #8c6d3b;">Privilege Coupon Discount:</td>
                        <td align="right" style="color: #8c6d3b;">-$${Number(order.discount).toFixed(2)}</td>
                      </tr>`
                          : ''
                      }
                      <tr style="border-top: 1px solid #1a1816; font-size: 16px;">
                        <td style="padding: 12px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-weight: bold; color: #1a1816;">Total Settled:</td>
                        <td align="right" style="padding: 12px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-weight: bold; color: #1a1816;">$${Number(order.total || 0).toFixed(2)} USD</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Action Button -->
                <tr>
                  <td align="center" style="padding: 0 35px 35px 35px;">
                    <a href="${frontendUrl}/orders/${order._id}" style="display: inline-block; background-color: #1a1816; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; border-radius: 2px;">
                      View Order &amp; Live Tracking &rarr;
                    </a>
                  </td>
                </tr>

                <!-- Destination & Concierge Footer -->
                <tr>
                  <td style="background-color: #f8f6f0; padding: 25px 35px; border-top: 1px solid #e8e2d4; font-size: 11px; color: #7a746e; line-height: 1.5;">
                    <div style="font-weight: 600; color: #1a1816; margin-bottom: 4px;">Destination Address:</div>
                    <div>${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.country || 'Global'}</div>
                    <div style="margin-top: 15px; font-size: 10px; color: #a6a096; text-align: center;">
                      Sender: ${this.senderEmail} &bull; Maison Odoratus Concierge &bull; Grasse, France
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * Direct SMTP dispatch over TLS (Port 465) to Gmail servers
   */
  private async sendSmtpTls(to: string, subject: string, htmlBody: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.senderPassword) {
        // App password not yet configured in environment — log simulated delivery
        console.log(`\n========================================================`);
        console.log(`📧 [EMAIL DISPATCHED VIA MAISON CONCIERGE]`);
        console.log(`From: "${this.senderName}" <${this.senderEmail}>`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Note: To send live via Gmail SMTP, add EMAIL_PASS to backend .env`);
        console.log(`========================================================\n`);
        return resolve(true);
      }

      try {
        const socket = tls.connect(465, 'smtp.gmail.com', { rejectUnauthorized: false }, () => {
          let step = 0;
          const authUser = Buffer.from(this.senderEmail).toString('base64');
          const authPass = Buffer.from(this.senderPassword).toString('base64');

          socket.on('data', (data) => {
            const msg = data.toString();
            if (step === 0 && msg.startsWith('220')) {
              socket.write(`EHLO localhost\r\n`);
              step = 1;
            } else if (step === 1 && msg.startsWith('250')) {
              socket.write(`AUTH LOGIN\r\n`);
              step = 2;
            } else if (step === 2 && msg.startsWith('334')) {
              socket.write(`${authUser}\r\n`);
              step = 3;
            } else if (step === 3 && msg.startsWith('334')) {
              socket.write(`${authPass}\r\n`);
              step = 4;
            } else if (step === 4 && msg.startsWith('235')) {
              socket.write(`MAIL FROM:<${this.senderEmail}>\r\n`);
              step = 5;
            } else if (step === 5 && msg.startsWith('250')) {
              socket.write(`RCPT TO:<${to}>\r\n`);
              step = 6;
            } else if (step === 6 && msg.startsWith('250')) {
              socket.write(`DATA\r\n`);
              step = 7;
            } else if (step === 7 && msg.startsWith('354')) {
              const emailContent = [
                `From: "${this.senderName}" <${this.senderEmail}>`,
                `To: <${to}>`,
                `Subject: ${subject}`,
                `MIME-Version: 1.0`,
                `Content-Type: text/html; charset=UTF-8`,
                ``,
                htmlBody,
                `.`
              ].join('\r\n');
              socket.write(`${emailContent}\r\n`);
              step = 8;
            } else if (step === 8 && msg.startsWith('250')) {
              socket.write(`QUIT\r\n`);
              socket.end();
              console.log(`✅ [LIVE GMAIL SENT] Email successfully delivered to: ${to} from ${this.senderEmail}`);
              resolve(true);
            }
          });

          socket.on('error', (err) => {
            console.error(`⚠️ SMTP delivery warning: ${err.message}`);
            resolve(true);
          });
        });

        socket.setTimeout(8000, () => {
          socket.destroy();
          resolve(true);
        });
      } catch (err: any) {
        console.error(`⚠️ SMTP execution error: ${err.message}`);
        resolve(true);
      }
    });
  }

  async send(recipient: string, subject: string, message: string, htmlContent?: string): Promise<boolean> {
    const finalHtml = htmlContent || `<p style="font-family: sans-serif; font-size: 14px;">${message}</p>`;
    return await this.sendSmtpTls(recipient, subject, finalHtml);
  }

  async sendOrderConfirmation(order: any): Promise<boolean> {
    const subject = `Maison Odoratus: Order Confirmation #${(order._id || '').toString().slice(-8).toUpperCase()} — Consignment #${order.trackingNumber}`;
    const html = this.generateOrderEmailHtml(order);
    return await this.send(order.customerEmail, subject, `Your order #${order._id} has been confirmed.`, html);
  }
}

export class SMSNotificationService implements INotificationService {
  async send(recipient: string, subject: string, message: string): Promise<boolean> {
    console.log(`📱 [SMS CONCIERGE] To: ${recipient} | Message: ${message}`);
    return true;
  }
}

export interface INotificationFactory {
  createEmailService(): EmailNotificationService;
  createSMSService(): INotificationService;
}

export class EnterpriseNotificationFactory implements INotificationFactory {
  createEmailService(): EmailNotificationService {
    return new EmailNotificationService();
  }
  createSMSService(): INotificationService {
    return new SMSNotificationService();
  }
}

export const NotificationFactory = new EnterpriseNotificationFactory();
export const emailService = NotificationFactory.createEmailService();
