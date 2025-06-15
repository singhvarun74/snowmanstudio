
"use client";

import Image from 'next/image';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, MapPin, Phone, Send, Newspaper } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

function NewsletterSection() {
  const brevoFormHtml = `
    <!-- START - We recommend to place the below code where you want the form in your website html  -->
    <div class="sib-form" style="text-align: center; background-color: transparent;">
      <div id="sib-form-container" class="sib-form-container">
        <div id="error-message" class="sib-form-message-panel" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;max-width:540px;">
          <div class="sib-form-message-panel__text sib-form-message-panel__text--center">
            <svg viewBox="0 0 512 512" class="sib-icon sib-notification__icon">
              <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
            </svg>
            <span class="sib-form-message-panel__inner-text">
                              Your subscription could not be saved. Please try again.
                          </span>
          </div>
        </div>
        <div></div>
        <div id="success-message" class="sib-form-message-panel" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#085229; background-color:#e7faf0; border-radius:3px; border-color:#13ce66;max-width:540px;">
          <div class="sib-form-message-panel__text sib-form-message-panel__text--center">
            <svg viewBox="0 0 512 512" class="sib-icon sib-notification__icon">
              <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
            </svg>
            <span class="sib-form-message-panel__inner-text">
                              Your subscription has been successful.
                          </span>
          </div>
        </div>
        <div></div>
        <div id="sib-container" class="sib-container--large sib-container--vertical" style="text-align:center; background-color:hsl(var(--card)); max-width:540px; border-radius: var(--radius); border-width:1px; border-color:hsl(var(--border)); border-style:solid; direction:ltr; padding: 20px;">
          <form id="sib-form" method="POST" action="https://963f730f.sibforms.com/serve/MUIFAHbraVsaQmcjM7aNuo-EuH0d_my4dD8MUwS6EVxJKXNWze_N7gnp9BU-NBpPPMcjlcr824s6j8rEQK_7hxqCCE8htqOGWhV0E15JpuGCnhGinkQqE8nd2HbnFDjuX7HatTDCouyyZF-dQ01xdC9f20PT4vRJXmYtH-4a9o30v65EbQoJXFLLRCH_TXNwdU4TpMnKqWDsBVmw" data-type="subscription">
            <div style="padding: 8px 0;">
              <div class="sib-form-block" style="font-size:20px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:hsl(var(--foreground)); background-color:transparent;">
                <p><strong>Stay Alive... Subscribe</strong></p>
              </div>
            </div>
            <div style="padding: 8px 0;">
              <div class="sib-form-block" style="font-size:14px; text-align:left; font-family:Futura, sans-serif; color:hsl(var(--muted-foreground)); background-color:transparent;">
                <div class="sib-text-form-block">
                  <p><strong>Get exclusive updates, free assets, and early access to our nightmares</strong></p>
                </div>
              </div>
            </div>
            <div style="padding: 8px 0;">
              <div class="sib-input sib-form-block">
                <div class="form__entry entry_block">
                  <div class="form__label-row ">
                    <label class="entry__label" style="font-weight: 700; text-align:left; font-size:14px; font-family:Helvetica, sans-serif; color:hsl(var(--foreground));" for="EMAIL" data-required="*">Your darkest email...</label>
                    <div class="entry__field">
                      <input class="input" style="background-color: hsla(var(--input), 0.8); border-color: hsl(var(--border)); color: hsl(var(--foreground)); border-radius: var(--radius-sm);" type="text" id="EMAIL" name="EMAIL" autocomplete="off" placeholder="A valid email is required (or the snowman finds you)" data-required="true" required />
                    </div>
                  </div>
                  <label class="entry__error entry__error--primary" style="font-size:14px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;">
                  </label>
                </div>
              </div>
            </div>
            <div style="padding: 8px 0;">
              <div class="sib-input sib-form-block">
                <div class="form__entry entry_block">
                  <div class="form__label-row ">
                    <label class="entry__label" style="font-weight: 700; text-align:left; font-size:14px; font-family:Helvetica, sans-serif; color:hsl(var(--foreground));" for="FIRSTNAME" data-required="*">What the snowmen call you...</label>
                    <div class="entry__field">
                      <input class="input" style="background-color: hsla(var(--input), 0.8); border-color: hsl(var(--border)); color: hsl(var(--foreground)); border-radius: var(--radius-sm);" maxlength="200" type="text" id="FIRSTNAME" name="FIRSTNAME" autocomplete="off" placeholder="Your Name" data-required="true" required />
                    </div>
                  </div>
                  <label class="entry__error entry__error--primary" style="font-size:14px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;">
                  </label>
                </div>
              </div>
            </div>
            <div style="padding: 8px 0;">
              <div class="sib-optin sib-form-block" data-required="true">
                <div class="form__entry entry_mcq">
                  <div class="form__label-row ">
                    <label class="entry__label" style="font-weight: 700; text-align:left; font-size:14px; font-family:Helvetica, sans-serif; color:hsl(var(--foreground));" for="OPT_IN" data-required="*">Submit &amp; Survive</label>
                    <div class="entry__choice" style="">
                      <label>
                        <input type="checkbox" class="input_replaced" value="1" id="OPT_IN" name="OPT_IN" required />
                        <span class="checkbox checkbox_tick_positive" style="margin-left:0; border-color: hsl(var(--primary));"></span>
                        <span style="font-size:12px; text-align:left; font-family:Helvetica, sans-serif; color:hsl(var(--muted-foreground)); background-color:transparent;">
                          <p>I crave terror! Send me updates, behind-the-scenes gore, and secret game keys.</p>
                        </span>
                      </label>
                    </div>
                  </div>
                  <label class="entry__error entry__error--primary" style="font-size:14px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;">
                  </label>
                </div>
              </div>
            </div>
            <div style="padding: 8px 0;">
              <div class="sib-form-block" style="text-align: left">
                <button class="sib-form-block__button sib-form-block__button-with-loader" style="font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#FFFFFF; background-color:hsl(var(--primary)); border-radius: var(--radius-sm); border-width:0px; padding: 10px 20px;" form="sib-form" type="submit">
                  <svg class="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512">
                    <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                  </svg>
                  SUBSCRIBE
                </button>
              </div>
            </div>
            <input type="text" name="email_address_check" value="" class="input--hidden">
            <input type="hidden" name="locale" value="en">
          </form>
        </div>
      </div>
    </div>
    <!-- END - We recommend to place the above code where you want the form in your website html  -->
  `;
  return (
    <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-300ms" className="mt-12 md:mt-16">
      <Card className="bg-card shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center flex items-center justify-center">
            <Newspaper className="mr-3 h-7 w-7 text-primary" />
            Stay Updated With Our Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-lg mx-auto" dangerouslySetInnerHTML={{ __html: brevoFormHtml }} />
        </CardContent>
      </Card>
    </AnimateOnScroll>
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
      <NewsletterSection />
    </div>
  );
}
