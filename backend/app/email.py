import emails
from emails.template import JinjaTemplate
from pathlib import Path
from .config import settings
import sys
import io


def send_email(
    email_to: str,
    subject: str,
    html_content: str
):
    """Send email using SMTP"""
    if not settings.EMAILS_ENABLED:
        print(f"[EMAIL] Would send to {email_to}: {subject}")
        return True
    
    try:
        message = emails.Message(
            subject=subject,
            html=html_content,
            mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
            charset='utf-8'
        )
        
        smtp_options = {
            "host": settings.SMTP_HOST,
            "port": settings.SMTP_PORT,
            "user": settings.SMTP_USER,
            "password": settings.SMTP_PASSWORD,
            "tls": True
        }
        
        response = message.send(to=email_to, smtp=smtp_options)
        print(f"[EMAIL] Successfully sent to {email_to}")
        return response
    except Exception as e:
        # Don't crash on email errors, just log them
        print(f"[EMAIL] Failed to send: {str(e)[:100]}")
        return False


def send_welcome_email(email_to: str, username: str, name: str):
    """Send welcome email to new user"""
    subject = "Welcome to Feastverse!"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #ff2c55 0%, #ffb703 100%);
                padding: 40px 20px;
                text-align: center;
            }}
            .header h1 {{
                color: #ffffff;
                margin: 0;
                font-size: 32px;
                font-weight: 800;
            }}
            .content {{
                padding: 40px 30px;
                color: #333333;
                line-height: 1.6;
            }}
            .content h2 {{
                color: #ff2c55;
                font-size: 24px;
                margin-bottom: 20px;
            }}
            .username-box {{
                background-color: #f8f8f8;
                border-left: 4px solid #ff2c55;
                padding: 15px 20px;
                margin: 20px 0;
                border-radius: 4px;
            }}
            .username-box strong {{
                color: #ff2c55;
                font-size: 18px;
            }}
            .features {{
                background-color: #f8f8f8;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .features ul {{
                margin: 10px 0;
                padding-left: 20px;
            }}
            .features li {{
                margin: 10px 0;
            }}
            .button {{
                display: inline-block;
                background: linear-gradient(135deg, #ff2c55 0%, #ffb703 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 15px 30px;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }}
            .footer {{
                background-color: #f8f8f8;
                padding: 30px;
                text-align: center;
                color: #666666;
                font-size: 14px;
            }}
            .social {{
                margin: 20px 0;
            }}
            .social a {{
                color: #ff2c55;
                text-decoration: none;
                margin: 0 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍽️ Feastverse</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px;">Welcome to the Foodie Universe!</p>
            </div>
            
            <div class="content">
                <h2>Hey {name}! 👋</h2>
                
                <p>We're thrilled to have you join the Feastverse community! You've just unlocked a world of culinary adventures, delicious discoveries, and foodie connections.</p>
                
                <div class="username-box">
                    <p style="margin: 0;">Your username: <strong>@{username}</strong></p>
                </div>
                
                <div class="features">
                    <h3 style="margin-top: 0; color: #333;">What you can do on Feastverse:</h3>
                    <ul>
                        <li>📹 <strong>Share Food Reels</strong> - Upload your culinary creations</li>
                        <li>🍽️ <strong>Discover Restaurants</strong> - Find the best eats near you</li>
                        <li>⭐ <strong>Write Reviews</strong> - Share your dining experiences</li>
                        <li>🛒 <strong>Order Food</strong> - Get your favorites delivered</li>
                        <li>❤️ <strong>Follow & Like</strong> - Connect with fellow foodies</li>
                        <li>📱 <strong>Create Stories</strong> - Share your food journey</li>
                    </ul>
                </div>
                
                <p>Ready to dive in? Start exploring restaurants, uploading your food reels, and connecting with the community!</p>
                
                <center>
                    <a href="{settings.FRONTEND_URL}" class="button">Start Your Food Journey →</a>
                </center>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    <strong>Pro Tip:</strong> You can change your username anytime in your profile settings!
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Feastverse</strong> - Where Food Lovers Unite</p>
                <div class="social">
                    <a href="#">Instagram</a> •
                    <a href="#">Twitter</a> •
                    <a href="#">Facebook</a>
                </div>
                <p style="font-size: 12px; color: #999; margin-top: 20px;">
                    You received this email because you signed up for Feastverse.<br>
                    If you didn't sign up, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(email_to, subject, html_content)


def send_username_change_email(email_to: str, old_username: str, new_username: str, name: str):
    """Send email when username is changed"""
    subject = "Username Updated - Feastverse"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #ff2c55 0%, #ffb703 100%);
                padding: 30px 20px;
                text-align: center;
            }}
            .header h1 {{
                color: #ffffff;
                margin: 0;
                font-size: 28px;
            }}
            .content {{
                padding: 40px 30px;
                color: #333333;
            }}
            .change-box {{
                background-color: #f8f8f8;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            }}
            .old {{
                color: #999;
                text-decoration: line-through;
                font-size: 16px;
            }}
            .new {{
                color: #ff2c55;
                font-size: 24px;
                font-weight: 700;
                margin-top: 10px;
            }}
            .footer {{
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
                color: #666666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✨ Username Updated</h1>
            </div>
            
            <div class="content">
                <p>Hey {name}!</p>
                
                <p>Your username has been successfully updated on Feastverse.</p>
                
                <div class="change-box">
                    <div class="old">@{old_username}</div>
                    <div style="font-size: 24px; margin: 10px 0;">↓</div>
                    <div class="new">@{new_username}</div>
                </div>
                
                <p>Your new username is now active across the platform. You can use it to login and your profile is now accessible at <strong>@{new_username}</strong>.</p>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    If you didn't make this change, please contact our support team immediately.
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Feastverse</strong> - Where Food Lovers Unite</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(email_to, subject, html_content)


def send_profile_update_email(email_to: str, name: str, username: str, changes: dict):
    """Send email when any profile field is updated"""
    subject = "Profile Updated - Feastverse"
    
    # Build changes list
    changes_html = ""
    field_labels = {
        "bio": "Bio",
        "website": "Website",
        "phone": "Phone Number",
        "picture": "Profile Picture"
    }
    
    for field, value in changes.items():
        if field in field_labels:
            label = field_labels[field]
            if field == "picture":
                changes_html += f"""
                <li><strong>{label}:</strong> Updated successfully</li>
                """
            else:
                display_value = value if value else "(Removed)"
                changes_html += f"""
                <li><strong>{label}:</strong> {display_value}</li>
                """
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #ff2c55 0%, #ffb703 100%);
                padding: 30px 20px;
                text-align: center;
            }}
            .header h1 {{
                color: #ffffff;
                margin: 0;
                font-size: 28px;
            }}
            .content {{
                padding: 40px 30px;
                color: #333333;
                line-height: 1.6;
            }}
            .changes-box {{
                background-color: #f8f8f8;
                border-left: 4px solid #ff2c55;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
            }}
            .changes-box h3 {{
                margin-top: 0;
                color: #ff2c55;
            }}
            .changes-box ul {{
                margin: 10px 0;
                padding-left: 20px;
            }}
            .changes-box li {{
                margin: 10px 0;
            }}
            .button {{
                display: inline-block;
                background: linear-gradient(135deg, #ff2c55 0%, #ffb703 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 12px 25px;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }}
            .footer {{
                background-color: #f8f8f8;
                padding: 20px;
                text-align: center;
                color: #666666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✏️ Profile Updated</h1>
            </div>
            
            <div class="content">
                <p>Hey {name}! 👋</p>
                
                <p>Your Feastverse profile has been successfully updated.</p>
                
                <div class="changes-box">
                    <h3>Changes Made:</h3>
                    <ul>
                        {changes_html}
                    </ul>
                </div>
                
                <p>You can view your updated profile anytime at <strong>@{username}</strong>.</p>
                
                <center>
                    <a href="{settings.FRONTEND_URL}/u/{username}" class="button">View Your Profile →</a>
                </center>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    If you didn't make these changes, please contact our support team immediately for security purposes.
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Feastverse</strong> - Where Food Lovers Unite</p>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">
                    You received this email because your account was updated.<br>
                    This is a security notification to keep you informed of changes to your account.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(email_to, subject, html_content)
