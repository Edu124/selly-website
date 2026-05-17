import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

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

// Schema.org ItemList for the directory — helps AI platforms index the collection
function DirectorySchema({ shops }) {
  useEffect(() => {
    if (!shops.length) return;
    const el = document.getElementById("shops-schema");
    if (el) el.remove();
    const script = document.createElement("script");
    script.id   = "shops-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context"       : "https://schema.org",
      "@type"          : "ItemList",
      "name"           : "Businesses on Selly — India's AI Shopping Assistant",
      "description"    : "Directory of shops, stores, and service businesses using Selly AI. Chat directly with each business on WhatsApp or Instagram to order.",
      "url"            : "https://selly.in/shops",
      "numberOfItems"  : shops.length,
      "itemListElement": shops.map((s, i) => ({
        "@type"    : "ListItem",
        "position" : i + 1,
        "name"     : s.business_name,
        "url"      : `https://selly.in/shop/${s.business_slug}`,
        "description": `${INDUSTRY_LABELS[s.industry] || "Business"} in ${s.city || "India"}`,
      })),
    });
    document.head.appendChild(script);
    document.title = "Browse Shops — Selly";
    return () => { const s = document.getElementById("shops-schema"); if (s) s.remove(); };
  }, [shops]);
  return null;
}

export default function ShopsPage() {
  const [shops,   setShops]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    fetch(`${API}/public/shops`)
      .then(r => r.json())
      .then(d => { setShops(d.shops || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const industries = useMemo(() => {
    const seen = new Set();
    shops.forEach(s => seen.add(s.industry));
    return ["all", ...Array.from(seen).filter(Boolean)];
  }, [shops]);

  const filtered = useMemo(() => shops.filter(s => {
    const matchIndustry = filter === "all" || s.industry === filter;
    const q = search.toLowerCase();
    const matchSearch  = !q ||
      s.business_name?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      INDUSTRY_LABELS[s.industry]?.toLowerCase().includes(q);
    return matchIndustry && matchSearch;
  }), [shops, filter, search]);

  return (
    <div className="shops-page">
      <DirectorySchema shops={shops} />

      {/* Nav */}
      <nav className="shop-nav">
        <Link to="/" className="shop-nav-logo">Sell<span>y</span></Link>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="shops-header">
        <div className="shops-header-badge">🏪 Business Directory</div>
        <h1 className="shops-header-title">Shops on Selly</h1>
        <p className="shops-header-sub">
          Browse Indian businesses powered by AI. Chat directly with any shop on WhatsApp or Instagram.
        </p>

        {/* Search */}
        <div className="shops-search-wrap">
          <input
            className="shops-search"
            type="text"
            placeholder="Search by name, city, or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="shops-filters">
        {industries.map(ind => (
          <button
            key={ind}
            className={`shops-filter-chip ${filter === ind ? "active" : ""}`}
            onClick={() => setFilter(ind)}
          >
            {ind === "all" ? "All" : `${INDUSTRY_EMOJI[ind] || ""} ${INDUSTRY_LABELS[ind] || ind}`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="shops-grid-wrap">
        {loading ? (
          <div className="shop-loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="shops-empty">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "var(--text-2)" }}>No shops found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className="shops-grid">
            {filtered.map(s => (
              <Link
                key={s.business_slug}
                to={`/shop/${s.business_slug}`}
                className="shops-card"
              >
                <div className="shops-card-emoji">{INDUSTRY_EMOJI[s.industry] || "🏪"}</div>
                <div className="shops-card-info">
                  <div className="shops-card-name">{s.business_name}</div>
                  <div className="shops-card-industry">{INDUSTRY_LABELS[s.industry] || "Business"}</div>
                  {s.city && <div className="shops-card-city">📍 {s.city}</div>}
                </div>
                <div className="shops-card-arrow">→</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="shops-cta">
        <div className="shops-cta-inner">
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Add your shop to Selly</h2>
          <p style={{ color: "var(--text-2)", fontSize: 15, marginBottom: 20 }}>
            Get your own AI shopping assistant — auto-replies on WhatsApp &amp; Instagram, catalog management, order tracking.
          </p>
          <Link to="/register" className="btn btn-primary">Start free trial →</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="shop-footer">
        <span>Powered by <Link to="/">Selly</Link> — AI shopping assistant for Indian businesses</span>
      </footer>
    </div>
  );
}
