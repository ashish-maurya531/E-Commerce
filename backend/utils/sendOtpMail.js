const nodemailer = require('nodemailer');
const db = require('../config/database');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-specific-password'
    }
});

// Generate OTP
const generateOTP = async () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
const sendOTP = async (email, purpose = 'verification') => {
    try {
        const otp = await generateOTP();
        console.log(`Generated OTP for ${purpose}: ${otp} for ${email}`);
        
        // Store OTP in database
        await db.query(`INSERT INTO otp_store (identifier, otp)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE
    otp = VALUES(otp), 
    updated_at = NOW();

            `, [email, otp])

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Your OTP for Herbal Medicine Store',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2>OTP Verification</h2>
                    <p>Your OTP for ${purpose} is:</p>
                    <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

// Verify OTP
const verifyOTP = async (email, userOTP) => {
    try {
        // Get the latest OTP for the email
        const [otpRecords] = await db.query(
            `SELECT * FROM otp_store 
             WHERE identifier = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [email]
        );

        if (!otpRecords.length) {
            return { valid: false, message: 'No OTP found' };
        }

        const otpRecord = otpRecords[0];

        // Check if OTP is expired (5 minutes)
        const otpTime = new Date(otpRecord.updated_at).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = (currentTime - otpTime) / 1000 / 60; // difference in minutes

        if (timeDiff > 5) {
            return { valid: false, message: 'OTP expired' };
        }

        // Verify OTP
        if (otpRecord.otp === userOTP) {
            // Delete verified OTP
            await db.query(
                'DELETE FROM otp_store WHERE identifier = ?',
                [email]
            );
            return { valid: true, message: 'OTP verified successfully' };
        }

        return { valid: false, message: 'Invalid OTP' };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw new Error('Failed to verify OTP');
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};