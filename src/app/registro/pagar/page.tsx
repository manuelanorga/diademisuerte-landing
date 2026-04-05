"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

const PLAN_INFO: Record<string, { name: string; price: number; period: string }> = {
  monthly: { name: "Mensual", price: 8, period: "mes" },
  quarterly: { name: "Trimestral", price: 21, period: "3 meses" },
  biannual: { name: "Semestral", price: 39, period: "6 meses" },
};

function PagarForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "monthly";
  const info = PLAN_INFO[plan] || PLAN_INFO.monthly;
  const [subscriber, setSubscriber] = useState<{ first_name?: string; email?: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: sub } = await supabase
          .from("subscribers")
          .select("first_name, email")
          .eq("id", data.user.id)
          .single();
        setSubscriber(sub);
      }
    });
  }, []);

  /*
   * ════════════════════════════════════════════════
   * TODO: INTEGRAR NIUBIZ AQUÍ
   * ════════════════════════════════════════════════
   * 
   * 1. Crear un API route: /api/niubiz/create-session
   *    - Genera el token de sesión con Niubiz
   *    - Envía: merchantId, amount, orderId
   * 
   * 2. Cargar el script de Niubiz:
   *    <script src="https://static-content.vnforapps.com/v2/js/checkout.js"></script>
   * 
   * 3. Abrir el formulario de Niubiz:
   *    VisanetCheckout.configure({ ... });
   *    VisanetCheckout.open();
   * 
   * 4. Callback de éxito:
   *    - Verificar el pago en /api/niubiz/verify
   *    - Actualizar subscriber.status = 'active' en Supabase
   *    - Redirect a /registro/exito
   * 
   * ════════════════════════════════════════════════
   */

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',sans-serif;background:#fafafa;color:#111}
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        padding:20,background:"#fafafa",
      }}>
        <div style={{maxWidth:440,width:"100%"}}>
          {/* Back */}
          <a href={`/registro/datos?plan=${plan}`} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:14,color:"#999",textDecoration:"none",marginBottom:32}}>
            ← Volver a datos
          </a>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
            <span style={{fontSize:28}}>🍀</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:22,letterSpacing:2}}>DÍA DE MI SUERTE</span>
          </div>

          {/* Progress */}
          <div style={{display:"flex",gap:8,marginBottom:32}}>
            {["Correo","Datos","Pago"].map((step,i)=>(
              <div key={step} style={{flex:1,textAlign:"center"}}>
                <div style={{height:4,borderRadius:4,background:"#a3e635",marginBottom:6}}/>
                <span style={{fontSize:11,color:i===2?"#111":"#aaa",fontWeight:i===2?800:500}}>{step}</span>
              </div>
            ))}
          </div>

          <h1 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(28px,6vw,38px)",letterSpacing:1,lineHeight:1,marginBottom:20}}>
            PAGAR SUSCRIPCIÓN
          </h1>

          {/* Order summary */}
          <div style={{
            background:"#fff",border:"1px solid #eee",borderRadius:20,padding:24,marginBottom:24,
          }}>
            <h3 style={{fontSize:14,fontWeight:800,color:"#888",letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>
              Resumen
            </h3>

            {subscriber && (
              <div style={{fontSize:14,color:"#999",marginBottom:16}}>
                {subscriber.first_name} · {subscriber.email}
              </div>
            )}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:15,fontWeight:600}}>Plan {info.name}</span>
              <span style={{fontFamily:"'Anton',sans-serif",fontSize:28}}>S/{info.price}</span>
            </div>

            <div style={{fontSize:13,color:"#999",marginBottom:16}}>
              Cobro cada {info.period} · Cancela cuando quieras
            </div>

            <div style={{borderTop:"1px solid #eee",paddingTop:12,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:14,fontWeight:700}}>Total hoy</span>
              <span style={{fontSize:14,fontWeight:700}}>S/ {info.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Niubiz button placeholder */}
          <button
            onClick={() => {
              // TODO: Trigger Niubiz checkout here
              alert("Aquí se abrirá el formulario de pago de Niubiz");
            }}
            style={{
              width:"100%",padding:"18px",fontSize:16,fontWeight:800,
              background:"#a3e635",color:"#000",border:"none",borderRadius:100,
              cursor:"pointer",transition:"all 0.3s",marginBottom:16,
            }}
          >
            Pagar S/ {info.price.toFixed(2)} →
          </button>

          {/* Payment methods */}
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
            {["VISA","MC","AMEX","DINERS"].map(c=>(
              <div key={c} style={{background:"#f5f5f5",borderRadius:8,padding:"6px 14px",fontSize:11,fontWeight:800,color:"#999",letterSpacing:1}}>{c}</div>
            ))}
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span style={{fontSize:16}}>🔒</span>
            <span style={{fontSize:12,color:"#bbb"}}>Pago seguro procesado por Niubiz · PCI DSS</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PagarPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Cargando...</div>}>
      <PagarForm />
    </Suspense>
  );
}
