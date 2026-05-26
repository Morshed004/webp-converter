import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://webp-converter-six.vercel.app"),

  title: {
    default: "Free WebP Converter – Convert JPG & PNG to WebP Online Instantly",
    template: "%s | WebP Converter",
  },

  description:
    "Convert JPG and PNG images to highly optimized WebP format instantly with a fast, modern, and secure online WebP converter. Built with Next.js 16, React 19, Tailwind CSS v4, and Sharp for lightning-fast image processing.",

  keywords: [
    "WebP converter",
    "convert JPG to WebP",
    "convert PNG to WebP",
    "online WebP converter",
    "free WebP converter",
    "image compressor",
    "image optimization tool",
    "Next.js image converter",
    "Sharp WebP conversion",
    "fast image converter",
    "modern image converter",
    "WebP optimizer",
    "convert images online",
    "compress JPG",
    "compress PNG",
    "image processing app",
  ],

  authors: [
    {
      name: "Golam Morshed",
      url: "https://webp-converter-six.vercel.app",
    },
  ],

  creator: "Golam Morshed",
  publisher: "Golam Morshed",

  alternates: {
    canonical: "https://webp-converter-six.vercel.app",
  },

  openGraph: {
    type: "website",
    url: "https://webp-converter-six.vercel.app",
    title: "Free WebP Converter – Convert JPG & PNG to WebP Online Instantly",
    description:
      "Fast and secure WebP converter built with Next.js 16 and Sharp. Convert JPG and PNG images to optimized WebP format instantly.",
    siteName: "WebP Converter",
    locale: "en_US",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebP Converter Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Free WebP Converter – JPG & PNG to WebP",
    description:
      "Convert JPG and PNG images into optimized WebP format instantly with a modern and blazing-fast converter.",
    creator: "@golammorshed",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "technology",

  applicationName: "WebP Converter",

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        publicSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}

        <Script
          id="webapp-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "WebP Converter",
              url: "https://webp-converter-six.vercel.app",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "All",
              creator: {
                "@type": "Person",
                name: "Golam Morshed",
              },
              description:
                "A fast and modern online WebP converter that converts JPG and PNG images into optimized WebP format instantly.",
              browserRequirements: "Requires JavaScript",
            }),
          }}
        />
      </body>
    </html>
  );
}
