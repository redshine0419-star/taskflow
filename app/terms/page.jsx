export const metadata = {
  title: 'Terms of Service | TaskGrid',
  description: 'Terms of Service for TaskGrid — rules and conditions for using our service.',
  alternates: { canonical: 'https://www.taskgrid.my/terms' },
}

export default function TermsPage() {
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
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: '#71717a', fontSize: 14, marginBottom: 48 }}>Last updated: June 7, 2026</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>1. Acceptance of Terms</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            By accessing or using TaskGrid at https://www.taskgrid.my, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>2. Description of Service</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid is a free project management tool that provides a visual kanban board interface built on top of Google Sheets. When you sign in with your Google account, TaskGrid creates a spreadsheet in your Google Drive and uses it to store your project data. The service is provided free of charge.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>3. Google Account and Permissions</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid requires a Google account to use. By signing in, you authorize TaskGrid to access your Google Drive and Google Sheets on your behalf, solely for the purpose of creating and managing your project data spreadsheet. You may revoke this access at any time through your Google account settings.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>4. Your Data</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            Your project data is stored in your own Google Drive. You retain full ownership of your data. TaskGrid does not claim any ownership rights over the content you create. You are responsible for the content you store and share through the service.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>5. Acceptable Use</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa', marginBottom: 12 }}>You agree not to use TaskGrid to:</p>
          <ul style={{ color: '#a1a1aa', lineHeight: 2, paddingLeft: 24 }}>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Transmit malicious code or interfere with the service</li>
            <li>Attempt to gain unauthorized access to other users' data</li>
            <li>Use the service for any unlawful or harmful purpose</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>6. Service Availability</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid is provided "as is" without any guarantee of uptime or availability. We may modify, suspend, or discontinue the service at any time without prior notice. We are not liable for any loss of data or business resulting from service interruptions.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>7. Disclaimer of Warranties</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            TaskGrid is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>8. Limitation of Liability</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            To the fullest extent permitted by law, TaskGrid shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, even if we have been advised of the possibility of such damages.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>9. Changes to Terms</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#34d399' }}>10. Contact</h2>
          <p style={{ lineHeight: 1.8, color: '#a1a1aa' }}>
            If you have questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:redshine0419@gmail.com" style={{ color: '#34d399' }}>redshine0419@gmail.com</a>
          </p>
        </section>
      </div>
    </main>
  )
}
