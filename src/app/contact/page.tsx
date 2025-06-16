
"use client";

import { Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"; // Kept in case other actions on this page might use it in future
import PageTitle from '@/components/ui/page-title';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Copied from homepage, consider moving to a shared icons file if used in more places
const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.625 3.008c-.897-.403-1.85-.72-2.828-.948-.075-.023-.153-.023-.225.002-.504.138-.965.345-1.383.613-.004.004-.006.006-.01.01l-.018.016c-1.302.986-2.43 2.23-3.34 3.694-1.308.204-2.636.204-3.944 0-.91-1.464-2.038-2.708-3.34-3.694l-.018-.016-.01-.01c-.418-.268-.88-.475-1.383-.613-.075-.023-.153-.023-.225.002-.978.228-1.93.545-2.828.948-.092.043-.165.11-.21.2-.048.09-.055.198-.02.292.54 1.548 1.17 3.482 1.682 5.772-.004.023-.004.047.002.068 0 .012.004.023.004.035-.15.652-.264 1.247-.332 1.78-.015.112.01.22.07.308.113.168.31.26.502.235.96-.125 1.845-.38 2.62-.73.014-.006.027-.012.04-.02-.075-.067-.14-.142-.2-.223-.35-.41-.64-.87-.85-1.38-.002-.004-.002-.006-.002-.01 0-.04.01-.07.03-.1.394-.63.93-1.21 1.57-1.72.93-.74 1.99-1.29 3.14-1.6.17-.04.34-.04.51 0 .01.002.02.004.03.006.09.02.18.04.27.06.11.03.22.05.33.08.12.03.24.06.36.09.14.04.28.07.42.11.09.03.18.05.27.08.02.004.03.01.05.01.06.02.12.03.18.05.01.002.02.004.02.006.11.03.22.06.34.09.06.01.11.03.17.04.09.02.18.04.26.06.1.03.19.05.29.07.02.004.03.01.05.01.06.02.11.03.17.05.06.01.12.03.18.04.05.01.09.02.14.03.06.02.12.03.18.04.05.01.09.02.14.03.02.003.04.006.05.008l.05.02c1.15.31 2.21.86 3.14 1.6.64.51 1.176 1.09 1.57 1.72.02.03.03.06.03.1 0 .004 0 .006-.002.01-.21.51-.5.97-.85 1.38-.06.08-.125.156-.2.223.013.008.026.014.04.02.775.35 1.66.605 2.62.73.192.024.39-.067.502-.235.06-.088.085-.196.07-.308-.067-.533-.182-1.128-.332-1.78 0-.012.004-.023.004-.035a.2.2 0 0 0 .002-.068c.512-2.29 1.142-4.224 1.682-5.772.036-.094.028-.202-.02-.292-.045-.09-.118-.157-.21-.2zm-8.43 8.566c-.872 0-1.58-.726-1.58-1.628s.708-1.628 1.58-1.628c.872 0 1.58.726 1.58 1.628s-.708 1.628-1.58 1.628zm-5.336 0c-.872 0-1.58-.726-1.58-1.628s.708-1.628 1.58-1.628c.872 0 1.58.726 1.58 1.628s-.708 1.628-1.58 1.628z"/>
  </svg>
);


function ContactFormContent() {
  // Brevo form HTML, moved from NewsletterSection
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
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 bg-card p-6 sm:p-8 md:p-12 rounded-lg shadow-xl">
      {/* --- LEFT COLUMN: DISCORD ONLY --- */}
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" className="flex flex-col space-y-8 justify-center">
        <div className="pt-6">
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary text-center md:text-left">Connect on Discord</h3>
          <p className="text-muted-foreground mb-6 text-sm text-center md:text-left">
            Join our community server to chat with the devs, get sneak peeks, and connect with other players.
          </p>
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 transition-transform duration-150 ease-out shadow-lg hover:shadow-xl w-full py-3">
            <Link href="https://discord.gg/eUCKmk6GNt" target="_blank" rel="noopener noreferrer">
              <DiscordIcon />
              Join our Discord Server
            </Link>
          </Button>
        </div>
      </AnimateOnScroll>

      {/* --- RIGHT COLUMN: NEWSLETTER --- */}
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-200ms">
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
    </div>
  );
}


function ContactPageFallback() {
  return (
     <div className="grid md:grid-cols-2 gap-8 md:gap-12 bg-card p-6 sm:p-8 md:p-12 rounded-lg shadow-xl">
      {/* Left Column Skeleton - Discord Only */}
      <div className="flex flex-col space-y-8 justify-center">
        <div className="pt-6">
          <Skeleton className="h-8 w-3/4 mb-4 mx-auto md:mx-0" /> {/* "Connect on Discord" title */}
          <Skeleton className="h-4 w-full mb-2" /> {/* Description line 1 */}
          <Skeleton className="h-4 w-5/6 mb-6" /> {/* Description line 2 */}
          <Skeleton className="h-12 w-full py-3" /> {/* Discord Button */}
        </div>
      </div>
      {/* Right Column Skeleton (Newsletter) */}
       <div>
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" /> {/* Title */}
          <Skeleton className="h-8 w-full mb-2" /> {/* Subtitle */}
          <Skeleton className="h-12 w-full mb-3" /> {/* Email Input */}
          <Skeleton className="h-12 w-full mb-3" /> {/* Name Input */}
          <Skeleton className="h-8 w-full mb-3" /> {/* Checkbox line */}
          <Skeleton className="h-12 w-1/2 mx-auto" /> {/* Button */}
        </div>
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

    