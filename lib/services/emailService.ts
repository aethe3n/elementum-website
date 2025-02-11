import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const sendEmail = httpsCallable(functions, 'sendEmail');

export interface EmailTemplate {
  subject: string;
  body: string;
  data?: Record<string, any>;
}

const EMAIL_TEMPLATES = {
  SUBSCRIPTION_CREATED: (data: any): EmailTemplate => ({
    subject: 'Welcome to Your New Subscription!',
    body: `
      Hi ${data.userName},

      Thank you for subscribing to our ${data.planName} plan! Your subscription is now active.

      Here's what you get with your subscription:
      ${data.features.map((feature: string) => `- ${feature}`).join('\n')}

      If you have any questions, feel free to reach out to our support team.

      Best regards,
      The Elementum Team
    `,
    data
  }),

  SUBSCRIPTION_CANCELLED: (data: any): EmailTemplate => ({
    subject: 'Subscription Cancellation Confirmation',
    body: `
      Hi ${data.userName},

      We're sorry to see you go. Your subscription has been cancelled and will end on ${data.endDate}.

      You'll continue to have access to your benefits until then.

      If you change your mind, you can reactivate your subscription at any time.

      Best regards,
      The Elementum Team
    `,
    data
  }),

  PAYMENT_FAILED: (data: any): EmailTemplate => ({
    subject: 'Action Required: Payment Failed',
    body: `
      Hi ${data.userName},

      We were unable to process your payment for your ${data.planName} subscription.

      Please update your payment information to avoid any interruption in service:
      ${data.updatePaymentLink}

      If you need assistance, our support team is here to help.

      Best regards,
      The Elementum Team
    `,
    data
  }),

  SUBSCRIPTION_RENEWED: (data: any): EmailTemplate => ({
    subject: 'Subscription Renewed Successfully',
    body: `
      Hi ${data.userName},

      Your ${data.planName} subscription has been successfully renewed.

      Your next billing date will be ${data.nextBillingDate}.

      Thank you for your continued trust in our services.

      Best regards,
      The Elementum Team
    `,
    data
  })
};

export async function sendSubscriptionEmail(
  userId: string,
  templateName: keyof typeof EMAIL_TEMPLATES,
  templateData: any
) {
  try {
    const template = EMAIL_TEMPLATES[templateName](templateData);
    
    await sendEmail({
      userId,
      template: {
        name: templateName,
        subject: template.subject,
        body: template.body,
        data: template.data
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 