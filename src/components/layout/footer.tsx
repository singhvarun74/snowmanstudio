
"use client";

import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Twitter, Send, Instagram, Youtube } from 'lucide-react'; 
import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { subscribeToNewsletter } from '@/lib/actions';

const NewsletterSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type NewsletterFormValues = z.infer<typeof NewsletterSchema>;

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { icon: <Instagram className="h-6 w-6" />, href: 'https://www.instagram.com/thesnowmanstudio/', label: 'Instagram' },
  { icon: <Youtube className="h-6 w-6" />, href: 'https://www.youtube.com/@thesnowmanstudio', label: 'YouTube' },
  { icon: <Twitter className="h-6 w-6" />, href: 'https://twitter.com', label: 'Twitter' },
];

export default function Footer() {
  const { toast } = useToast();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      const result = await subscribeToNewsletter(data.email); 

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message || "You've subscribed to our newsletter.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
      });
    }
  };

  return (
    <footer className="bg-charcoal text-snow-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Copyright */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Snowman Studio. <br/>All rights reserved.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition-colors duration-150 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Icons */}
          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors duration-150">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Newsletter</h5>
            <p className="text-sm text-gray-400 mb-3">Stay updated with our latest games and news.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start space-x-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                          className="bg-gray-700 border-gray-600 text-snow-white placeholder-gray-500 focus:ring-accent focus:border-accent h-10"
                          aria-label="Newsletter email input"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400 mt-1" />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" size="icon" className="bg-accent hover:bg-opacity-80 text-accent-foreground h-10 w-10 shrink-0 transition-transform duration-150 ease-out hover:scale-105" disabled={form.formState.isSubmitting} aria-label="Subscribe to newsletter">
                  {form.formState.isSubmitting ? <div className="h-5 w-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div> : <Send className="h-5 w-5" />}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p>Snowman Studio - Not all snowmen melt</p>
        </div>
      </div>
    </footer>
  );
}
