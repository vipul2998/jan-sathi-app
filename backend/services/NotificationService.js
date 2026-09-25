const { Resend } = require('resend');
const twilio = require('twilio');

// Email service with Resend
class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@jansathi.local';
  }

  async sendOTPEmail(email, otp, name = '') {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log(`[DEMO MODE] OTP Email would be sent to: ${email}, OTP: ${otp}`);
        return { success: true, isDemoMode: true };
      }

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Jan Sathi - आपका OTP (Your OTP)',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>🔐 आपका OTP (Your OTP)</h2>
            <p>नमस्ते ${name || 'Jan Sathi User'},</p>
            <p>आपका OTP है:</p>
            <h1 style="color: #2563eb; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
            <p style="color: #666;">यह OTP 5 मिनट में expire हो जाएगा।</p>
            <p style="color: #999; font-size: 12px;">अगर यह आपने request नहीं की, तो ignore करें।</p>
          </div>
        `,
      });

      return { success: !!result.id, isDemoMode: false, result };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(email, resetLink, name = '') {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log(`[DEMO MODE] Password reset email would be sent to: ${email}`);
        return { success: true, isDemoMode: true };
      }

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Jan Sathi - Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>🔑 Password Reset</h2>
            <p>नमस्ते ${name},</p>
            <p>आप अपना password reset करना चाहते हैं। नीचे दिए गए link पर click करें:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
            <p style="color: #666;">यह link 24 घंटे में expire हो जाएगा।</p>
            <p style="color: #999; font-size: 12px;">अगर यह आपने request नहीं की, तो ignore करें।</p>
          </div>
        `,
      });

      return { success: !!result.id, isDemoMode: false, result };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, name = '') {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log(`[DEMO MODE] Welcome email would be sent to: ${email}`);
        return { success: true, isDemoMode: true };
      }

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'स्वागत है Jan Sathi में! (Welcome to Jan Sathi)',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>🎉 स्वागत है Jan Sathi में!</h2>
            <p>नमस्ते ${name},</p>
            <p>आपका account successfully create हो गया है। Jan Sathi में आपका स्वागत है!</p>
            <p>यहाँ आप:</p>
            <ul>
              <li>📚 Sarkari Yojana के बारे में जान सकते हैं</li>
              <li>🏥 Local services ढूंढ सकते हैं</li>
              <li>💰 Digital payments कर सकते हैं</li>
              <li>👥 Community में participate कर सकते हैं</li>
            </ul>
            <p>अगर कोई सवाल है, तो हमें contact करें।</p>
            <p>धन्यवाद!</p>
          </div>
        `,
      });

      return { success: !!result.id, isDemoMode: false, result };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }
}

// SMS service with Twilio
class SMSService {
  constructor() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilio = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      this.fromPhone = process.env.TWILIO_PHONE_NUMBER;
      this.whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
      this.otpChannel = process.env.TWILIO_OTP_CHANNEL || 'whatsapp';
    } else {
      this.twilio = null;
    }
  }

  async sendOTP(phone, otp) {
    try {
      if (!this.twilio) {
        return { success: false, isDemoMode: true, error: 'Twilio credentials are not configured' };
      }

      const isWhatsApp = this.otpChannel === 'whatsapp';
      const from = isWhatsApp ? this.whatsappFrom : this.fromPhone;
      if (!from) {
        return {
          success: false,
          isDemoMode: false,
          error: isWhatsApp ? 'TWILIO_WHATSAPP_FROM is not configured' : 'TWILIO_PHONE_NUMBER is not configured',
        };
      }

      const message = await this.twilio.messages.create({
        body: `Jan Sathi OTP: ${otp}. This code expires in 5 minutes.`,
        from,
        to: isWhatsApp ? `whatsapp:+91${phone}` : `+91${phone}`,
      });

      return {
        success: !!message.sid,
        isDemoMode: false,
        channel: isWhatsApp ? 'whatsapp' : 'sms',
        messageSid: message.sid,
      };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, isDemoMode: false, error: error.message };
    }
  }

  async sendMessage(phone, message) {
    try {
      if (!this.twilio || !this.fromPhone) {
        console.log(`[DEMO MODE] SMS would be sent to: +91${phone}, Message: ${message}`);
        return { success: true, isDemoMode: true };
      }

      const response = await this.twilio.messages.create({
        body: message,
        from: this.fromPhone,
        to: `+91${phone}`,
      });

      return { success: !!response.sid, isDemoMode: false, messageSid: response.sid };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export services
module.exports = {
  EmailService,
  SMSService,
  emailService: new EmailService(),
  smsService: new SMSService(),
};
