import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";

const SELLY_APP_URL = "https://github.com/Edu124/selly-app/releases/download/v1.0.0/application-e6d993a0-9406-4a5e-ade0-abb9055206bf.apk";
const APP_VERSION   = "v1.0.0";
const RELEASE_DATE  = "Apr 2026";

const changelog = [
  { version: "v1.0.0", note: "Initial release. AI DM replies, catalog from Instagram posts, auto GST invoices, flash sale & promo campaigns, customer analytics." },
  { version: "v0.9.0", note: "Beta: order management, customer tagging (VIP/frequent), abandoned cart recovery, billing dashboard." },
  { version: "v0.8.0", note: "Alpha: ManyChat webhook integration, basic catalog builder, order status tracking." },
];

const setupSteps = [
  ["1", "Create a ManyChat account at manychat.com and connect your Instagram business page."],
  ["2", "In ManyChat, go to Settings → API and copy your API key. You'll need it in the next step."],
  ["3", "In ManyChat, create a new flow. Set the trigger to 'Customer sends a DM'. Add an 'External Request' action pointing to your Selly webhook URL below."],
  ["4", "Paste your Business ID into the flow so Selly knows which shop the message belongs to."],
  ["5", "Download the Selly mobile app, enter your Business ID on first launch, and you're ready."],
  ["6", "Add your first products by pasting Instagram post URLs in the app → Catalog → Add product."],
];

export default function PortalPage() {
  const { user, profile, signOut } = useAuth();
  const [copiedId,      setCopiedId]      = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const displayName  = profile?.business_name || user?.user_metadata?.business_name || user?.email?.split("@")[0] || "there";
  const businessId   = profile?.business_id   || user?.id?.split("-")[0]?.toUpperCase() || "—";
  const plan         = profile?.plan          || "trial";
  const daysLeft     = profile?.trial_days_left ?? 14;
  const isActive     = plan === "pro" || plan === "team";

  const webhookUrl = `https://instagram-bot-production-ef01.up.railway.app/webhook/buyer?bid=${businessId}`;

  async function copyId() {
    await navigator.clipboard.writeText(businessId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  async function copyWebhook() {
    await navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  }

  function handleDownload() {
    const a = document.createElement("a");
    a.href = SELLY_APP_URL;
    a.download = `Selly_${APP_VERSION}.apk`;
    a.click();
  }

  return (
    <div className="portal-layout">
      {/* Nav */}
      <nav className="portal-nav">
        <div className="portal-nav-logo">Sell<span>y</span></div>
        <div className="portal-nav-right">
          <span className="portal-nav-user">{user?.email}</span>
          <button className="btn btn-outline btn-sm" onClick={signOut}>Sign out</button>
        </div>
      </nav>

      {/* Body */}
      <div className="portal-body">
        <div className="portal-greeting">Hey, {displayName} 👋</div>
        <div className="portal-sub">Your Selly dashboard — setup guide, app download, and account details.</div>

        {/* Stats cards */}
        <div className="portal-cards">
          <div className="portal-card">
            <div className="portal-card-label">Plan</div>
            <div className="portal-card-value" style={{ textTransform: "capitalize" }}>{plan}</div>
            <div className="portal-card-badge" style={isActive
              ? { background: "var(--green-dim)", color: "var(--green)" }
              : { background: "var(--purple-dim)", color: "var(--purple)" }
            }>
              {isActive ? "✓ Active" : `⏱ Trial — ${daysLeft} days left`}
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-label">Monthly fee</div>
            <div className="portal-card-value">₹3,000</div>
            <div className="portal-card-sub">+ 5% on promo orders &gt; ₹1k</div>
          </div>

          <div className="portal-card">
            <div className="portal-card-label">App version</div>
            <div className="portal-card-value">{APP_VERSION}</div>
            <div className="portal-card-sub">Released {RELEASE_DATE}</div>
          </div>

          <div className="portal-card">
            <div className="portal-card-label">Platform</div>
            <div className="portal-card-value">Android</div>
            <div className="portal-card-sub">Instagram · ManyChat</div>
          </div>
        </div>

        {/* Business ID */}
        <div className="cred-box">
          <div className="cred-label">Your Business ID</div>
          <div className="cred-row">
            <div className="cred-value">{businessId}</div>
            <button className={`copy-btn ${copiedId ? "copied" : ""}`} onClick={copyId}>
              {copiedId ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 10 }}>
            Enter this ID in the Selly mobile app on first launch. Also include it in your ManyChat webhook URL.
          </p>
        </div>

        {/* Webhook URL */}
        <div className="cred-box">
          <div className="cred-label">ManyChat Webhook URL</div>
          <div className="cred-row">
            <div className="cred-value" style={{ fontSize: 13 }}>{webhookUrl}</div>
            <button className={`copy-btn ${copiedWebhook ? "copied" : ""}`} onClick={copyWebhook}>
              {copiedWebhook ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 10 }}>
            Paste this URL into your ManyChat flow's External Request action. This is how Instagram DMs reach Selly's AI.
          </p>
        </div>

        {/* Download card */}
        <div className="download-card">
          <div className="download-card-info">
            <div className="download-card-version">{APP_VERSION}</div>
            <div className="download-card-title">Selly Mobile App (Android)</div>
            <div className="download-card-meta">
              Android APK · Requires Android 8.0+<br />
              Manage orders, catalog, customers, and promotions from your phone.
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleDownload} style={{ marginTop: 16 }}>
              ⬇ Download APK
            </button>
          </div>
          {/* QR Code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#fff", padding: 14, borderRadius: 14 }}>
              <QRCodeSVG
                value={SELLY_APP_URL}
                size={130}
                bgColor="#ffffff"
                fgColor="#0a0a0f"
                level="M"
              />
            </div>
            <p style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
              Scan to download on phone
            </p>
          </div>
        </div>

        {/* Setup guide */}
        <div className="setup-card">
          <div className="setup-card-title">Quick setup guide</div>
          {setupSteps.map(([n, step]) => (
            <div key={n} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
              <div style={{
                minWidth: 26, height: 26, borderRadius: "50%",
                background: "var(--purple-dim)", color: "var(--purple)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{n}</div>
              <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, paddingTop: 3 }}>{step}</div>
            </div>
          ))}
        </div>

        {/* Changelog */}
        <div className="changelog-card">
          <div className="changelog-title">Release Notes</div>
          {changelog.map(c => (
            <div key={c.version} className="changelog-entry">
              <div className="changelog-version">{c.version}</div>
              <div className="changelog-note">{c.note}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, padding: "20px 0", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            Need help? Email <a href="mailto:hello@selly.in" style={{ color: "var(--purple)" }}>hello@selly.in</a>
          </p>
          {!isActive && (
            <a href="mailto:hello@selly.in?subject=Upgrade Selly to Pro"
              className="btn btn-primary btn-sm">
              ⚡ Upgrade to Pro — ₹3,000/month
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
