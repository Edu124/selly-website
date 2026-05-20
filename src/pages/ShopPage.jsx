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

// Section / button labels per industry
const INDUSTRY_SECTION = {
  product  : "Products",
  education: "Courses",
  tourism  : "Packages",
  kirana   : "Items",
  cakes    : "Menu",
  icecream : "Menu",
};

const INDUSTRY_ADD_BTN = {
  product  : "+ Add to cart",
  education: "Enroll",
  tourism  : "Book now",
  kirana   : "+ Add to cart",
  cakes    : "+ Add to cart",
  icecream : "+ Add to cart",
};

const INDUSTRY_CTA = {
  product  : "Ready to order? Send a DM with the product name or code and we'll take it from there.",
  education: "Ready to enroll? Send us a message with the course name and we'll get you started.",
  tourism  : "Interested in a package? Send us a message and we'll plan everything for you.",
  kirana   : "Place your order by sending a message with the items you need.",
  cakes    : "Ready to order? Send us a message with the item and we'll confirm your booking.",
  icecream : "Want to order? Send us a message and we'll have it ready for you.",
};

const INDUSTRY_RETURN_LABEL = {
  product  : "Request Return / Exchange",
  education: "Request Refund",
  tourism  : "Request Cancellation",
  kirana   : "Request Return",
  cakes    : "Raise a Concern",
  icecream : "Raise a Concern",
};

const INDUSTRY_RETURN_REASONS = {
  product  : ["Wrong size", "Wrong product received", "Damaged / defective", "Quality not as expected", "Changed my mind", "Other"],
  education: ["Course not started yet", "Duplicate enrollment", "Did not receive access", "Course content mismatch", "Other"],
  tourism  : ["Plans changed", "Medical emergency", "Duplicate booking", "Natural disaster / travel advisory", "Other"],
  kirana   : ["Wrong item delivered", "Damaged / expired product", "Missing items in order", "Other"],
  cakes    : ["Damaged delivery", "Wrong order received", "Quality issue", "Missing item", "Other"],
  icecream : ["Wrong order", "Quality issue", "Missing item", "Other"],
};

const INDUSTRY_DEFAULT_POLICY = {
  product  : "We accept returns within 7 days of delivery. Items must be unused, unwashed, and in original condition with tags intact. Damaged or defective items are eligible for a full refund.",
  education: "Refund requests can be submitted within 3 days of enrollment, provided the course has not been accessed. Once course materials are accessed, refunds are at the instructor's discretion.",
  tourism  : "Cancellations made 48+ hours before the tour date are eligible for a full refund. Cancellations within 48 hours may be subject to a 25% cancellation fee.",
  kirana   : "We accept returns for incorrect or damaged items within 24 hours of delivery. Please contact us with your order ID and a photo of the item.",
  cakes    : "As food items are perishable, we do not accept returns. However, if your order was damaged or incorrect, please contact us within 2 hours of delivery with a photo and we will make it right.",
  icecream : "As food items are perishable, we do not accept returns. If your order was incorrect, please contact us immediately with your order ID.",
};

function formatPrice(p) {
  return "₹" + Number(p).toLocaleString("en-IN");
}

// Maps color name strings → CSS color values for swatch circles
const COLOR_MAP = {
  red:"#ef4444",blue:"#3b82f6",green:"#22c55e",yellow:"#eab308",orange:"#f97316",
  purple:"#a855f7",pink:"#ec4899",white:"#f8fafc",black:"#111827",gray:"#9ca3af",
  grey:"#9ca3af",brown:"#92400e",navy:"#1e3a8a",maroon:"#7f1d1d",beige:"#d4b896",
  cream:"#fef9ef",teal:"#14b8a6",cyan:"#06b6d4",lime:"#84cc16",indigo:"#6366f1",
  violet:"#8b5cf6",magenta:"#d946ef",gold:"#f59e0b",silver:"#94a3b8",coral:"#f87171",
  peach:"#fca5a5",turquoise:"#2dd4bf",khaki:"#c6b96b",mint:"#6ee7b7",rose:"#fb7185",
  lavender:"#c4b5fd",mustard:"#ca8a04",olive:"#65a30d",charcoal:"#374151",
  offwhite:"#f9fafb",multicolor:"linear-gradient(135deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#a855f7)",
};
function getColorSwatch(name) {
  const key = name.toLowerCase().replace(/\s+/g,"");
  return COLOR_MAP[key] || null;
}

// Status badge for order history
const ORDER_STATUS_LABEL = {
  pending_payment: { label: "Pending Payment", color: "#eab308" },
  confirmed       : { label: "Confirmed",       color: "#22c55e" },
  packed          : { label: "Packed",           color: "#3b82f6" },
  shipped         : { label: "Shipped",          color: "#6366f1" },
  out_for_delivery: { label: "Out for Delivery", color: "#f97316" },
  delivered       : { label: "Delivered",        color: "#22c55e" },
  cancelled       : { label: "Cancelled",        color: "#ef4444" },
};

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

// ── Product Detail Modal (Amazon-style) ───────────────────────────────────────
function ProductModal({ product, shop, onClose, onAddToCart, addBtnLabel = "+ Add to Cart", reviews = [], allProducts = [] }) {
  const [selectedSize,  setSelectedSize]  = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [imgIdx,        setImgIdx]        = useState(0);

  const images = (product.image_urls && product.image_urls.length > 0)
    ? product.image_urls
    : (product.image_url ? [product.image_url] : []);

  const productReviews = reviews.filter(
    r => r.product_name && r.product_name.toLowerCase() === product.name.toLowerCase()
  );
  const avgRating = productReviews.length
    ? (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1)
    : null;

  // Similar products: same category, exclude current, max 4
  const similar = allProducts.filter(p => p.id !== product.id && p.category === product.category && p.in_stock).slice(0, 4);

  function handleAdd() {
    onAddToCart({ ...product, size: selectedSize, color: selectedColor });
    onClose();
  }

  return (
    <div className="checkout-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal" style={{ maxWidth: 640, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Sticky header */}
        <div className="checkout-header" style={{ flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.3 }}>{product.name}</div>
            {avgRating && (
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                {"⭐".repeat(Math.round(parseFloat(avgRating)))} {avgRating} · {productReviews.length} review{productReviews.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <button className="checkout-close" onClick={onClose}>✕</button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1 }}>

          {/* Image gallery */}
          {images.length > 0 && (
            <div style={{ position: "relative", background: "var(--bg-input)" }}>
              <img src={images[imgIdx]} alt={product.name}
                style={{ width: "100%", maxHeight: 340, objectFit: "contain", display: "block" }} />
              {images.length > 1 && (
                <>
                  {imgIdx > 0 && (
                    <button onClick={() => setImgIdx(i => i - 1)}
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                  )}
                  {imgIdx < images.length - 1 && (
                    <button onClick={() => setImgIdx(i => i + 1)}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                  )}
                  <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
                          background: i === imgIdx ? "var(--purple)" : "rgba(255,255,255,0.6)" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, padding: "10px 12px 0", overflowX: "auto", background: "var(--bg-card)" }}>
                    {images.map((url, i) => (
                      <img key={i} src={url} alt="" onClick={() => setImgIdx(i)}
                        style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, cursor: "pointer", flexShrink: 0,
                          border: i === imgIdx ? "2px solid var(--purple)" : "2px solid transparent", opacity: i === imgIdx ? 1 : 0.55 }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div style={{ padding: "20px 24px 24px" }}>
            {/* Price + stock */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "var(--purple)" }}>{formatPrice(product.price)}</span>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                background: product.in_stock ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                color: product.in_stock ? "#22c55e" : "#ef4444" }}>
                {product.in_stock ? "✓ In Stock" : "✕ Out of Stock"}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 16 }}>{product.description}</p>
            )}

            {/* Specs row */}
            {(product.material || product.category) && (
              <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                {product.category && (
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: "var(--text-3)" }}>Category · </span>
                    <span style={{ color: "var(--text-2)", fontWeight: 600 }}>{product.category}</span>
                  </div>
                )}
                {product.material && (
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: "var(--text-3)" }}>Material · </span>
                    <span style={{ color: "var(--text-2)", fontWeight: 600 }}>{product.material}</span>
                  </div>
                )}
              </div>
            )}

            {/* Color swatches */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--text-1)" }}>
                  Color{selectedColor ? <span style={{ fontWeight: 400, color: "var(--purple)", marginLeft: 6 }}>{selectedColor}</span> : ""}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {product.colors.map(c => {
                    const swatch = getColorSwatch(c);
                    const isSelected = selectedColor === c;
                    return swatch ? (
                      <button key={c} title={c} onClick={() => setSelectedColor(c)}
                        style={{
                          width: 32, height: 32, borderRadius: "50%", cursor: "pointer", padding: 0,
                          background: swatch.startsWith("linear") ? swatch : swatch,
                          border: isSelected ? "3px solid var(--purple)" : "2px solid var(--border)",
                          boxShadow: isSelected ? "0 0 0 2px var(--purple-dim)" : "none",
                          outline: "none",
                        }} />
                    ) : (
                      <button key={c} onClick={() => setSelectedColor(c)}
                        style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                          border: isSelected ? "2px solid var(--purple)" : "1px solid var(--border)",
                          background: isSelected ? "var(--purple-dim)" : "var(--bg)",
                          color: isSelected ? "var(--purple)" : "var(--text-2)", fontWeight: isSelected ? 600 : 400,
                        }}>{c}</button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size chips */}
            {product.has_sizes && product.sizes?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--text-1)" }}>Size</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      style={{
                        minWidth: 44, padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600,
                        border: selectedSize === s ? "2px solid var(--purple)" : "1px solid var(--border)",
                        background: selectedSize === s ? "var(--purple-dim)" : "var(--bg-input)",
                        color: selectedSize === s ? "var(--purple)" : "var(--text-2)",
                      }}>{s}</button>
                  ))}
                </div>
                {product.has_sizes && !selectedSize && (
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>Please select a size to continue</p>
                )}
              </div>
            )}

            {/* Add to cart */}
            {product.in_stock ? (
              <button className="checkout-btn" onClick={handleAdd}
                disabled={product.has_sizes && product.sizes?.length > 0 && !selectedSize}
                style={{ fontSize: 16, padding: "14px 24px" }}>
                {addBtnLabel}
              </button>
            ) : (
              <button className="checkout-btn" disabled style={{ opacity: 0.5, fontSize: 16, padding: "14px 24px" }}>
                Out of Stock
              </button>
            )}

            {/* Customer reviews */}
            {productReviews.length > 0 && (
              <div style={{ marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: "var(--text-1)" }}>{avgRating}</span>
                  <div>
                    <div style={{ fontSize: 18 }}>{"⭐".repeat(Math.round(parseFloat(avgRating)))}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{productReviews.length} review{productReviews.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {productReviews.slice(0, 5).map(r => (
                    <div key={r.id} style={{ background: "var(--bg-input)", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{r.customer_name || "Customer"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                          {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <div style={{ fontSize: 15 }}>{"⭐".repeat(r.rating || 0)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar products */}
            {similar.length > 0 && (
              <div style={{ marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "var(--text-1)" }}>
                  Similar Products
                </div>
                <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
                  {similar.map(p => (
                    <div key={p.id} onClick={() => { onClose(); setTimeout(() => onAddToCart && null, 0); }}
                      style={{ flexShrink: 0, width: 130, cursor: "pointer" }}
                      className="shop-similar-card">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name}
                          style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8, display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: 100, background: "var(--bg-input)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                          🛍️
                        </div>
                      )}
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)", marginTop: 6, lineHeight: 1.3 }}
                        title={p.name}>{p.name.length > 22 ? p.name.slice(0, 20) + "…" : p.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--purple)", marginTop: 2 }}>{formatPrice(p.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Return Request Modal ──────────────────────────────────────────────────────
function ReturnModal({ shop, onClose, prefillOrderId = "" }) {
  const [step,        setStep]        = useState("form");  // form | done
  const [orderId,     setOrderId]     = useState(prefillOrderId);
  const [email,       setEmail]       = useState("");
  const [name,        setName]        = useState("");
  const [reason,      setReason]      = useState("");
  const [description, setDescription] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [returnId,    setReturnId]    = useState("");

  const reasons = INDUSTRY_RETURN_REASONS[shop.industry] || INDUSTRY_RETURN_REASONS.product;
  const btnLabel = INDUSTRY_RETURN_LABEL[shop.industry]  || "Submit Request";

  async function submit() {
    if (!orderId.trim()) return setError("Please enter your order ID.");
    if (!reason)         return setError("Please select a reason.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/web/return`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bid: shop.business_id, order_id: orderId.trim(),
          customer_email: email.trim(), customer_name: name.trim(),
          reason, description: description.trim(),
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setReturnId(d.return_id);
      setStep("done");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="checkout-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal" style={{ maxWidth: 480 }}>
        <div className="checkout-header">
          <div className="checkout-title">
            {step === "form" ? btnLabel : "Request Submitted ✓"}
          </div>
          <button className="checkout-close" onClick={onClose}>✕</button>
        </div>
        <div className="checkout-body">
          {step === "form" && (
            <>
              {error && <div className="checkout-error">{error}</div>}
              <input className="checkout-input" placeholder="Order ID *  (e.g. WEB1A2B3C or from your confirmation)" value={orderId} onChange={e => setOrderId(e.target.value)} />
              <input className="checkout-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              <input className="checkout-input" placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-2)" }}>Reason *</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {reasons.map(r => (
                    <button key={r} onClick={() => setReason(r)}
                      style={{
                        padding: "7px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                        border: reason === r ? "2px solid var(--purple)" : "1px solid var(--border)",
                        background: reason === r ? "var(--purple-dim)" : "var(--bg)",
                        color: reason === r ? "var(--purple)" : "var(--text-2)",
                        fontWeight: reason === r ? 600 : 400,
                      }}>{r}</button>
                  ))}
                </div>
              </div>

              <textarea className="checkout-input checkout-textarea" placeholder="Describe the issue (optional — more detail helps us resolve it faster)" value={description} onChange={e => setDescription(e.target.value)} rows={3} />

              <button className="checkout-btn" onClick={submit} disabled={loading || !orderId.trim() || !reason}>
                {loading ? "Submitting..." : "Submit Request →"}
              </button>
              <button className="checkout-btn-ghost" onClick={onClose}>Cancel</button>
            </>
          )}

          {step === "done" && (
            <>
              <div className="checkout-success-icon">✓</div>
              <p className="checkout-success-msg">
                Your request <b>#{returnId}</b> has been received.
                The store owner will review it and get back to you within 1–2 business days.
              </p>
              <button className="checkout-btn-ghost" onClick={onClose} style={{ marginTop: 8 }}>Close</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Order History Modal ───────────────────────────────────────────────────────
function OrderHistoryModal({ shop, onClose, onReturnRequest }) {
  const [email,   setEmail]   = useState("");
  const [orders,  setOrders]  = useState(null);  // null = not fetched yet
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function lookup() {
    if (!email.trim()) return setError("Please enter your email address.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/public/shop/${shop.slug}/my-orders?email=${encodeURIComponent(email.trim())}`);
      const d = await r.json();
      setOrders(d.orders || []);
    } catch { setError("Could not fetch orders. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="checkout-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal" style={{ maxWidth: 500 }}>
        <div className="checkout-header">
          <div className="checkout-title">My Orders</div>
          <button className="checkout-close" onClick={onClose}>✕</button>
        </div>
        <div className="checkout-body">
          {orders === null ? (
            <>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 16 }}>
                Enter the email address you used when placing your order.
              </p>
              {error && <div className="checkout-error">{error}</div>}
              <input className="checkout-input" type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup()} />
              <button className="checkout-btn" onClick={lookup} disabled={loading}>
                {loading ? "Looking up…" : "View My Orders →"}
              </button>
            </>
          ) : orders.length === 0 ? (
            <>
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 6 }}>No orders found</div>
                <p style={{ fontSize: 13, color: "var(--text-3)" }}>We couldn't find any orders for {email}. Make sure you're using the same email you checked out with.</p>
              </div>
              <button className="checkout-btn-ghost" onClick={() => setOrders(null)}>Try another email</button>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 14 }}>
                {orders.length} order{orders.length !== 1 ? "s" : ""} found for <b style={{ color: "var(--text-2)" }}>{email}</b>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {orders.map(o => {
                  const statusInfo = ORDER_STATUS_LABEL[o.status] || { label: o.status, color: "var(--text-3)" };
                  const cart = Array.isArray(o.cart) ? o.cart : [];
                  const total = o.bill?.total || cart.reduce((s, i) => s + i.total, 0);
                  return (
                    <div key={o.id} style={{ background: "var(--bg-input)", borderRadius: 12, padding: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-1)" }}>#{o.id}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                          background: statusInfo.color + "20", color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 4 }}>
                        {cart.map(i => `${i.name}${i.size ? ` (${i.size})` : ""} ×${i.qty}`).join(" · ")}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--purple)" }}>₹{Number(total).toLocaleString("en-IN")}</span>
                        <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                          {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {["delivered", "confirmed", "shipped", "packed"].includes(o.status) && (
                        <button onClick={() => { onClose(); onReturnRequest(o.id); }}
                          style={{ marginTop: 10, width: "100%", padding: "8px", borderRadius: 8, fontSize: 12,
                            fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)",
                            background: "transparent", color: "var(--text-2)" }}>
                          ↩ Request Return / Exchange
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <button className="checkout-btn-ghost" onClick={() => setOrders(null)} style={{ marginTop: 8 }}>
                Use different email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Checkout Modal ────────────────────────────────────────────────────────────
function CheckoutModal({ cart, shop, onClose, onSuccess }) {
  const [step,       setStep]       = useState("cart");   // cart | details | otp | payment | done
  const [customer,   setCustomer]   = useState({ name: "", email: "", phone: "", address: "" });
  const [otp,        setOtp]        = useState("");
  const [otpToken,   setOtpToken]   = useState(null);
  const [otpSent,    setOtpSent]    = useState(false);
  const paymentModes = shop.payment_modes || "both";
  const [payMode,    setPayMode]    = useState(paymentModes === "online_only" ? "online" : "cod");
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
        options: { shouldCreateUser: true },
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
              {/* Cost breakdown */}
              <div className="checkout-totals" style={{ marginBottom: 16 }}>
                <div className="checkout-total-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                {gstAmt > 0 && <div className="checkout-total-row"><span>GST ({gstRate}%)</span><span>₹{gstAmt.toLocaleString("en-IN")}</span></div>}
                {delivery > 0 && <div className="checkout-total-row"><span>Delivery</span><span>₹{delivery.toLocaleString("en-IN")}</span></div>}
                {codFee > 0 && payMode === "cod" && <div className="checkout-total-row"><span>COD Fee</span><span>₹{codFee.toLocaleString("en-IN")}</span></div>}
                <div className="checkout-total-row grand"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
              </div>
              <p className="checkout-otp-info" style={{ marginTop: 0 }}>
                {paymentModes === "cod_only"    && "Your order will be paid on delivery."}
                {paymentModes === "online_only" && "Pay securely online to confirm your order."}
                {paymentModes === "both"        && "Choose your payment method:"}
              </p>
              {paymentModes === "both" && (
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
              )}
              {paymentModes === "cod_only" && (
                <div className="checkout-pay-options">
                  <div className="checkout-pay-option selected">
                    <div><div className="checkout-pay-label">💵 Cash on Delivery</div><div className="checkout-pay-sub">{shop.cod_fee > 0 ? `+₹${shop.cod_fee} COD fee` : "No extra charge"}</div></div>
                  </div>
                </div>
              )}
              {paymentModes === "online_only" && (
                <div className="checkout-pay-options">
                  <div className="checkout-pay-option selected">
                    <div><div className="checkout-pay-label">💳 Pay Online</div><div className="checkout-pay-sub">UPI, Card, Net Banking via Razorpay</div></div>
                  </div>
                </div>
              )}
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
  const [reels,           setReels]           = useState([]);
  const [reviews,         setReviews]         = useState([]);
  const [cart,            setCart]            = useState([]);
  const [checkout,        setCheckout]        = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [returnOpen,      setReturnOpen]      = useState(false);
  const [returnPrefillId, setReturnPrefillId] = useState("");
  const [ordersOpen,      setOrdersOpen]      = useState(false);

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

  // Load customer reviews for this shop
  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/public/shop/${slug}/reviews`)
      .then(r => r.json())
      .then(d => setReviews(d.reviews || []))
      .catch(() => {});
  }, [slug]);

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
  const industryLabel  = INDUSTRY_LABELS[industry]         || "Business";
  const emoji          = INDUSTRY_EMOJI[industry]          || "🏪";
  const sectionTitle   = INDUSTRY_SECTION[industry]        || "Products";
  const addBtnLabel    = INDUSTRY_ADD_BTN[industry]        || "+ Add to cart";
  const ctaText        = INDUSTRY_CTA[industry]            || "Ready to order? Send us a message.";
  const returnBtnLabel = INDUSTRY_RETURN_LABEL[industry]   || "Request Return";
  const defaultPolicy  = INDUSTRY_DEFAULT_POLICY[industry] || "";
  const returnPolicy   = shop.return_policy || defaultPolicy;

  return (
    <div className="shop-page">
      {/* Nav */}
      <nav className="shop-nav">
        <Link to="/" className="shop-nav-logo">Sell<span>y</span></Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setOrdersOpen(true)}>📦 My Orders</button>
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
          <h2 className="shop-section-title">{sectionTitle}</h2>
          <div className="shop-products-grid">
            {products.map(p => (
              <div key={p.id} id={p.id} className="shop-product-card"
                onClick={() => setSelectedProduct(p)}
                style={{ cursor: "pointer" }}
              >
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
                  {/* Inline rating badge from loaded reviews */}
                  {(() => {
                    const pr = reviews.filter(r => r.product_name && r.product_name.toLowerCase() === p.name.toLowerCase());
                    if (!pr.length) return null;
                    const avg = (pr.reduce((s, r) => s + r.rating, 0) / pr.length).toFixed(1);
                    return (
                      <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 4 }}>
                        ⭐ {avg} <span style={{ color: "var(--text-3)" }}>({pr.length})</span>
                      </div>
                    );
                  })()}
                  {!p.in_stock && (
                    <div className="shop-product-oos">Out of stock</div>
                  )}
                  {p.in_stock && (
                    <button className="shop-add-to-cart" onClick={e => {
                      e.stopPropagation();
                      // If product has sizes, open modal to let customer pick size first
                      if (p.has_sizes && p.sizes?.length > 0) {
                        setSelectedProduct(p);
                      } else {
                        addToCart(p);
                      }
                    }}>{addBtnLabel}</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order CTA */}
          <div className="shop-order-cta">
            <p className="shop-order-cta-text">{ctaText}</p>
            <div className="shop-contact-row">
              {whatsapp_enabled  && <WALink    number={whatsapp_number} businessName={business_name} />}
              {instagram_enabled && <InstaLink handle={instagram_handle} />}
            </div>
          </div>
        </section>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          shop={shop}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(item) => { addToCart(item); setSelectedProduct(null); }}
          addBtnLabel={addBtnLabel}
          reviews={reviews}
          allProducts={products || []}
        />
      )}

      {/* Return Policy + Request Return */}
      <section className="shop-return-section">
        <details className="shop-return-policy">
          <summary className="shop-return-summary">
            ↩ Return &amp; Refund Policy
          </summary>
          <p className="shop-return-text">{returnPolicy}</p>
        </details>
        <button className="shop-return-btn" onClick={() => setReturnOpen(true)}>
          {returnBtnLabel}
        </button>
      </section>

      {/* Return Request Modal */}
      {returnOpen && (
        <ReturnModal
          shop={{ ...shop, business_id: shop.business_id }}
          onClose={() => { setReturnOpen(false); setReturnPrefillId(""); }}
          prefillOrderId={returnPrefillId}
        />
      )}

      {/* Order History Modal */}
      {ordersOpen && (
        <OrderHistoryModal
          shop={shop}
          onClose={() => setOrdersOpen(false)}
          onReturnRequest={(orderId) => { setReturnPrefillId(orderId); setReturnOpen(true); }}
        />
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
