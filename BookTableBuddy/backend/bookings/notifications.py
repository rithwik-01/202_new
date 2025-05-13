from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
import logging
import time
import os


logger = logging.getLogger(__name__)

def send_booking_confirmation(booking):
    """
    Send confirmation email when a booking is confirmed using Django's built-in email functionality
    
    Args:
        booking: The Booking object
    """
    try:
        print(f"Starting to send confirmation email for booking {booking.id} using Django's email system")
        
        # Create a more eye-catching subject with restaurant name
        subject = f"Your reservation at {booking.table.restaurant.name} is confirmed! - DineTable"
        
        # Format the date and time for better readability
        formatted_date = booking.date.strftime("%A, %B %d, %Y")
        
        # Create plain text message
        message = f"""Hello {booking.contact_name},

Your reservation at {booking.table.restaurant.name} has been confirmed!

Reservation Details:
- Date: {formatted_date}
- Time: {booking.time}
- Party Size: {booking.party_size} people
- Confirmation Code: BTB-{booking.id}

Restaurant Location:
{booking.table.restaurant.address}
{booking.table.restaurant.city}, {booking.table.restaurant.state} {booking.table.restaurant.zip_code}

If you need to cancel or modify your reservation, please log in to your BookTableBuddy account.

Thank you for using BookTableBuddy!
        """
        
        # Set recipient email
        recipient_email = booking.contact_email
        print(f"Recipient email: {recipient_email}")
        
        try:
            # Get the sender email from settings
            from_email = settings.EMAIL_HOST_USER
            
            # Send email using Django's send_mail function
            print("Sending email using Django's email system...")
            message = message.replace('BookTableBuddy', 'DineTable')
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            
            print("Email sent successfully!")
            return True
                
        except Exception as email_error:
            print(f"Error during email sending: {str(email_error)}")
            print(f"Error type: {type(email_error).__name__}")
            raise  # Re-raise for outer exception handler
        
        return True
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {str(e)}")
        print(f"Final error: {str(e)}")
        return False



