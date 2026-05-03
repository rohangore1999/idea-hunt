import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ideahunt.app'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d0d0d' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0d' },
  ],
}

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'IdeaHunt — Startup & product ideas from the internet',
    template: '%s | IdeaHunt',
  },
  description: 'Discover startup and product ideas aggregated from Reddit, Hacker News, Dev.to and more. Browse 100+ categorised ideas updated every 6 hours.',
  keywords: ['startup ideas', 'product ideas', 'indie hacker', 'build in public', 'saas ideas', 'reddit ideas', 'hacker news ideas'],
  authors: [{ name: 'IdeaHunt' }],
  creator: 'IdeaHunt',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'IdeaHunt',
    title: 'IdeaHunt — Startup & product ideas from the internet',
    description: 'Discover startup and product ideas aggregated from Reddit, Hacker News, Dev.to and more.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'IdeaHunt' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaHunt — Startup & product ideas from the internet',
    description: 'Discover startup and product ideas aggregated from Reddit, Hacker News, Dev.to and more.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'IdeaHunt',
  url: BASE_URL,
  description: 'Discover startup and product ideas aggregated from Reddit, Hacker News, Dev.to and more.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col dark font-sans overflow-x-hidden" suppressHydrationWarning>{children}</body>
    </html>
  );
}
