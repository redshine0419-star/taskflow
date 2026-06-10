import { headers } from 'next/headers'
import './globals.css'

export const metadata = {
  title: 'TaskGrid — Serverless Kanban on Google Drive',
  description:
    'BYOD kanban board that stores all data in your own Google Drive. Two-way real-time sync with Google Sheets. AI meeting parser powered by Gemini 2.5 Flash.',
  keywords: [
    'kanban board', 'asana alternative', 'jira alternative', 'free kanban',
    'google drive project management', 'serverless task manager',
  ],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'TaskGrid — Serverless Kanban on Google Drive',
    description: 'Your tasks, your Drive. Zero central server.',
    type: 'website',
    url: 'https://taskgrid.my',
  },
}

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const lang = headersList.get('x-lang') ?? 'en'

  return (
    <html lang={lang}>
      <head>
        <link rel="alternate" hrefLang="ko" href="https://www.taskgrid.my/" />
        <link rel="alternate" hrefLang="en" href="https://en.taskgrid.my/" />
        <link rel="alternate" hrefLang="x-default" href="https://en.taskgrid.my/" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0CY0YYXTBX" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0CY0YYXTBX');
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
