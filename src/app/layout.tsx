
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Snowman Studio',
  description: 'Passion Meets Play - Snowman Studio Official Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        {/* START - Brevo Form recommended head content */}
        <style>
          {`
            @font-face {
              font-display: block;
              font-family: Roboto;
              src: url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/7529907e9eaf8ebb5220c5f9850e3811.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/25c678feafdc175a70922a116c9be3e7.woff) format("woff")
            }

            @font-face {
              font-display: fallback;
              font-family: Roboto;
              font-weight: 600;
              src: url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/6e9caeeafb1f3491be3e32744bc30440.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/71501f0d8d5aa95960f6475d5487d4c2.woff) format("woff")
            }

            @font-face {
              font-display: fallback;
              font-family: Roboto;
              font-weight: 700;
              src: url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/3ef7cf158f310cf752d5ad08cd0e7e60.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/ece3a1d82f18b60bcce0211725c476aa.woff) format("woff")
            }

            #sib-container input:-ms-input-placeholder {
              text-align: left;
              font-family: Helvetica, sans-serif;
              /* color: #c0ccda; */ /* Brevo default, might be overridden by theme */
              color: #000000; /* User provided */
            }

            #sib-container input::placeholder {
              text-align: left;
              font-family: Helvetica, sans-serif;
              /* color: #c0ccda; */ /* Brevo default, might be overridden by theme */
               color: #000000; /* User provided */
            }

            #sib-container textarea::placeholder {
              text-align: left;
              font-family: Helvetica, sans-serif;
              /* color: #c0ccda; */ /* Brevo default, might be overridden by theme */
               color: #000000; /* User provided */
            }

            #sib-container a {
              text-decoration: underline;
              color: #2BB2FC;
            }
          `}
        </style>
        <link rel="stylesheet" href="https://sibforms.com/forms/end-form/build/sib-styles.css" />
        {/* END - Brevo Form recommended head content */}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
        {/* START - Brevo Form recommended footer scripts */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
          window.LOCALE = 'en';
          window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
          window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";
          window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
          window.translation = {
            common: {
              selectedList: '{quantity} list selected',
              selectedLists: '{quantity} lists selected',
              selectedOption: '{quantity} selected',
              selectedOptions: '{quantity} selected',
            }
          };
          var AUTOHIDE = Boolean(0);
        `}} />
        <script defer src="https://sibforms.com/forms/end-form/build/main.js"></script>
        {/* END - Brevo Form recommended footer scripts */}
      </body>
    </html>
  );
}
