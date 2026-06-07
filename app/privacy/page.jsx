export const metadata = {
  title: 'Privacy Policy | TaskGrid',
  description: 'Privacy Policy for TaskGrid — how we collect, use, and protect your information.',
  alternates: { canonical: 'https://www.taskgrid.my/privacy' },
}

export default function PrivacyPage() {
  return (
    <main style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#09090b', color: '#f4f4f5',
      minHeight: '100vh',
    }}>
      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #27272a',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 17, textDecoration: 'none', color: '#f4f4f5' }}>
          Task<span style={{ color: '#34d399' }}>Grid</span>
        </a>
        <a href="/" style={{
          fontSize: 13, fontWeight: 700, textDecoration: 'none',
          background: '#10b981', color: '#fff',
          padding: '7px 14px', borderRadius: 8,
        }}>Get Started Free</a>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#71717a', fontSize: 14, marginBottom: 48 }}>Last updated: June 7, 2026</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>1. Overview</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid ("we", "our", or "us") operates the website https://www.taskgrid.my. This Privacy Policy explains how we handle information when you use our service. TaskGrid is designed with privacy in mind: your project data is stored directly in your own Google Drive, not on our servers.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>2. Information We Collect</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa', marginBottom: 12 }}>
            <strong style={{ color: '#f4f4f5' }}>Google Account Information:</strong> When you sign in with Google, we receive your name, email address, and profile picture from Google OAuth. We use your email address solely to identify your account and determine access permissions.
          </p>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa', marginBottom: 12 }}>
            <strong style={{ color: '#f4f4f5' }}>Project Data:</strong> All task and project data you create in TaskGrid is stored in a Google Spreadsheet created in your own Google Drive. We do not store your project data on our servers.
          </p>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            <strong style={{ color: '#f4f4f5' }}>Usage Data:</strong> We use Google Analytics to collect anonymized usage statistics such as page views and session duration. This data does not personally identify you.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>3. How We Use Google APIs</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid uses the Google Sheets API and Google Drive API solely to create and manage spreadsheets in your own Google Drive on your behalf. We request only the minimum necessary permissions. Your Google data is never shared with third parties and is never used for advertising purposes.
          </p>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa', marginTop: 12 }}>
            TaskGrid's use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" style={{ color: '#34d399' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>4. Data Storage and Security</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            Your project data lives in your Google Drive. TaskGrid's servers store only blog content in a PostgreSQL database (Neon). We do not store your Google OAuth tokens on our servers; they are kept in your browser's session storage and expire automatically.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>5. Data Sharing</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            We do not sell, trade, or share your personal information with third parties. We do not use your data for advertising. The only third-party service with access to your data is Google, through whose APIs our service operates.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>6. Your Rights</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            You may revoke TaskGrid's access to your Google account at any time through your <a href="https://myaccount.google.com/permissions" style={{ color: '#34d399' }}>Google Account permissions page</a>. Revoking access will disconnect TaskGrid from your Google Drive. Your data in Google Drive remains yours and is not deleted by revoking access.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>7. Cookies</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid uses session storage (not cookies) to maintain your login state. Google Analytics uses cookies to collect anonymized usage data. You may disable cookies in your browser settings at any time.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>8. Children's Privacy</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>9. Changes to This Policy</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>10. Contact</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            If you have questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:redshine0419@gmail.com" style={{ color: '#34d399' }}>redshine0419@gmail.com</a>
          </p>
        </section>
      </div>
    </main>
  )
}
