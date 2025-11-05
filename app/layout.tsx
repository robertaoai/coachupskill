import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'AI Skills Coach - Built with ChatAndBuild',
  description: 'Assess your AI readiness and unlock your potential',
  keywords: 'no-code, app builder, conversation-driven development, AI assessment, skills coach',
  openGraph: {
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Assess your AI readiness and unlock your potential',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Assess your AI readiness and unlock your potential',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
    site: '@chatandbuild',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
