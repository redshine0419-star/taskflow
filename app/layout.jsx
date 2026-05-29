import './globals.css'

export const metadata = {
  title: 'TaskFlow — Serverless Kanban on Google Drive',
  description:
    'BYOD kanban board that stores all data in your own Google Drive. Two-way real-time sync with Google Sheets. AI meeting parser powered by Gemini 2.5 Flash.',
  keywords: [
    'kanban board', 'asana alternative', 'jira alternative', 'free kanban',
    'google drive project management', 'serverless task manager',
  ],
  openGraph: {
    title: 'TaskFlow — Serverless Kanban on Google Drive',
    description: 'Your tasks, your Drive. Zero central server.',
    type: 'website',
    url: 'https://taskflow.vercel.app',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
