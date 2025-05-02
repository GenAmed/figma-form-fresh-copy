
import type { NotificationType } from "./types";

// In a real app, this would connect to a backend API to send emails
// Since we don't have a backend, this is a mock implementation

/**
 * Send an email notification
 * 
 * @param recipient Email address to send to
 * @param subject Subject line
 * @param body Email body
 * @param type Type of notification for styling
 * @returns Promise that resolves when the email is "sent"
 */
export const sendEmail = async (
  recipient: string,
  subject: string,
  body: string,
  type: NotificationType = "info"
): Promise<boolean> => {
  // This would be replaced with an actual API call
  console.log(`[EMAIL SERVICE] Sending ${type} email to ${recipient}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, we would return true/false based on API response
  return true;
};

/**
 * Send an email to all administrators
 * 
 * @param subject Subject line
 * @param body Email body
 * @param type Type of notification for styling
 * @returns Promise that resolves when emails are sent
 */
export const sendEmailToAdmins = async (
  subject: string,
  body: string,
  type: NotificationType = "info"
): Promise<boolean> => {
  // In a real app, we would fetch admin emails from the database
  // For now, we'll use a mock list
  const adminEmails = [
    "admin@avem-industrie.fr",
    "direction@avem-industrie.fr"
  ];
  
  try {
    // Send email to each admin
    const results = await Promise.all(
      adminEmails.map(email => sendEmail(email, subject, body, type))
    );
    
    // Return true if all emails were sent successfully
    return results.every(result => result === true);
  } catch (error) {
    console.error("Failed to send admin emails:", error);
    return false;
  }
};
