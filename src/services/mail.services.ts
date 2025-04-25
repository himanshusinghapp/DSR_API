import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendOTP = async (email: string, otp: string) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
  
      await transporter.sendMail({
        from: `"Support Team" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      });
    } catch (error) {
      console.error("Error in sendOTP service:", error); 
      throw error; 
    }
  };
  