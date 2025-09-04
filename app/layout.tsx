import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ContentProvider } from '@/components/providers/ContentProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Passing the Fire - Watani Stiner',
  description: 'A Sacred Invitation for Young Black Truth-Seekers. Join Watani Stiner for circles of truth-telling, memory, and movement.',
  openGraph: {
    title: 'Passing the Fire - Watani Stiner',
    description: 'A Sacred Invitation for Young Black Truth-Seekers. Join Watani Stiner for circles of truth-telling, memory, and movement.',
    images: [
      {
        url: 'https://pub-b36625a09e404435935ae0e838f9c35d.r2.dev/Thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Passing the Fire - Watani Stiner',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passing the Fire - Watani Stiner',
    description: 'A Sacred Invitation for Young Black Truth-Seekers. Join Watani Stiner for circles of truth-telling, memory, and movement.',
    images: ['https://pub-b36625a09e404435935ae0e838f9c35d.r2.dev/Thumbnail.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className} suppressHydrationWarning={true}>
        <ContentProvider>
          {children}
        </ContentProvider>
      </body>
    </html>
  )
}
