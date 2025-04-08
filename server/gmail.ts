import nodemailer from 'nodemailer';
import { RentalRequest, Camera } from '@shared/schema';
import { format } from 'date-fns';

// Admin email address to send notifications to
const ADMIN_EMAIL = 'kaleb.gill420@gmail.com';

// Create a nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
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
 * Send a rental request notification email to the admin
 */
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
    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${ADMIN_EMAIL}`);
    return true;
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