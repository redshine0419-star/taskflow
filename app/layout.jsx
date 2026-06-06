import './globals.css'

export const metadata = {
  title: 'TaskGrid — Serverless Kanban on Google Drive',
  description:
    'BYOD kanban board that stores all data in your own Google Drive. Two-way real-time sync with Google Sheets. AI meeting parser powered by Gemini 2.5 Flash.',
  keywords: [
    'kanban board', 'asana alternative', 'jira alternative', 'free kanban',
    'google drive project management', 'serverless task manager',
  ],
  openGraph: {
    title: 'TaskGrid — Serverless Kanban on Google Drive',
    description: 'Your tasks, your Drive. Zero central server.',
    type: 'website',
    url: 'https://taskgrid.my',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VEMNPNXGMY" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-VEMNPNXGMY');
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
