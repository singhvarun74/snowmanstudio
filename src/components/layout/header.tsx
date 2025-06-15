
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const lastScrollY = useRef(0);
  const [showHeader, setShowHeader] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDown = currentScrollY > lastScrollY.current;
      const minScrollDiff = 10; // Minimum scroll difference to trigger a change

      if (currentScrollY <= minScrollDiff) { // At the very top or very close to it
        setShowHeader(true);
      } else if (scrollDown && currentScrollY > lastScrollY.current + minScrollDiff) {
        // Scrolling down significantly
        setShowHeader(false);
      } else if (!scrollDown && currentScrollY < lastScrollY.current - minScrollDiff) {
        // Scrolling up significantly
        setShowHeader(true);
      }
      // If scroll difference is too small, do nothing to prevent jitter
      
      lastScrollY.current = Math.max(0, currentScrollY); // Update last scroll position, ensure it's not negative
    };

    // Initialize header visibility based on current scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted]); // Effect runs once after mount

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out',
        // Removed 'bg-background shadow-md' to make it transparent
        showHeader ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      {/* Header Content */}
      <div
        className={cn(
          'container mx-auto px-4 flex justify-between items-center',
          'py-2' // Consistent padding for the content within the transparent header
        )}
      >
        <Link href="/" aria-label="Snowman Studio Home" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
          <Logo className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 relative group',
                  pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'
                )}
              >
                {link.label}
                <span className={cn(
                  'absolute left-0 bottom-[-4px] h-[2px] bg-primary transition-all duration-200 ease-out',
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-card text-card-foreground p-0">
              <div className="flex justify-between items-center p-4 border-b">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-8 w-auto" />
                </Link>
                <SheetClose asChild>
                   <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="h-6 w-6 text-foreground" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col items-center space-y-6 p-8">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'text-xl font-medium transition-colors duration-200',
                        pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="flex justify-center pb-8 pt-4 border-t">
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
