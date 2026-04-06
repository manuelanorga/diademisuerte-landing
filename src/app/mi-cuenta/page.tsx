"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashInicio() {
  const [sub, setSub] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: d } = await s.from("subscribers").select("*").eq("id", data.user.id).single();
      setSub(d);
    });
  }, []);

  const st = sub?.status === "active" ? { l: "Activa", c: "#16a34a", bg: "rgba(163,230,53,0.1)" }
    : sub?.status === "cancelled" ? { l: "Cancelada", c: "#ef4444", bg: "rgba(239,68,68,0.1)" }
    : { l: "Pendiente", c: "#f59e0b", bg: "rgba(245,158,11,0.1)" };

  return (
    <div>
      <h1 style={{ fontFamily: "'Anton',sans-serif", fontSize: "clamp(28px,5vw,36px)", letterSpacing: 1, marginBottom: 8 }}>
        ¡Hola{sub?.first_name ? `, ${sub.first_name}` : ""}! 👋
      </h1>
      <p style={{ color: "#999", fontSize: 14, marginBottom: 32 }}>Bienvenido a tu panel de suscriptor.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 16, marginBottom: 24 }}>
        {/* Status card */}
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 20, padding: 24 }}>
          <div style={{ fontSize: 12, color: "#999", fontWeight: 700, marginBottom: 8 }}>ESTADO</div>
          <span style={{ background: st.bg, color: st.c, fontSize: 14, fontWeight: 800, padding: "6px 16px", borderRadius: 100 }}>{st.l}</span>
        </div>
        {/* Plan card */}
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 20, padding: 24 }}>
          <div style={{ fontSize: 12, color: "#999", fontWeight: 700, marginBottom: 8 }}>MI PLAN</div>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 24, letterSpacing: 1 }}>
            {sub?.plan === "quarterly" ? "Trimestral" : sub?.plan === "biannual" ? "Semestral" : "Mensual"}
          </div>
        </div>
        {/* Price card */}
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 20, padding: 24 }}>
          <div style={{ fontSize: 12, color: "#999", fontWeight: 700, marginBottom: 8 }}>FACTURACIÓN</div>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 24, color: "#84cc16", letterSpacing: 1 }}>
            S/{sub?.plan === "quarterly" ? "21" : sub?.plan === "biannual" ? "39" : "8"}
          </div>
        </div>
      </div>

      {/* Next raffle */}
      <div style={{ background: "#111", borderRadius: 20, padding: 28, color: "#fff" }}>
        <h3 style={{ fontFamily: "'Anton',sans-serif", fontSize: 20, letterSpacing: 1, marginBottom: 8 }}>PRÓXIMO SORTEO</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 12 }}>Todos los miércoles a las 8PM en vivo por Instagram</p>
        <a href="https://www.instagram.com/diademisuerte/" target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
          color: "#fff", borderRadius: 100, padding: "10px 20px", fontSize: 13, fontWeight: 800, textDecoration: "none",
        }}>🔴 Ver en IG Live</a>
      </div>
    </div>
  );
}
