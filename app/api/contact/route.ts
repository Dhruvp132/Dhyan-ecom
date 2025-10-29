import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    // Validate input
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email to admin
    await transporter.sendMail({
      from: `"Dhyan Ecom Contact" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: "New Contact Form Submission - Dhyan Ecom",
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;">
              <strong style="color: #4b5563;">Name:</strong> 
              <span style="color: #1a1a1a;">${name}</span>
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #4b5563;">Email:</strong> 
              <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #4b5563;">Phone:</strong> 
              <a href="tel:${phone}" style="color: #2563eb;">${phone}</a>
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #4b5563;">Message:</strong>
            </p>
            <p style="color: #1a1a1a; line-height: 1.6; margin: 0;">
              ${message.replace(/\n/g, "<br>")}
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This email was sent from the Dhyan Ecom contact form
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Dhyan Ecom" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message - Dhyan Ecom",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Thank You for Contacting Us!
          </h2>
          <div style="margin: 20px 0;">
            <p style="color: #1a1a1a; line-height: 1.6;">
              Hi <strong>${name}</strong>,
            </p>
            <p style="color: #1a1a1a; line-height: 1.6;">
              Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
            </p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #4b5563;">Your Message:</strong>
              </p>
              <p style="color: #1a1a1a; line-height: 1.6; margin: 0;">
                ${message.replace(/\n/g, "<br>")}
              </p>
            </div>
            <p style="color: #1a1a1a; line-height: 1.6;">
              Best regards,<br/>
              <strong>Dhyan Ecom Team</strong>
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send message" 
      },
      { status: 500 }
    );
  }
}
