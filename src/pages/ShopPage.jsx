import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const API = "https://instagram-bot-production-ef01.up.railway.app";

const INDUSTRY_LABELS = {
  product    : "Fashion & Clothing",
  education  : "Education & Courses",
  tourism    : "Travel & Tours",
  kirana     : "Grocery & Kirana",
  cakes      : "Cakes & Bakery",
  icecream   : "Ice Cream & Desserts",
};

const INDUSTRY_EMOJI = {
  product    : "👗",
  education  : "🎓",
  tourism    : "✈️",
  kirana     : "🛒",
  cakes      : "🎂",
  icecream   : "🍦",
};

function formatPrice(p) {
  return "₹" + Number(p).toLocaleString("en-IN");
}

function InstaLink({ handle }) {
  if (!handle) return null;
  const url = `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="shop-contact-btn shop-contact-insta"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      Message on Instagram
    </a>
  );
}

function WALink({ number, businessName }) {
  if (!number) return null;
  const clean = number.replace(/\D/g, "");
  const msg   = encodeURIComponent(`Hi, I found you on Selly! I'd like to know more about ${businessName}.`);
  const url   = `https://wa.me/${clean}?text=${msg}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="shop-contact-btn shop-contact-wa"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat on WhatsApp
    </a>
  );
}

// ── Checkout Modal ────────────────────────────────────────────────────────────
function CheckoutModal({ cart, shop, onClose, onSuccess }) {
  const [step,       setStep]       = useState("cart");   // cart | details | otp | payment | done
  const [customer,   setCustomer]   = useState({ name: "", email: "", phone: "", address: "" });
  const [otp,        setOtp]        = useState("");
  const [otpToken,   setOtpToken]   = useState(null);
  const [otpSent,    setOtpSent]    = useState(false);
  const [payMode,    setPayMode]    = useState("cod");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [result,     setResult]     = useState(null);

  const isProduct = ["product","kirana","cakes","icecream"].includes(shop.industry);

  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const gstRate    = shop.gst_enabled !== false ? (shop.gst_rate || 5) : 0;
  const gstAmt     = Math.round(subtotal * gstRate / 100);
  const delivery   = shop.free_above > 0 && subtotal >= shop.free_above ? 0 : (shop.delivery_charge || 0);
  const codFee     = payMode === "cod" ? (shop.cod_fee || 0) : 0;
  const total      = subtotal + gstAmt + delivery + codFee;

  async function sendOtp() {
    if (!customer.email) return setError("Please enter your email first.");
    setLoading(true); setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: customer.email,
        options: { shouldCreateUser: true, emailRedirectTo: undefined },
      });
      if (error) throw new Error(error.message);
      setOtpSent(true);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    setLoading(true); setError("");
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: customer.email, token: otp, type: "email",
      });
      if (error) throw new Error(error.message);
      setOtpToken(data.session?.access_token);
      setStep("payment");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function placeOrder() {
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/web/order`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bid: shop.business_id, cart: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty, size: i.size || "" })),
          customer, payment_mode: payMode, otp_token: otpToken,
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setResult(d);
      setStep("done");
      onSuccess && onSuccess(d);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="checkout-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal">
        <div className="checkout-header">
          <div className="checkout-title">
            {step === "cart"    && "Your Cart"}
            {step === "details" && "Your Details"}
            {step === "otp"     && "Verify Email"}
            {step === "payment" && "Payment"}
            {step === "done"    && "Order Placed! 🎉"}
          </div>
          {step !== "done" && <button className="checkout-close" onClick={onClose}>✕</button>}
        </div>

        <div className="checkout-body">
          {error && <div className="checkout-error">{error}</div>}

          {/* ── Step: Cart review ── */}
          {step === "cart" && (
            <>
              {cart.map((item, i) => (
                <div key={i} className="checkout-item">
                  <div className="checkout-item-name">{item.name}{item.size ? ` (${item.size})` : ""}</div>
                  <div className="checkout-item-meta">× {item.qty} &nbsp;·&nbsp; ₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                </div>
              ))}
              <div className="checkout-divider" />
              <div className="checkout-totals">
                <div className="checkout-total-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                {gstAmt > 0 && <div className="checkout-total-row"><span>GST ({gstRate}%)</span><span>₹{gstAmt.toLocaleString("en-IN")}</span></div>}
                {delivery > 0 && <div className="checkout-total-row"><span>Delivery</span><span>₹{delivery.toLocaleString("en-IN")}</span></div>}
                <div className="checkout-total-row grand"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
              </div>
              <button className="checkout-btn" onClick={() => setStep("details")}>Proceed →</button>
            </>
          )}

          {/* ── Step: Customer details ── */}
          {step === "details" && (
            <>
              <input className="checkout-input" placeholder="Your name *" value={customer.name} onChange={e => setCustomer(c => ({...c, name: e.target.value}))} />
              <input className="checkout-input" placeholder="Email address *" type="email" value={customer.email} onChange={e => setCustomer(c => ({...c, email: e.target.value}))} />
              <input className="checkout-input" placeholder="Phone number" type="tel" value={customer.phone} onChange={e => setCustomer(c => ({...c, phone: e.target.value}))} />
              {isProduct && <textarea className="checkout-input checkout-textarea" placeholder="Delivery address *" value={customer.address} onChange={e => setCustomer(c => ({...c, address: e.target.value}))} rows={3} />}
              <button className="checkout-btn" onClick={() => {
                if (!customer.name || !customer.email) return setError("Name and email are required.");
                if (isProduct && !customer.address) return setError("Delivery address is required.");
                setError(""); setStep("otp");
              }}>Continue →</button>
            </>
          )}

          {/* ── Step: Email OTP ── */}
          {step === "otp" && (
            <>
              <p className="checkout-otp-info">We'll send a 6-digit code to <b>{customer.email}</b> to confirm your order.</p>
              {!otpSent ? (
                <button className="checkout-btn" onClick={sendOtp} disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
              ) : (
                <>
                  <input className="checkout-input checkout-otp-input" placeholder="Enter 6-digit OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,""))} />
                  <button className="checkout-btn" onClick={verifyOtp} disabled={loading || otp.length !== 6}>{loading ? "Verifying..." : "Verify & Continue →"}</button>
                  <button className="checkout-btn-ghost" onClick={sendOtp} disabled={loading}>Resend OTP</button>
                </>
              )}
            </>
          )}

          {/* ── Step: Payment ── */}
          {step === "payment" && (
            <>
              <p className="checkout-otp-info">Choose how you'd like to pay for your order of <b>₹{total.toLocaleString("en-IN")}</b>.</p>
              <div className="checkout-pay-options">
                <label className={`checkout-pay-option ${payMode === "cod" ? "selected" : ""}`}>
                  <input type="radio" value="cod" checked={payMode === "cod"} onChange={() => setPayMode("cod")} />
                  <div><div className="checkout-pay-label">💵 Cash on Delivery</div><div className="checkout-pay-sub">{shop.cod_fee > 0 ? `+₹${shop.cod_fee} COD fee` : "No extra charge"}</div></div>
                </label>
                <label className={`checkout-pay-option ${payMode === "online" ? "selected" : ""}`}>
                  <input type="radio" value="online" checked={payMode === "online"} onChange={() => setPayMode("online")} />
                  <div><div className="checkout-pay-label">💳 Pay Online</div><div className="checkout-pay-sub">UPI, Card, Net Banking via Razorpay</div></div>
                </label>
              </div>
              <button className="checkout-btn" onClick={placeOrder} disabled={loading}>{loading ? "Placing order..." : "Place Order →"}</button>
            </>
          )}

          {/* ── Step: Done ── */}
          {step === "done" && result && (
            <>
              <div className="checkout-success-icon">✓</div>
              <p className="checkout-success-msg">Order <b>#{result.order_id}</b> placed! Confirmation sent to <b>{customer.email}</b>.</p>
              {result.delivery_otp && (
                <div className="checkout-otp-box">
                  🔒 Delivery OTP: <strong>{result.delivery_otp}</strong>
                  <p style={{ fontSize: 12, marginTop: 4, color: "#888" }}>Share this with the delivery person.</p>
                </div>
              )}
              {result.pay_link && (
                <a href={result.pay_link} target="_blank" rel="noopener noreferrer" className="checkout-btn" style={{ display: "block", textAlign: "center", textDecoration: "none", marginTop: 16 }}>
                  Pay Now →
                </a>
              )}
              <button className="checkout-btn-ghost" onClick={onClose} style={{ marginTop: 8 }}>Close</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { slug } = useParams();
  const [shop,    setShop]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [reels,    setReels]    = useState([]);
  const [cart,     setCart]     = useState([]);
  const [checkout, setCheckout] = useState(false);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) return prev.map((i, n) => n === idx ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/public/shop/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d  => { setShop(d); setLoading(false); })
      .catch(e => { setError(e === 404 ? "Shop not found." : "Failed to load shop."); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (!shop?.instagram_enabled) return;
    fetch(`${API}/public/shop/${slug}/reels`)
      .then(r => r.json())
      .then(d => setReels(d.reels || []))
      .catch(() => {});
  }, [slug, shop?.instagram_enabled]);

  // Inject Schema.org JSON-LD for AI/search engine discovery
  useEffect(() => {
    if (!shop) return;
    const el = document.getElementById("shop-schema");
    if (el) el.remove();
    const script = document.createElement("script");
    script.id   = "shop-schema";
    script.type = "application/ld+json";
    const schema = {
      "@context"        : "https://schema.org",
      "@type"           : "LocalBusiness",
      "name"            : shop.business_name,
      "description"     : `${shop.business_name} — ${INDUSTRY_LABELS[shop.industry] || "Business"} in ${shop.city || "India"}. Shop online and chat directly on WhatsApp or Instagram.`,
      "url"             : `https://selly.codeforgeai.app/shop/${shop.slug}`,
      "address"         : {
        "@type"           : "PostalAddress",
        "addressLocality" : shop.city || "",
        "addressCountry"  : "IN",
        "streetAddress"   : shop.business_address || "",
      },
      "telephone"        : shop.whatsapp_number || "",
      "sameAs"           : shop.instagram_handle
        ? [`https://www.instagram.com/${shop.instagram_handle.replace(/^@/, "")}/`]
        : [],
      "hasOfferCatalog"  : {
        "@type"  : "OfferCatalog",
        "name"   : "Products",
        "itemListElement": (shop.products || []).map((p, i) => ({
          "@type"    : "Offer",
          "position" : i + 1,
          "name"     : p.name,
          "price"    : p.price,
          "priceCurrency": "INR",
          "availability" : p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url"      : `https://selly.codeforgeai.app/shop/${shop.slug}#${p.id}`,
          "image"    : p.image_url || "",
        })),
      },
    };
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    document.title = `${shop.business_name} — Shop on Selly`;
    return () => { const s = document.getElementById("shop-schema"); if (s) s.remove(); };
  }, [shop]);

  if (loading) return (
    <div className="shop-page">
      <div className="shop-nav"><Link to="/" className="shop-nav-logo">Sell<span>y</span></Link></div>
      <div className="shop-loading"><div className="spinner" /></div>
    </div>
  );

  if (error) return (
    <div className="shop-page">
      <div className="shop-nav"><Link to="/" className="shop-nav-logo">Sell<span>y</span></Link></div>
      <div className="shop-error">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Shop not found</div>
        <p style={{ color: "var(--text-2)", marginBottom: 24 }}>This shop page doesn't exist or may have been removed.</p>
        <Link to="/shops" className="btn btn-outline btn-sm">Browse all shops →</Link>
      </div>
    </div>
  );

  const { business_name, industry, city, instagram_handle, whatsapp_number, whatsapp_enabled, instagram_enabled, business_address, products } = shop;
  const industryLabel = INDUSTRY_LABELS[industry] || "Business";
  const emoji         = INDUSTRY_EMOJI[industry] || "🏪";

  return (
    <div className="shop-page">
      {/* Nav */}
      <nav className="shop-nav">
        <Link to="/" className="shop-nav-logo">Sell<span>y</span></Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/shops" className="btn btn-ghost btn-sm">Browse shops</Link>
          {cartCount > 0 && (
            <button className="shop-cart-btn" onClick={() => setCheckout(true)}>
              🛒 Cart <span className="shop-cart-badge">{cartCount}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="shop-hero">
        <div className="shop-hero-emoji">{emoji}</div>
        <h1 className="shop-hero-name">{business_name}</h1>
        <div className="shop-hero-meta">
          <span className="shop-industry-pill">{industryLabel}</span>
          {city && <span className="shop-city-pill">📍 {city}</span>}
        </div>

        {/* Contact buttons — only show enabled channels */}
        <div className="shop-contact-row">
          {whatsapp_enabled  && <WALink    number={whatsapp_number} businessName={business_name} />}
          {instagram_enabled && <InstaLink handle={instagram_handle} />}
        </div>

        {business_address && (
          <p className="shop-address">{business_address}</p>
        )}
      </div>

      {/* Products */}
      {products && products.length > 0 && (
        <section className="shop-products-section">
          <h2 className="shop-section-title">Products</h2>
          <div className="shop-products-grid">
            {products.map(p => (
              <div key={p.id} id={p.id} className="shop-product-card">
                {p.image_url ? (
                  <div className="shop-product-img-wrap">
                    <img src={p.image_url} alt={p.name} className="shop-product-img" loading="lazy" />
                  </div>
                ) : (
                  <div className="shop-product-img-placeholder">{emoji}</div>
                )}
                <div className="shop-product-info">
                  <div className="shop-product-name">{p.name}</div>
                  <div className="shop-product-price">{formatPrice(p.price)}</div>
                  {p.product_number && (
                    <div className="shop-product-code">#{p.product_number}</div>
                  )}
                  {!p.in_stock && (
                    <div className="shop-product-oos">Out of stock</div>
                  )}
                  {p.in_stock && (
                    <button className="shop-add-to-cart" onClick={() => addToCart(p)}>+ Add to cart</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order CTA */}
          <div className="shop-order-cta">
            <p className="shop-order-cta-text">
              Ready to order? Send a DM with the product name or code and we'll take it from there.
            </p>
            <div className="shop-contact-row">
              {whatsapp_enabled  && <WALink    number={whatsapp_number} businessName={business_name} />}
              {instagram_enabled && <InstaLink handle={instagram_handle} />}
            </div>
          </div>
        </section>
      )}

      {/* Checkout Modal */}
      {checkout && cart.length > 0 && (
        <CheckoutModal
          cart={cart}
          shop={{ ...shop, business_id: shop.business_id }}
          onClose={() => setCheckout(false)}
          onSuccess={() => { setCart([]); }}
        />
      )}

      {/* Instagram Reels */}
      {reels.length > 0 && (
        <section className="shop-reels-section">
          <h2 className="shop-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "middle", marginRight: 6 }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Latest from Instagram
          </h2>
          <div className="shop-reels-grid">
            {reels.map(r => (
              <a key={r.id} href={r.permalink} target="_blank" rel="noopener noreferrer" className="shop-reel-card">
                <div className="shop-reel-img-wrap">
                  <img src={r.media_url} alt={r.caption || "Post"} className="shop-reel-img" loading="lazy" />
                  {r.type === "VIDEO" && (
                    <div className="shop-reel-play">▶</div>
                  )}
                </div>
                {r.caption && <p className="shop-reel-caption">{r.caption}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="shop-footer">
        <span>Powered by <Link to="/">Selly</Link> — AI shopping assistant for Indian businesses</span>
      </footer>
    </div>
  );
}
