import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Create transporter with exact credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '24070@supnum.mr',
        pass: 'bwkr sivi sfgz iwzc'
      }
    });

    const mailOptions = {
      from: '"idealik Security" <24070@supnum.mr>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; text-align: center; border: 1px solid #e2e8f0; padding: 32px; border-radius: 16px; background-color: #F9F9F9;">
          <h2 style="color: #1A1C1C; margin-top: 0;">Verification Code</h2>
          <p style="color: #4C463A; font-size: 15px; margin-bottom: 24px;">Please use the following code to verify your action.</p>
          <div style="background-color: #fff; border: 2px dashed #C2A86F; border-radius: 8px; padding: 16px; margin: 0 auto; display: inline-block;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1A1C1C;">${code}</span>
          </div>
          <p style="color: #7E7669; font-size: 12px; margin-top: 24px;">If you did not request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, code }); 
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
