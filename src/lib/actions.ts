
"use server";

import { z } from "zod";
import * as Brevo from '@getbrevo/brevo';

const NewsletterSchema = z.object({
  email: z.string().email(),
});

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const validation = NewsletterSchema.safeParse({ email });
  if (!validation.success) {
    return { success: false, message: "Invalid email address." };
  }

  if (!process.env.BREVO_API_KEY) {
    console.error('Brevo API key is not configured.');
    return { success: false, message: "Subscription service is currently unavailable." };
  }

  const apiInstance = new Brevo.ContactsApi();
  apiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

  const createContact = new Brevo.CreateContact();
  createContact.email = validation.data.email;
  // IMPORTANT: Replace 123 with your actual Brevo newsletter list ID (number)
  // You can find this in your Brevo account under Contacts -> Lists
  createContact.listIds = [123]; 
  // createContact.attributes = { "FIRSTNAME": "OptionalFirstName", "LASTNAME": "OptionalLastName" };

  try {
    await apiInstance.createContact(createContact);
    console.log('Contact added to Brevo newsletter list:', validation.data.email);
    return { success: true, message: "Successfully subscribed to the newsletter!" };
  } catch (error: any) {
    console.error('Brevo API error - subscribeToNewsletter:', error.response?.body || error.message || error);
    return { success: false, message: "Failed to subscribe. Please try again later." };
  }
}

const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormResponse {
    success: boolean;
    message: string;
    errors?: z.inferFlattenedErrors<typeof ContactFormSchema>["fieldErrors"];
}

export async function submitContactForm(formData: ContactFormPayload): Promise<ContactFormResponse> {
  const validation = ContactFormSchema.safeParse(formData);
  if (!validation.success) {
    const firstError = validation.error.errors[0]?.message || "Invalid form data.";
    return { success: false, message: firstError, errors: validation.error.flatten().fieldErrors };
  }

  if (!process.env.BREVO_API_KEY) {
    console.error('Brevo API key is not configured for contact form.');
    return { success: false, message: "Message service is currently unavailable." };
  }

  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = `Contact Form: ${validation.data.subject}`;
  sendSmtpEmail.htmlContent = \`
    <html>
      <body>
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> \${validation.data.name}</p>
        <p><strong>Email:</strong> \${validation.data.email}</p>
        <p><strong>Subject:</strong> \${validation.data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>\${validation.data.message.replace(/\\n/g, "<br>")}</p>
      </body>
    </html>\`;
  // IMPORTANT: Replace with a sender email verified in your Brevo account.
  sendSmtpEmail.sender = { name: "Snowman Studio Contact Form", email: "contactform@your-verified-domain.com" }; 
  sendSmtpEmail.to = [{ email: "hello@snowmanstudio.com", name: "Snowman Studio Admin" }]; 
  // Optionally, send a bcc to the user, but ensure your Brevo plan supports this and be mindful of spam.
  // sendSmtpEmail.bcc = [{ email: validation.data.email, name: validation.data.name }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Contact form email sent via Brevo.');
    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error: any) {
    console.error('Brevo API error - submitContactForm:', error.response?.body || error.message || error);
    return { success: false, message: "Failed to send your message. Please try again later." };
  }
}
