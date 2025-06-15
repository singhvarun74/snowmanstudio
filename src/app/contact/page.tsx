
"use client";

import Image from 'next/image';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingLabelInput, FloatingLabelTextarea } from '@/components/ui/floating-label-input';
import { useToast } from "@/hooks/use-toast";
import PageTitle from '@/components/ui/page-title';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { submitContactForm } from '@/lib/actions';

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

function ContactFormContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: { 
      name: "", 
      email: "", 
      subject: searchParams ? (searchParams.get('subject') || "") : "", 
      message: "" 
    },
  });

  useEffect(() => {
    if (searchParams) {
      const subjectParam = searchParams.get('subject');
      if (subjectParam) {
        form.setValue('subject', subjectParam);
      }
    }
  }, [searchParams, form]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const result = await submitContactForm(data);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message,
          duration: 3000,
        });
        form.reset({ subject: searchParams ? (searchParams.get('subject') || "") : "", name: "", email: "", message: "" });
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "Please check your input and try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 bg-card p-6 sm:p-8 md:p-12 rounded-lg shadow-xl">
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" className="flex flex-col">
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8 shadow-md">
          <Image
            src="https://placehold.co/600x450.png"
            alt="Snowman Studio Office exterior"
            data-ai-hint="modern office building"
            fill
            style={{objectFit:"cover"}}
          />
        </div>
        <h3 className="font-headline text-2xl font-semibold mt-4 mb-4 text-primary">Contact Information</h3>
        <ul className="space-y-4 text-foreground">
          <li className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
            <span>123 Frosty Lane, Iceberg City, GL 45678</span>
          </li>
          <li className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
            <a href="mailto:hello@snowmanstudio.com" className="hover:text-primary transition-colors duration-150">
              hello@snowmanstudio.com
            </a>
          </li>
          <li className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
            <a href="tel:+1234567890" className="hover:text-primary transition-colors duration-150">
              +1 (234) 567-890
            </a>
          </li>
        </ul>
      </AnimateOnScroll>

      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-200ms">
        <h3 className="font-headline text-2xl font-semibold mb-6 text-foreground">Send Us a Message</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FloatingLabelInput label="Full Name" type="text" {...field} />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FloatingLabelInput label="Email Address" type="email" {...field} />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FloatingLabelInput label="Subject" type="text" {...field} />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FloatingLabelTextarea label="Your Message" {...field} rows={5} />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-opacity-80 text-lg py-3 mt-4 group transition-all duration-150 ease-out hover:scale-105 shadow-md" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </AnimateOnScroll>
    </div>
  );
}

function ContactPageFallback() {
  return (
     <div className="grid md:grid-cols-2 gap-8 md:gap-12 bg-card p-6 sm:p-8 md:p-12 rounded-lg shadow-xl">
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" className="flex flex-col">
        <Skeleton className="relative h-64 md:h-80 rounded-lg mb-8 shadow-md" />
        <Skeleton className="h-8 w-1/2 mt-4 mb-4" />
        <ul className="space-y-4 text-foreground">
          <li className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
            <Skeleton className="h-5 w-3/4" />
          </li>
          <li className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
            <Skeleton className="h-5 w-1/2" />
          </li>
          <li className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
            <Skeleton className="h-5 w-1/2" />
          </li>
        </ul>
      </AnimateOnScroll>
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-200ms">
        <Skeleton className="h-8 w-3/4 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </AnimateOnScroll>
    </div>
  )
}


export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
      <PageTitle title="Get In Touch" className="text-center" />
      <Suspense fallback={<ContactPageFallback />}>
        <ContactFormContent />
      </Suspense>
    </div>
  );
}
