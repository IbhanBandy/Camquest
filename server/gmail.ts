import nodemailer from 'nodemailer';
import { RentalRequest, Camera } from '@shared/schema';
import { format } from 'date-fns';

// Admin email address to send notifications to
const ADMIN_EMAIL = 'kaleb.gill420@gmail.com';

// Check if Gmail app password is set
if (!process.env.GMAIL_APP_PASSWORD) {
  console.error('WARNING: GMAIL_APP_PASSWORD environment variable is not set. Email functionality will not work.');
}

// Create a nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  debug: true, // Enable debug logs
  logger: true  // Log to console
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Email server connection established successfully');
  }
});

// Format currency amount as USD
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Format date for display
const formatDate = (date: Date): string => {
  return format(new Date(date), 'MMMM d, yyyy');
};

/**
 * Send a confirmation email to the customer
 */
export async function sendCustomerConfirmationEmail(rental: RentalRequest, camera: Camera): Promise<boolean> {
  try {
    // Calculate rental duration
    const startDate = new Date(rental.startDate);
    const endDate = new Date(rental.endDate);
    const rentalDays = Math.max(
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      1
    );
    
    // Generate request ID
    const requestId = `RNT-${String(10000 + rental.id).substring(1)}`;
    
    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #3b82f6; margin: 0;">CamQuest</h1>
          <p style="color: #64748b; font-size: 16px; margin: 5px 0 0;">Professional Camera Rentals</p>
        </div>
        
        <div style="border-radius: 8px; border: 1px solid #e2e8f0; padding: 30px; margin-bottom: 30px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background-color: #ecf4ff; border-radius: 50%; width: 80px; height: 80px; text-align: center; line-height: 80px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 style="color: #1e3a8a; margin: 20px 0 10px;">Your Rental Request Has Been Received</h2>
            <p style="color: #64748b; margin: 0;">Request ID: ${requestId}</p>
          </div>
          
          <p style="color: #0f172a; margin-bottom: 25px; font-size: 16px;">
            Dear ${rental.customerName},
          </p>
          
          <p style="color: #0f172a; margin-bottom: 25px; line-height: 1.6;">
            Thank you for submitting your rental request with CamQuest. We have received your request and our team will review it shortly. You will receive another notification once your request has been approved.
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #3b82f6; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Rental Summary</h3>
            
            <div style="display: flex; margin-bottom: 20px; align-items: center;">
              <div style="margin-right: 15px; flex-shrink: 0;">
                <img src="${camera.imageUrl}" alt="${camera.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
              </div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #0f172a;">${camera.name}</h4>
                <p style="margin: 0; color: #64748b;">Category: ${camera.category}</p>
              </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Rental Period:</td>
                <td style="padding: 8px 0; text-align: right; color: #0f172a;">${formatDate(startDate)} to ${formatDate(endDate)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Duration:</td>
                <td style="padding: 8px 0; text-align: right; color: #0f172a;">${rentalDays} day${rentalDays !== 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Quantity:</td>
                <td style="padding: 8px 0; text-align: right; color: #0f172a;">${rental.quantity} unit${rental.quantity !== 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Daily Rate:</td>
                <td style="padding: 8px 0; text-align: right; color: #0f172a;">${formatCurrency(camera.pricePerDay)}</td>
              </tr>
              <tr style="font-weight: bold;">
                <td style="padding: 15px 0 8px; color: #0f172a; border-top: 1px solid #e2e8f0;">Total Price:</td>
                <td style="padding: 15px 0 8px; text-align: right; color: #3b82f6; border-top: 1px solid #e2e8f0;">${formatCurrency(rental.totalPrice)}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #0f172a; margin-bottom: 25px; line-height: 1.6;">
            If you have any questions or need to make changes to your rental request, please contact us at <a href="mailto:${ADMIN_EMAIL}" style="color: #3b82f6; text-decoration: none;">${ADMIN_EMAIL}</a>.
          </p>
          
          <p style="color: #0f172a; margin-bottom: 5px;">
            Thank you for choosing CamQuest for your camera rental needs.
          </p>
          
          <p style="color: #0f172a; margin-bottom: 0;">
            Best regards,<br>
            The CamQuest Team
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px 0; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px;">
            This is an automated message. Please do not reply directly to this email.
          </p>
          <p style="margin: 0;">
            &copy; ${new Date().getFullYear()} CamQuest. All rights reserved.
          </p>
        </div>
      </div>
    `;
    
    // Create plain text version as fallback
    const textContent = `
      CAMQUEST - PROFESSIONAL CAMERA RENTALS
      
      YOUR RENTAL REQUEST HAS BEEN RECEIVED
      Request ID: ${requestId}
      
      Dear ${rental.customerName},
      
      Thank you for submitting your rental request with CamQuest. We have received your request and our team will review it shortly. You will receive another notification once your request has been approved.
      
      RENTAL SUMMARY
      Camera: ${camera.name} (${camera.category})
      Rental Period: ${formatDate(startDate)} to ${formatDate(endDate)}
      Duration: ${rentalDays} day${rentalDays !== 1 ? 's' : ''}
      Quantity: ${rental.quantity} unit${rental.quantity !== 1 ? 's' : ''}
      Daily Rate: ${formatCurrency(camera.pricePerDay)}
      Total Price: ${formatCurrency(rental.totalPrice)}
      
      If you have any questions or need to make changes to your rental request, please contact us at ${ADMIN_EMAIL}.
      
      Thank you for choosing CamQuest for your camera rental needs.
      
      Best regards,
      The CamQuest Team
      
      This is an automated message. Please do not reply directly to this email.
      © ${new Date().getFullYear()} CamQuest. All rights reserved.
    `;
    
    // Define email options
    const mailOptions = {
      from: ADMIN_EMAIL,
      to: rental.customerEmail,
      subject: `Your CamQuest Rental Request - Confirmation #${requestId}`,
      text: textContent,
      html: htmlContent
    };
    
    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to customer: ${rental.customerEmail}`);
      console.log(`Email Message ID: ${info.messageId}`);
      return true;
    } catch (emailError) {
      console.error('Failed to send customer confirmation email:', emailError);
      throw emailError; // Re-throw to be caught by the outer try/catch
    }
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    // Print detailed error information for debugging
    if (error && typeof error === 'object') {
      try {
        console.error('Nodemailer error details:', JSON.stringify(error, null, 2));
      } catch (e) {
        console.error('Could not stringify error details');
      }
    }
    return false;
  }
}

export async function sendRentalRequestNotification(rental: RentalRequest, camera: Camera): Promise<boolean> {
  try {
    // Calculate rental duration
    const startDate = new Date(rental.startDate);
    const endDate = new Date(rental.endDate);
    const rentalDays = Math.max(
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      1
    );
    
    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">New Rental Request</h2>
        
        <div style="display: flex; margin-bottom: 20px;">
          <div style="margin-right: 15px;">
            <img src="${camera.imageUrl}" alt="${camera.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
          </div>
          <div>
            <h3 style="margin: 0 0 5px 0;">${camera.name}</h3>
            <p style="margin: 0; color: #666;">Category: ${camera.category}</p>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #3b82f6;">Rental Details</h3>
          <p><strong>Request ID:</strong> RNT-${String(10000 + rental.id).substring(1)}</p>
          <p><strong>Rental Period:</strong> ${formatDate(startDate)} to ${formatDate(endDate)} (${rentalDays} day${rentalDays !== 1 ? 's' : ''})</p>
          <p><strong>Quantity:</strong> ${rental.quantity} unit${rental.quantity !== 1 ? 's' : ''}</p>
          <p><strong>Daily Rate:</strong> ${formatCurrency(camera.pricePerDay)}</p>
          <p><strong>Total Price:</strong> ${formatCurrency(rental.totalPrice)}</p>
          <p><strong>Status:</strong> ${rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #3b82f6;">Customer Information</h3>
          <p><strong>Name:</strong> ${rental.customerName}</p>
          <p><strong>Email:</strong> ${rental.customerEmail}</p>
          <p><strong>Phone:</strong> ${rental.customerPhone}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px;">
          <p>This is an automated notification from CamQuest Rental System.</p>
        </div>
      </div>
    `;
    
    // Create plain text version as fallback
    const textContent = `
      NEW RENTAL REQUEST
      
      Camera: ${camera.name} (${camera.category})
      
      RENTAL DETAILS
      Request ID: RNT-${String(10000 + rental.id).substring(1)}
      Rental Period: ${formatDate(startDate)} to ${formatDate(endDate)} (${rentalDays} day${rentalDays !== 1 ? 's' : ''})
      Quantity: ${rental.quantity} unit${rental.quantity !== 1 ? 's' : ''}
      Daily Rate: ${formatCurrency(camera.pricePerDay)}
      Total Price: ${formatCurrency(rental.totalPrice)}
      Status: ${rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
      
      CUSTOMER INFORMATION
      Name: ${rental.customerName}
      Email: ${rental.customerEmail}
      Phone: ${rental.customerPhone}
      
      This is an automated notification from CamQuest Rental System.
    `;
    
    // Define email options
    const mailOptions = {
      from: ADMIN_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[CamQuest] New Rental Request: ${camera.name}`,
      text: textContent,
      html: htmlContent
    };
    
    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email notification sent to admin: ${ADMIN_EMAIL}`);
      console.log(`Admin email Message ID: ${info.messageId}`);
      
      // Also send a confirmation email to the customer
      await sendCustomerConfirmationEmail(rental, camera);
      
      return true;
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      throw emailError; // Re-throw to be caught by the outer try/catch
    }
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Print more detailed error information for debugging
    if (error && typeof error === 'object') {
      try {
        console.error('Nodemailer error details:', JSON.stringify(error, null, 2));
      } catch (e) {
        console.error('Could not stringify error details');
      }
    }
    return false;
  }
}