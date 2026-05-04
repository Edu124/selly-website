import React from "react";
import { Link } from "react-router-dom";

const CONTACT_EMAIL = "hello@selly.in";
const LAST_UPDATED  = "May 2025";

export default function PrivacyPage() {
  return (
    <>
      {/* Nav */}
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-logo" style={{ textDecoration: "none" }}>
          Sell<span>y</span>
        </Link>
        <div className="landing-nav-links">
          <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "var(--purple-dim)", border: "1px solid var(--purple-glow)", borderRadius: 20, padding: "4px 14px", fontSize: 13, color: "var(--purple)", marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ color: "var(--text-2)", fontSize: 15 }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

          <Section title="1. Introduction">
            <p>
              Selly ("we", "our", "us") operates a WhatsApp-based commerce platform that enables businesses
              to automate customer interactions, manage orders, and send promotions via WhatsApp. This Privacy
              Policy explains how we collect, use, store, and protect information when you use our platform —
              whether you are a business owner (our client) or an end customer interacting with a Selly-powered
              WhatsApp bot.
            </p>
            <p>
              By using Selly, you agree to the practices described in this policy. If you do not agree,
              please discontinue use of our services.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <SubHeading>From Business Owners (our clients)</SubHeading>
            <ul>
              <li>Name and email address (used for account creation via Supabase Auth)</li>
              <li>Business name, address, and GST number (entered in settings)</li>
              <li>WhatsApp Business phone number and Meta API credentials</li>
              <li>Product catalog, pricing, and inventory information</li>
              <li>Order data, customer records, and transaction history</li>
              <li>Payment reference IDs (for subscription renewal — we do not store card or bank details)</li>
            </ul>

            <SubHeading>From End Customers (customers of our clients)</SubHeading>
            <ul>
              <li>WhatsApp phone number (received when a customer initiates a conversation)</li>
              <li>Name (shared voluntarily or via WhatsApp profile)</li>
              <li>Order details: products selected, delivery address, and mobile number</li>
              <li>Message content — only to the extent required to process orders and respond to queries</li>
              <li>Purchase history and engagement data (tags such as VIP, new, inactive)</li>
            </ul>

            <SubHeading>Automatically Collected</SubHeading>
            <ul>
              <li>Webhook event metadata from Meta (WhatsApp message timestamps, delivery status)</li>
              <li>Server logs (IP addresses, request paths) for security and debugging — retained for 30 days</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To operate and deliver the Selly platform and its features</li>
              <li>To process customer orders placed via WhatsApp</li>
              <li>To send automated WhatsApp messages on behalf of business owners (order confirmations, status updates, promotions)</li>
              <li>To generate invoices and receipts</li>
              <li>To provide customer analytics and business insights to our clients</li>
              <li>To manage subscriptions and billing</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To improve and develop the platform</li>
            </ul>
            <p>
              We do not use end customer data for advertising, profiling, or any purpose beyond operating
              the service on behalf of the business owner whose bot the customer interacted with.
            </p>
          </Section>

          <Section title="4. WhatsApp and Meta Platform Policy">
            <p>
              Selly uses the <strong>WhatsApp Business Platform (Cloud API)</strong> provided by Meta Platforms, Inc.
              By using Selly, you acknowledge that:
            </p>
            <ul>
              <li>Messages sent and received through Selly are processed via Meta's infrastructure and are subject to <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noreferrer">WhatsApp's Privacy Policy</a>.</li>
              <li>We comply with <a href="https://developers.facebook.com/policy/" target="_blank" rel="noreferrer">Meta's Platform Terms</a> and the WhatsApp Business Policy.</li>
              <li>Business owners are responsible for obtaining valid customer consent before messaging end users via WhatsApp.</li>
              <li>End customers can opt out of receiving messages at any time by sending "STOP" or contacting the business directly.</li>
            </ul>
          </Section>

          <Section title="5. Data Storage and Security">
            <p>
              Customer and order data is stored in a <strong>PostgreSQL database hosted on Railway</strong> (railway.app).
              Business authentication data is stored on <strong>Supabase</strong>. Both providers maintain industry-standard
              security practices including encryption at rest and in transit (TLS).
            </p>
            <p>
              Each business's data is logically isolated by a unique <code>business_id</code>. No business can
              access another business's data.
            </p>
            <p>
              We implement the following security measures:
            </p>
            <ul>
              <li>HTTPS / TLS encryption for all data in transit</li>
              <li>Encrypted storage of access tokens and credentials</li>
              <li>Role-based access — business owners can only access their own data</li>
              <li>Regular security reviews of our infrastructure</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <ul>
              <li><strong>Business account data</strong> — retained for the duration of the subscription and up to 90 days after account closure, after which it is permanently deleted.</li>
              <li><strong>Customer and order data</strong> — retained as long as the business account is active. Business owners may delete individual customer records from the dashboard at any time.</li>
              <li><strong>Server logs</strong> — retained for 30 days and then automatically purged.</li>
              <li><strong>Uploaded media</strong> (product images, promotional files) — retained while the business account is active.</li>
            </ul>
          </Section>

          <Section title="7. Sharing of Information">
            <p>We do not sell, rent, or trade personal information. We share data only in the following circumstances:</p>
            <ul>
              <li><strong>Meta / WhatsApp</strong> — message content and phone numbers are transmitted via Meta's Cloud API to deliver WhatsApp messages. This is governed by Meta's own privacy policy.</li>
              <li><strong>Razorpay</strong> — if a business owner uses Razorpay for payment links, order amounts and customer details are shared with Razorpay solely to process payments. Razorpay's privacy policy applies.</li>
              <li><strong>Supabase / Railway</strong> — our infrastructure providers process data on our behalf under data processing agreements.</li>
              <li><strong>Legal obligation</strong> — we may disclose information if required by law, court order, or to protect the rights and safety of our users.</li>
            </ul>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of personal data we hold about you</li>
              <li><strong>Correction</strong> — request correction of inaccurate data</li>
              <li><strong>Deletion</strong> — request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Opt-out</strong> — end customers may stop receiving WhatsApp messages by replying "STOP" to any message</li>
              <li><strong>Data portability</strong> — business owners may export their order and customer data from the dashboard</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days.
            </p>
          </Section>

          <Section title="9. Cookies">
            <p>
              The Selly web portal (this website) uses minimal browser storage (localStorage) to maintain
              your login session. We do not use third-party tracking cookies or advertising cookies.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>
              Selly is not intended for use by individuals under the age of 18. We do not knowingly collect
              personal data from minors. If you believe a minor has provided us with personal data, please
              contact us and we will promptly delete it.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated"
              date at the top of this page and notify active business account holders via email. Continued use of
              Selly after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              For any privacy-related questions, requests, or concerns, please contact:
            </p>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginTop: 12 }}>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>Selly — Privacy Team</p>
              <p style={{ color: "var(--text-2)" }}>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
              <p style={{ color: "var(--text-2)", marginTop: 4 }}>Made in India 🇮🇳</p>
            </div>
          </Section>

        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">Sell<span>y</span></div>
        <div>AI-powered WhatsApp selling · Made in India</div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--text-3)" }}>{CONTACT_EMAIL}</a>
          <Link to="/privacy" style={{ color: "var(--text-3)" }}>Privacy Policy</Link>
          <Link to="/login"   style={{ color: "var(--text-3)" }}>Sign in</Link>
        </div>
      </footer>
    </>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <section>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "var(--text-1)", paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, color: "var(--text-2)", fontSize: 15, lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }) {
  return (
    <p style={{ fontWeight: 700, color: "var(--text-1)", marginTop: 8, marginBottom: -4 }}>
      {children}
    </p>
  );
}
