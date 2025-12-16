import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP
const createTransporter = () => {
    // Try multiple environment variable names for compatibility
    const emailUser = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'medichain123@gmail.com';
    const emailPassword = process.env.ADMIN_EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD || '';
    
    if (!emailPassword) {
        throw new Error('Email password not configured. Please set ADMIN_EMAIL_PASSWORD or EMAIL_APP_PASSWORD in .env file');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });
};

        // Send email from admin to patient
export const sendEmailToPatient = async (req, res) => {
    try {
        const { patientEmail, subject, message, appointment } = req.body;

        // Validate inputs
        if (!patientEmail || !subject || !message) {
            return res.json({
                success: false,
                message: 'Patient email, subject, and message are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(patientEmail)) {
            return res.json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Get email credentials
        const emailUser = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'medichain123@gmail.com';
        
        // Create transporter
        let transporter;
        try {
            transporter = createTransporter();
        } catch (transporterError) {
            return res.json({
                success: false,
                message: transporterError.message || 'Email service not configured. Please contact administrator.'
            });
        }

        // Format appointment date for display
        const formatAppointmentDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            const parts = dateStr.split('_');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
            }
            return dateStr.replace(/_/g, ' ');
        };

        // Email options with card-type horizontal layout (email-safe)
        const mailOptions = {
            from: `MediChain+ <${emailUser}>`,
            to: patientEmail,
            subject: subject,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MediChain+ Email</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #e5e7eb; font-family: Arial, Helvetica, sans-serif;">
    <!-- Background Table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e5e7eb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid #d1d5db;">
                    
                    <!-- Header Card -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 35px 30px 25px 30px; text-align: center; border-bottom: 2px solid #f3f4f6;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <div style="width: 65px; height: 65px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: inline-block; line-height: 65px; font-size: 32px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">🏥</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; color: #1f2937; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">MediChain+</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 6px;">
                                        <p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 500;">Healthcare Appointment Update</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content Area -->
                    <tr>
                        <td style="padding: 35px 30px; background-color: #ffffff;">
                            
                            <!-- Greeting -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 18px;">
                                        <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6; font-weight: 500;">Dear Patient,</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message Card -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #667eea; border-radius: 8px; padding: 22px;">
                                        <div style="color: #1f2937; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
                                    </td>
                                </tr>
                            </table>
                            
                            ${appointment && appointment.slotDate ? `
                            <!-- Appointment Details Header -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
                                <tr>
                                    <td>
                                        <h2 style="margin: 0; color: #1f2937; font-size: 17px; font-weight: 700;">
                                            <span style="margin-right: 8px; font-size: 18px;">📅</span>
                                            Appointment Details
                                        </h2>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Horizontal Appointment Cards -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    ${appointment.docData?.name ? `
                                    <!-- Doctor Card -->
                                    <td width="140" style="padding-right: 10px; vertical-align: top;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center;">
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <div style="font-size: 24px; margin-bottom: 6px;">👨‍⚕️</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 6px;">
                                                    <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Doctor</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="color: #1f2937; font-size: 12px; font-weight: 600; line-height: 1.4;">Dr. ${appointment.docData.name.length > 15 ? appointment.docData.name.substring(0, 15) + '...' : appointment.docData.name}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    ` : ''}
                                    ${appointment.docData?.speciality ? `
                                    <!-- Specialty Card -->
                                    <td width="140" style="padding-right: 10px; vertical-align: top;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center;">
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <div style="font-size: 24px; margin-bottom: 6px;">🩺</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 6px;">
                                                    <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Specialty</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="color: #1f2937; font-size: 12px; font-weight: 600; line-height: 1.4;">${appointment.docData.speciality.length > 15 ? appointment.docData.speciality.substring(0, 15) + '...' : appointment.docData.speciality}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    ` : ''}
                                    <!-- Date Card -->
                                    <td width="140" style="padding-right: 10px; vertical-align: top;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center;">
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <div style="font-size: 24px; margin-bottom: 6px;">📆</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 6px;">
                                                    <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Date</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="color: #1f2937; font-size: 12px; font-weight: 600; line-height: 1.4;">${formatAppointmentDate(appointment.slotDate)}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <!-- Time Card -->
                                    <td width="140" style="vertical-align: top;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center;">
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <div style="font-size: 24px; margin-bottom: 6px;">⏰</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 6px;">
                                                    <div style="color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Time</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="color: #1f2937; font-size: 12px; font-weight: 600; line-height: 1.4;">${appointment.slotTime || 'N/A'}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- Official Badge -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-top: 8px;">
                                        <span style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 7px 16px; border-radius: 18px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);">Official Communication</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer Card -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 28px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <h3 style="margin: 0; color: #667eea; font-size: 18px; font-weight: 700;">🏥 MediChain+ Hospital</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 6px 0;">
                                        <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                                            📞 <a href="tel:18002991874" style="color: #667eea; text-decoration: none; font-weight: 500;">1800-299-1874</a><br>
                                            📧 <a href="mailto:medichain123@gmail.com" style="color: #667eea; text-decoration: none; font-weight: 500;">medichain123@gmail.com</a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 18px; border-top: 1px solid #e5e7eb; margin-top: 18px;">
                                        <p style="margin: 8px 0 4px 0; color: #9ca3af; font-size: 11px; line-height: 1.6;">
                                            This is an automated email from MediChain+ Hospital Management System.<br>
                                            Please do not reply to this email. For inquiries, contact us through our official channels.
                                        </p>
                                        <p style="margin: 12px 0 0 0; color: #9ca3af; font-size: 11px;">
                                            © ${new Date().getFullYear()} MediChain+. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to send email.';
        
        if (error.message && error.message.includes('Invalid login')) {
            errorMessage = 'Invalid email credentials. Please check ADMIN_EMAIL_PASSWORD in .env file.';
        } else if (error.message && error.message.includes('Missing credentials')) {
            errorMessage = 'Email password not configured. Please set ADMIN_EMAIL_PASSWORD or EMAIL_APP_PASSWORD in .env file.';
        } else if (error.message && error.message.includes('not configured')) {
            errorMessage = error.message;
        } else if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please verify your Gmail App Password.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'Cannot connect to email server. Please check your internet connection.';
        } else {
            errorMessage = error.message || 'Failed to send email. Please check email configuration.';
        }
        
        res.json({
            success: false,
            message: errorMessage
        });
    }
};

