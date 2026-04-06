"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// TODO: Create a "receipts" table in Supabase with: id, subscriber_id, order_number, amount, date, payment_method, status
// For now showing placeholder data

interface Receipt {
  id: string;
  order_number: string;
  product: string;
  amount: number;
  date: string;
  payment_method: string;
  status: string;
}

export default function Recibos() {
  const [receipts] = useState<Receipt[]>([]);
  const [sub, setSub] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: d } = await s.from("subscribers").select("*").eq("id", data.user.id).single();
      setSub(d);
      // TODO: Fetch receipts from Supabase
      // const { data: r } = await s.from("receipts").select("*").eq("subscriber_id", data.user.id).order("date", { ascending: false });
      // setReceipts(r || []);
    });
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily:"'Anton',sans-serif", fontSize:"clamp(28px,5vw,36px)", letterSpacing:1, marginBottom:8 }}>MIS RECIBOS</h1>
      <p style={{ color:"#999", fontSize:14, marginBottom:32 }}>Historial de facturación y comprobantes</p>

      {receipts.length > 0 ? (
        <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, overflow:"hidden" }}>
          {/* Table header */}
          <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 1fr 100px 100px 100px 60px", gap:0, padding:"14px 20px", background:"#f5f5f5", fontSize:12, fontWeight:700, color:"#999" }}>
            <span>Estado</span><span>Tipo</span><span>N° Orden</span><span>Fecha</span><span>Monto</span><span>Método</span><span></span>
          </div>
          {/* Rows */}
          {receipts.map((r, i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 1fr 1fr 100px 100px 100px 60px", gap:0, padding:"16px 20px", borderTop:"1px solid #f0f0f0", fontSize:14, alignItems:"center" }}>
              <span><div style={{ width:10, height:10, borderRadius:"50%", background: r.status === "paid" ? "#16a34a" : "#ef4444" }} /></span>
              <span>Suscripción</span>
              <span style={{ fontFamily:"monospace", fontSize:13, color:"#888" }}>{r.order_number}</span>
              <span style={{ color:"#888" }}>{new Date(r.date).toLocaleDateString("es-PE")}</span>
              <span style={{ fontWeight:700 }}>S/ {r.amount}</span>
              <span style={{ color:"#888" }}>{r.payment_method}</span>
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#f59e0b" }}>⬇</button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, padding:60, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🧾</div>
          <h3 style={{ fontFamily:"'Anton',sans-serif", fontSize:22, letterSpacing:1, marginBottom:8 }}>SIN RECIBOS AÚN</h3>
          <p style={{ color:"#999", fontSize:14, maxWidth:360, margin:"0 auto" }}>
            {sub?.status === "pending_payment"
              ? "Completa tu pago para generar tu primer recibo."
              : "Tus recibos aparecerán aquí después de cada facturación."
            }
          </p>
          {sub?.status === "pending_payment" && (
            <button onClick={() => window.location.href = `/registro/pagar?plan=${sub?.plan || "monthly"}`} style={{
              background:"#a3e635", color:"#000", border:"none", borderRadius:100,
              padding:"14px 32px", fontSize:14, fontWeight:800, cursor:"pointer", marginTop:20,
            }}>
              Completar pago →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
