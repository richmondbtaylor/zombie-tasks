"use client";
import { useState } from "react";

// Project boards charge per person each month. Pick the price per seat.
// ZOMBIE: no prices yet. Pick your prices, create matching per-seat Prices in Stripe (test mode),
// and show them here.
const PLANS = [
  { id: "free", name: "Free", price: "Set your price", perks: ["Up to 3 boards", "Unlimited cards", "5 teammates"] },
  { id: "team", name: "Team", price: "Set your price", perks: ["Unlimited boards", "Private boards", "Due-date reminder emails"] },
  { id: "business", name: "Business", price: "Set your price", perks: ["Everything in Team", "Workspace export", "Activity log"] },
];

export default function PricingPage() {
  const [error, setError] = useState("");

  async function buy(plan: string) {
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setError(data.error ?? "Checkout failed.");
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Pricing</h1>
          <p className="sub">Less than the tool you&apos;re used to. Once Stripe works.</p>
        </div>
      </div>
      <div className="grid">
        {PLANS.map((p) => (
          <div key={p.id} className="card stack">
            <strong>{p.name}</strong>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{p.price}</div>
            <span className="muted small">per person, per month</span>
            <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
              {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
            </ul>
            <button onClick={() => buy(p.id)}>Buy {p.name}</button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </>
  );
}
