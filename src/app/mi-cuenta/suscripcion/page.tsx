"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PLAN_INFO: Record<string, { name:string; price:number; period:string }> = {
  monthly: { name:"Mensual", price:8, period:"mes" },
  quarterly: { name:"Trimestral", price:21, period:"3 meses" },
  biannual: { name:"Semestral", price:39, period:"6 meses" },
};

export default function Suscripcion() {
  const [sub, setSub] = useState<Record<string, string> | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: d } = await s.from("subscribers").select("*").eq("id", data.user.id).single();
      setSub(d);
    });
  }, []);

  const info = PLAN_INFO[sub?.plan || "monthly"];
  const isActive = sub?.status === "active";

  const statusConfig: Record<string, { label:string; color:string; bg:string }> = {
    active: { label:"Activo", color:"#16a34a", bg:"rgba(163,230,53,0.1)" },
    pending_payment: { label:"Pendiente de pago", color:"#f59e0b", bg:"rgba(245,158,11,0.1)" },
    cancelled: { label:"Cancelada", color:"#ef4444", bg:"rgba(239,68,68,0.1)" },
    expired: { label:"Expirada", color:"#999", bg:"#f5f5f5" },
  };
  const st = statusConfig[sub?.status || "pending_payment"];

  const timeSince = (dateStr: string) => {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const months = Math.floor(diff / (30*24*60*60*1000));
    if (months < 1) return "Menos de 1 mes";
    return `${months} ${months === 1 ? "mes" : "meses"}`;
  };

  return (
    <div>
      <h1 style={{ fontFamily:"'Anton',sans-serif", fontSize:"clamp(28px,5vw,36px)", letterSpacing:1, marginBottom:8 }}>MI SUSCRIPCIÓN</h1>
      <p style={{ color:"#999", fontSize:14, marginBottom:32 }}>Información de tu plan y facturación</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(320px,100%),1fr))", gap:20 }}>
        {/* Left: subscription details */}
        <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, padding:28 }}>
          {[
            { label:"Estatus de suscripción", value: <span style={{ background:st.bg, color:st.color, fontSize:14, fontWeight:800, padding:"6px 16px", borderRadius:100 }}>{st.label}</span> },
            { label:"Suscriptor desde", value: sub?.created_at ? new Date(sub.created_at).toLocaleDateString("es-PE") : "—" },
            { label:"Fecha de vencimiento", value: sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString("es-PE") : "—" },
            { label:"Monto de facturación", value: `S/ ${info?.price || "—"}` },
            { label:"Tiempo suscrito", value: timeSince(sub?.created_at || "") },
          ].map((row, i) => (
            <div key={i} style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, color:"#999", fontWeight:600, marginBottom:6 }}>{row.label}</div>
              <div style={{ background:"#f5f5f5", borderRadius:12, padding:"14px 16px", fontSize:15, fontWeight:700 }}>{row.value}</div>
            </div>
          ))}
        </div>

        {/* Right: plan card */}
        <div>
          <div style={{ background:"#111", borderRadius:20, padding:28, color:"#fff", marginBottom:20 }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Suscripción</div>
            <div style={{ fontFamily:"'Anton',sans-serif", fontSize:32, letterSpacing:1, marginBottom:16 }}>{info?.name || "—"}</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:20 }}>
              <span style={{ fontFamily:"'Anton',sans-serif", fontSize:48, color:"#a3e635" }}>S/{info?.price}</span>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>/{info?.period}</span>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:16 }}>
              {["Más de 10 premios cada semana","Premios sorpresas","Chances extras jugando en la plataforma"].map((b,i) => (
                <div key={i} style={{ fontSize:14, color: i===2 ? "#a3e635" : "rgba(255,255,255,0.5)", marginBottom:6 }}>• {b}</div>
              ))}
            </div>
          </div>

          {isActive && !showCancel && (
            <button onClick={() => setShowCancel(true)} style={{ fontSize:13, color:"#ef4444", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>
              Cancelar mi suscripción
            </button>
          )}
        </div>
      </div>

      {/* Cancel confirmation */}
      {showCancel && (
        <div style={{ background:"#fff", border:"1px solid #fca5a5", borderRadius:20, padding:28, marginTop:24 }}>
          <h3 style={{ fontFamily:"'Anton',sans-serif", fontSize:22, letterSpacing:1, marginBottom:8 }}>ELIMINAR SUSCRIPCIÓN</h3>
          <p style={{ color:"#666", fontSize:14, lineHeight:1.7, marginBottom:20, maxWidth:600 }}>
            Al eliminar tu suscripción, tendrás acceso a tus beneficios y seguirás participando en los premios hasta la fecha de vencimiento.
            Una vez pasada la fecha, no podrás acceder a tu cuenta hasta realizar un nuevo pago de suscripción.
            <strong style={{ color:"#ef4444" }}> Tu suscripción debe estar activa para participar en los sorteos.</strong>
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button onClick={() => setShowCancel(false)} style={{ background:"#f5f5f5", border:"none", borderRadius:100, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Mantener suscripción
            </button>
            <button style={{ background:"#ef4444", color:"#fff", border:"none", borderRadius:100, padding:"12px 28px", fontSize:14, fontWeight:800, cursor:"pointer" }}>
              Eliminar suscripción
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
