
"use client";

import Link from 'next/link';
import { Twitter, Instagram, Youtube } from 'lucide-react'; 
import Logo from '@/components/icons/logo';
import { cn } from '@/lib/utils';

const DiscordIconFooter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M19.625 3.008c-.897-.403-1.85-.72-2.828-.948-.075-.023-.153-.023-.225.002-.504.138-.965.345-1.383.613-.004.004-.006.006-.01.01l-.018.016c-1.302.986-2.43 2.23-3.34 3.694-1.308.204-2.636.204-3.944 0-.91-1.464-2.038-2.708-3.34-3.694l-.018-.016-.01-.01c-.418-.268-.88-.475-1.383-.613-.075-.023-.153-.023-.225.002-.978.228-1.93.545-2.828.948-.092.043-.165.11-.21.2-.048.09-.055.198-.02.292.54 1.548 1.17 3.482 1.682 5.772-.004.023-.004.047.002.068 0 .012.004.023.004.035-.15.652-.264 1.247-.332 1.78-.015.112.01.22.07.308.113.168.31.26.502.235.96-.125 1.845-.38 2.62-.73.014-.006.027-.012.04-.02-.075-.067-.14-.142-.2-.223-.35-.41-.64-.87-.85-1.38-.002-.004-.002-.006-.002-.01 0-.04.01-.07.03-.1.394-.63.93-1.21 1.57-1.72.93-.74 1.99-1.29 3.14-1.6.17-.04.34-.04.51 0 .01.002.02.004.03.006.09.02.18.04.27.06.11.03.22.05.33.08.12.03.24.06.36.09.14.04.28.07.42.11.09.03.18.05.27.08.02.004.03.01.05.01.06.02.12.03.18.05.01.002.02.004.02.006.11.03.22.06.34.09.06.01.11.03.17.04.09.02.18.04.26.06.1.03.19.05.29.07.02.004.03.01.05.01.06.02.11.03.17.05.06.01.12.03.18.04.05.01.09.02.14.03.06.02.12.03.18.04.05.01.09.02.14.03.02.003.04.006.05.008l.05.02c1.15.31 2.21.86 3.14 1.6.64.51 1.176 1.09 1.57 1.72.02.03.03.06.03.1 0 .004 0 .006-.002.01-.21.51-.5.97-.85 1.38-.06.08-.125.156-.2.223.013.008.026.014.04.02.775.35 1.66.605 2.62.73.192.024.39-.067.502-.235.06-.088.085-.196.07-.308-.067-.533-.182-1.128-.332-1.78 0-.012.004-.023.004-.035a.2.2 0 0 0 .002-.068c.512-2.29 1.142-4.224 1.682-5.772.036-.094.028-.202-.02-.292-.045-.09-.118-.157-.21-.2zm-8.43 8.566c-.872 0-1.58-.726-1.58-1.628s.708-1.628 1.58-1.628c.872 0 1.58.726 1.58 1.628s-.708 1.628-1.58 1.628zm-5.336 0c-.872 0-1.58-.726-1.58-1.628s.708-1.628 1.58-1.628c.872 0 1.58.726 1.58 1.628s-.708 1.628-1.58 1.628z"/>
  </svg>
);

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { icon: <Instagram className="h-6 w-6" />, href: 'https://www.instagram.com/thesnowmanstudio/', label: 'Instagram' },
  { icon: <Youtube className="h-6 w-6" />, href: 'https://www.youtube.com/@thesnowmanstudio', label: 'YouTube' },
  { icon: <Twitter className="h-6 w-6" />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <DiscordIconFooter />, href: 'https://discord.gg/eUCKmk6GNt', label: 'Discord' },
];

export default function Footer() {
  return (
    <footer className="bg-background text-snow-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Snowman Studio. <br/>All rights reserved.
            </p>
          </div>

          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={cn(
                        "hover:text-accent transition-all duration-150 ease-out text-sm",
                        "hover:text-shadow-glow-primary"
                      )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  aria-label={social.label} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-accent transition-colors duration-150"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Newsletter</h5>
            <p className="text-sm text-gray-400">
              Stay updated! Sign up on our <Link href="/contact" className={cn("underline hover:text-accent transition-colors duration-150 ease-out", "hover:text-shadow-glow-primary")}>Contact page</Link>.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p>Snowman Studio - Not all snowmen melt</p>
        </div>
      </div>
    </footer>
  );
}
