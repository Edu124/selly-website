import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const SELLY_APP_URL = "https://github.com/Edu124/selly-app/releases/download/v1.0.0/application-4f9feb38-c197-4531-ac40-0b3732fb1ece.apk";

const features = [
  { icon: "🤖", title: "AI-Powered DM Replies", desc: "Customers DM your Instagram page — Selly's AI instantly replies, shows the catalog, takes the order and confirms it. Zero manual effort." },
  { icon: "🏭", title: "Industry-Based Catalog", desc: "Built for Education, Product businesses, and Tourism. Add courses with fees & duration, clothing with sizes & colors, or tour packages with destinations — each with the right fields." },
  { icon: "📸", title: "Photo Upload for Products", desc: "Snap a photo or pick from gallery directly when adding products. Photos are stored securely and shown to customers in the catalog." },
  { icon: "🧾", title: "Auto GST Invoices", desc: "Every order gets a professional GST invoice generated automatically. Send it to the customer via DM in seconds." },
  { icon: "👥", title: "Customer Intelligence", desc: "See every customer's order history, total spend, referrals, and tags (VIP, frequent buyer) — all in one place." },
  { icon: "🎬", title: "Video Blast Promotions", desc: "Send product showcase videos, sale announcements, or course demos directly to customer segments via WhatsApp. With 30+ ready-to-use message templates." },
  { icon: "📣", title: "Smart Promotions", desc: "Flash sales, new arrival alerts, abandoned cart recovery, and segment broadcasts — target VIPs, new customers, or inactive buyers with one tap." },
  { icon: "📊", title: "Seller Dashboard", desc: "Track revenue, orders, and commissions in real time. Manage everything from the Selly mobile app — even offline." },
];

const steps = [
  { n: "1", title: "Connect your Instagram", desc: "Link your business Instagram page to Selly via ManyChat in under 5 minutes." },
  { n: "2", title: "Add your products", desc: "Paste Instagram post URLs — Selly fills in all product details automatically." },
  { n: "3", title: "Go live", desc: "Your Instagram DMs are now a 24/7 AI-powered shop. Selly takes orders while you sleep." },
  { n: "4", title: "Manage from app", desc: "Track orders, update status, manage customers, and send promos from the Selly mobile app." },
];

const testimonials = [
  { stars: 5, text: "I used to spend 4+ hours a day replying to DMs. Now Selly handles everything and I just pack the orders. My sales doubled in the first month.", author: "Priya S.", role: "Fashion Boutique · Mumbai" },
  { stars: 5, text: "The auto-invoice feature alone is worth the price. No more WhatsApp screenshots — every order has a proper GST bill instantly.", author: "Rahul M.", role: "Streetwear Brand · Bangalore" },
  { stars: 5, text: "My customers can't even tell it's a bot. The AI is that good. Orders come in at 2 AM and everything is confirmed by morning.", author: "Anjali K.", role: "Ethnic Wear · Delhi" },
];

export default function LandingPage() {
  return (
    <>
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">Sell<span>y</span></div>
        <div className="landing-nav-links">
          <a href="#features" className="btn btn-ghost btn-sm">Features</a>
          <a href="#pricing"  className="btn btn-ghost btn-sm">Pricing</a>
          <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start free trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span>✨</span> Powered by AI · Built for Indian Instagram sellers
        </div>
        <h1 className="hero-title">
          Your Instagram DMs just became a{" "}
          <em>24/7 AI salesman</em>
        </h1>
        <p className="hero-sub">
          Selly's AI replies to every DM, shows your catalog, takes orders, generates invoices — all automatically. You just pack and ship.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary btn-lg">Start 14-day free trial →</Link>
          <a href="#how-it-works" className="btn btn-outline btn-lg">See how it works</a>
        </div>
        <p className="hero-note">No credit card required · 14-day free trial · Cancel anytime</p>
      </section>

      {/* Stats */}
      <div className="stats-strip">
        <div className="stat-cell"><div className="stat-num">₹0</div><div className="stat-label">Upfront cost</div></div>
        <div className="stat-cell"><div className="stat-num">24/7</div><div className="stat-label">Automated selling</div></div>
        <div className="stat-cell"><div className="stat-num">5 min</div><div className="stat-label">Setup time</div></div>
      </div>

      {/* How it works */}
      <section className="section" id="how-it-works">
        <h2 className="section-title">How Selly works</h2>
        <p className="section-sub">Set up once. Sell forever.</p>
        <div className="steps-grid">
          {steps.map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <h2 className="section-title">Everything you need to sell on Instagram</h2>
        <p className="section-sub">One tool replaces your entire manual sales process.</p>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <h2 className="section-title">Sellers love Selly</h2>
        <p className="section-sub">Join hundreds of Instagram shops already automating with Selly.</p>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div className="testimonial-card" key={t.author}>
              <div className="testimonial-stars">{"★".repeat(t.stars)}</div>
              <div className="testimonial-text">"{t.text}"</div>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-role">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Download app */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="app-banner">
          <div className="app-banner-text">
            <h3>Manage your shop on the go</h3>
            <p>
              Download the Selly mobile app to manage orders, update product stock, view customer details, and send promotions — right from your phone.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <a href={SELLY_APP_URL} className="btn btn-primary">⬇ Download APK (Android)</a>
              <Link to="/register" className="btn btn-outline">Create account first</Link>
            </div>
          </div>
          {/* QR Code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              background: "#fff", padding: 16, borderRadius: 16,
              boxShadow: "0 0 0 1px var(--border)",
            }}>
              <QRCodeSVG
                value={SELLY_APP_URL}
                size={140}
                bgColor="#ffffff"
                fgColor="#0a0a0f"
                level="M"
              />
            </div>
            <p style={{ fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>
              Scan with your phone camera<br />to download the app
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-sub">No hidden fees. No contracts. Just sell.</p>
        <div className="pricing-grid">
          {/* Trial */}
          <div className="pricing-card">
            <div className="pricing-plan">Free Trial</div>
            <div className="pricing-price">₹0 <span>/ 14 days</span></div>
            <div className="pricing-note">Full access, no card required</div>
            <hr className="pricing-divider" />
            <ul className="pricing-features">
              <li>AI DM replies (unlimited)</li>
              <li>Up to 20 products in catalog</li>
              <li>Order & customer management</li>
              <li>Auto GST invoices</li>
              <li>Selly mobile app</li>
              <li>14 days full access</li>
            </ul>
            <Link to="/register" className="btn btn-outline" style={{ width: "100%" }}>Start free trial →</Link>
          </div>

          {/* Pro */}
          <div className="pricing-card popular">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-plan">Pro Plan</div>
            <div className="pricing-price">₹3,000 <span>/ month</span></div>
            <div className="pricing-note">+ 5% commission on promo orders above ₹1,000</div>
            <hr className="pricing-divider" />
            <ul className="pricing-features">
              <li>Everything in Trial</li>
              <li>Unlimited products + photo upload</li>
              <li>Flash sale & promo campaigns</li>
              <li>🎬 Video blast to customer segments</li>
              <li>30+ ready-made promo templates</li>
              <li>Abandoned cart recovery</li>
              <li>Advanced customer analytics</li>
              <li>Priority support</li>
            </ul>
            <Link to="/register" className="btn btn-primary" style={{ width: "100%" }}>Start free trial →</Link>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-3)", marginTop: 24 }}>
          Commission is only charged on orders where a promo message was sent and item price exceeds ₹1,000.
          Regular orders have zero commission.
        </p>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="cta-banner">
          <h2>Ready to automate your Instagram shop?</h2>
          <p>Start selling 24/7 with AI. No credit card needed. Full access for 14 days.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create free account →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">Sell<span>y</span></div>
        <div>AI-powered Instagram selling · Made in India</div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="mailto:hello@selly.in" style={{ color: "var(--text-3)" }}>hello@selly.in</a>
          <Link to="/privacy"  style={{ color: "var(--text-3)" }}>Privacy Policy</Link>
          <Link to="/login"    style={{ color: "var(--text-3)" }}>Sign in</Link>
          <Link to="/register" style={{ color: "var(--text-3)" }}>Sign up</Link>
        </div>
      </footer>
    </>
  );
}
