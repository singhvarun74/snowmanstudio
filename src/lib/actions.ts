"use server";

import { z } from "zod";

const NewsletterSchema = z.object({
  email: z.string().email(),
});

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const validation = NewsletterSchema.safeParse({ email });
  if (!validation.success) {
    return { success: false, message: "Invalid email address." };
  }

  // In a real app, you would save this to Firestore or another database.
  // e.g., await db.collection("mailing_list").add({ email: validation.data.email, subscribedAt: new Date() });
  console.log(`Subscribing ${validation.data.email} to newsletter.`);

  // Simulate success
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return { success: true, message: "Successfully subscribed to the newsletter!" };
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
    // Get first error message
    const firstError = validation.error.errors[0]?.message || "Invalid form data.";
    return { success: false, message: firstError, errors: validation.error.flatten().fieldErrors };
  }

  // In a real app, you would call a Firebase Function or send an email.
  // e.g., await firebase.functions().httpsCallable('sendContactEmail')(validation.data);
  console.log("Contact form submitted:", validation.data);

  // Simulate success
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return { success: true, message: "Your message has been sent successfully!" };
}
