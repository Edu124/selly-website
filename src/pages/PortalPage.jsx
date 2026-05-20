import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";

const API = "https://instagram-bot-production-04ae.up.railway.app";

const SELLY_APP_URL = "https://github.com/Edu124/selly-app/releases/download/v1.0.0/application-c944dc71-57e8-470d-b76f-bbe7704e7f3d.apk";
const APP_VERSION   = "v1.1.0";
const RELEASE_DATE  = "May 2026";

const changelog = [
  { version: "v1.1.0", note: "Push notifications for new orders, Returns & Refunds screen, return policy on shop page, OTA auto-updates (no reinstall needed), product detail modal on shop page." },
  { version: "v1.0.0", note: "Initial release. AI DM replies, catalog from Instagram posts, auto GST invoices, flash sale & promo campaigns, customer analytics, web shop with Razorpay + COD." },
  { version: "v0.9.0", note: "Beta: order management, customer tagging (VIP/frequent), abandoned cart recovery, billing dashboard." },
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
  const [copiedShop,    setCopiedShop]    = useState(false);
  const [shopSlug,      setShopSlug]      = useState(null);

  const displayName  = profile?.business_name || user?.user_metadata?.business_name || user?.email?.split("@")[0] || "there";
  const businessId   = user?.id || "—";
  const plan         = profile?.plan          || "trial";
  const daysLeft     = profile?.trial_days_left ?? 14;
  const isActive     = plan === "pro" || plan === "team";

  const webhookUrl = `${API}/webhook/buyer?bid=${businessId}`;
  const shopUrl    = shopSlug ? `https://selly.codeforgeai.app/shop/${shopSlug}` : null;

  // Fetch business settings to get the shop slug
  useEffect(() => {
    if (!businessId || businessId === "—") return;
    fetch(`${API}/api/settings?bid=${businessId}`)
      .then(r => r.json())
      .then(d => { if (d.settings?.business_slug) setShopSlug(d.settings.business_slug); })
      .catch(() => {});
  }, [businessId]);

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

  async function copyShopUrl() {
    if (!shopUrl) return;
    await navigator.clipboard.writeText(shopUrl);
    setCopiedShop(true);
    setTimeout(() => setCopiedShop(false), 2000);
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

        {/* Shop Page Card */}
        {shopSlug ? (
          <div className="shop-live-card">
            <div className="shop-live-badge">✓ Your shop page is live</div>
            <div className="shop-live-desc">
              Customers can now discover <strong>{displayName}</strong> on Google, ChatGPT, and other AI platforms.
              Share the link in your Instagram bio.
            </div>
            <div className="cred-row" style={{ marginTop: 12 }}>
              <div className="cred-value" style={{ fontSize: 13 }}>{shopUrl}</div>
              <button className={`copy-btn ${copiedShop ? "copied" : ""}`} onClick={copyShopUrl}>
                {copiedShop ? "Copied ✓" : "Copy link"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
              <a
                href={shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                View shop page →
              </a>
              <a
                href="https://business.google.com/create"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                🗺 Set up Google Business Profile
              </a>
            </div>
          </div>
        ) : (
          <div className="shop-pending-card">
            <div className="shop-pending-icon">🌐</div>
            <div>
              <div className="shop-pending-title">Get your AI-discoverable shop page</div>
              <div className="shop-pending-desc">
                Open the Selly app → Settings → fill in your <strong>Business Name</strong> and <strong>City</strong> → tap Save.
                Your public shop page will be created automatically.
              </div>
            </div>
          </div>
        )}

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
