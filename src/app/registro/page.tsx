"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PLAN_INFO: Record<string, { name: string; price: number; period: string; highlight: string }> = {
  monthly: { name: "Mensual", price: 8, period: "mes", highlight: "Chances normales" },
  quarterly: { name: "Trimestral", price: 21, period: "3 meses", highlight: "Doble de chances" },
  biannual: { name: "Semestral", price: 39, period: "6 meses", highlight: "Triple de chances" },
};

function RegistroForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "monthly";
  const info = PLAN_INFO[plan] || PLAN_INFO.monthly;
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState(error === "auth" ? "El enlace expiró. Intenta de nuevo." : "");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setErrMsg("Ingresa un correo electrónico válido");
      return;
    }
    setLoading(true);
    setErrMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?plan=${plan}`,
      },
    });

    if (error) {
      setErrMsg("Error al enviar el enlace. Intenta de nuevo.");
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',sans-serif;background:#fafafa;color:#111}
    .reg-split{display:flex;min-height:100vh}
    .reg-left{flex:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(32px,6vw,80px);position:relative;overflow:hidden}
    .reg-right{flex:1;background:#111;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:clamp(32px,6vw,60px);position:relative;overflow:hidden}
    .reg-compact{display:none}
    .reg-mobile-summary{display:none}
    .reg-back-logo{display:block}
    @media(max-width:768px){
      .reg-split{flex-direction:column}
      .reg-right{display:none}
      .reg-left{padding:16px 20px;padding-top:72px;order:2}
      .reg-back-logo{display:none}
      .reg-compact{
        display:flex;align-items:center;justify-content:space-between;
        background:#111;padding:14px 20px;gap:12;
        position:fixed;top:0;left:0;right:0;z-index:50;
      }
      .reg-mobile-summary{
        display:block;
        background:#111;border-radius:20px;padding:20px;margin-bottom:28px;
      }
    }
  `;

  if (sent) {
    return (
      <>
        <style>{css}</style>
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#fafafa"}}>
          <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
            {/* Animated envelope */}
            <div style={{
              width:100,height:100,borderRadius:"50%",background:"rgba(163,230,53,0.1)",
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 24px",fontSize:48,
            }}>📬</div>

            <h1 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(32px,6vw,44px)",letterSpacing:1,marginBottom:12}}>
              REVISA TU CORREO
            </h1>
            <p style={{color:"#777",fontSize:16,lineHeight:1.6,marginBottom:8}}>
              Enviamos un enlace mágico a
            </p>
            <p style={{
              fontSize:18,fontWeight:800,color:"#111",
              background:"rgba(163,230,53,0.1)",borderRadius:12,padding:"12px 20px",
              display:"inline-block",marginBottom:24,
            }}>{email}</p>

            <div style={{
              background:"#f5f5f5",borderRadius:16,padding:"20px 24px",textAlign:"left",
              marginBottom:24,
            }}>
              <p style={{fontSize:14,color:"#555",lineHeight:1.7}}>
                <strong>📌 Pasos a seguir:</strong><br/>
                1. Abre tu correo electrónico<br/>
                2. Busca el email de Día de mi Suerte<br/>
                3. Haz clic en el enlace para continuar<br/>
                <span style={{color:"#999",fontSize:13}}>💡 Revisa la carpeta de spam si no lo encuentras</span>
              </p>
            </div>

            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{
                background:"transparent",border:"2px solid #eee",borderRadius:100,
                padding:"14px 32px",fontSize:14,fontWeight:700,cursor:"pointer",color:"#666",
                transition:"all 0.3s",
              }}
            >
              ← Usar otro correo
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="reg-split">
        {/* ── MOBILE: Compact top bar ── */}
        <div className="reg-compact">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🍀</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:14,letterSpacing:2,color:"#fff"}}>DÍA DE MI SUERTE</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:"#a3e635"}}>S/{info.price}</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Plan {info.name}</span>
          </div>
        </div>
        {/* ── LEFT: Branding + info ── */}
        <div className="reg-right">
          {/* Background decoration */}
          <div style={{position:"absolute",top:"-20%",right:"-20%",width:"60%",height:"60%",borderRadius:"50%",background:"radial-gradient(circle,rgba(163,230,53,0.08),transparent)",filter:"blur(60px)",pointerEvents:"none"}}/>

          {/* Logo */}
          <a href="/" style={{position:"absolute",top:24,left:24,display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <span style={{fontSize:20}}>🍀</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:18,letterSpacing:2,color:"#fff"}}>DÍA DE MI SUERTE</span>
          </a>

          <div style={{maxWidth:380,textAlign:"center",position:"relative",zIndex:2}}>
            {/* Prize */}
            <div style={{fontSize:80,marginBottom:16}}>🎁</div>
            <h2 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(28px,5vw,40px)",color:"#fff",letterSpacing:1,lineHeight:1,marginBottom:12}}>
              ESTÁS A UN PASO<br/>DE <span style={{color:"#a3e635"}}>GANAR</span>
            </h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,lineHeight:1.6,marginBottom:28}}>
              Todos los miércoles sorteamos grandes premios en vivo. Suscríbete y participas automáticamente. Ya estás cerca.
            </p>

            {/* Plan summary card */}
            <div style={{
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20,padding:"24px",textAlign:"left",
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)"}}>Tu plan seleccionado</span>
                <span style={{
                  background:"rgba(163,230,53,0.15)",color:"#a3e635",
                  fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:100,
                }}>{info.highlight}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontFamily:"'Anton',sans-serif",fontSize:24,color:"#fff",letterSpacing:1}}>{info.name.toUpperCase()}</span>
                <div>
                  <span style={{fontFamily:"'Anton',sans-serif",fontSize:36,color:"#a3e635"}}>S/{info.price}</span>
                  <span style={{color:"rgba(255,255,255,0.35)",fontSize:13}}>/{info.period}</span>
                </div>
              </div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:16,paddingTop:12}}>
                {["✓ Premios semanales automáticos","✓ Juega y gana chances","✓ Cancela cuando quieras"].map((b,i)=>(
                  <div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:4}}>{b}</div>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginTop:24}}>
              {["VISA","MC","AMEX"].map(c=>(
                <span key={c} style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.2)",letterSpacing:1}}>{c}</span>
              ))}
              <span style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>🔒 Niubiz</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="reg-left">
          <div style={{maxWidth:420,width:"100%",margin:"0 auto"}}>

            {/* Mobile-only: plan summary card (dark) */}
            <div className="reg-mobile-summary">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)"}}>Tu plan seleccionado</span>
                <span style={{background:"rgba(163,230,53,0.15)",color:"#a3e635",fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:100}}>{info.highlight}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontFamily:"'Anton',sans-serif",fontSize:22,color:"#fff",letterSpacing:1}}>{info.name.toUpperCase()}</span>
                <div>
                  <span style={{fontFamily:"'Anton',sans-serif",fontSize:32,color:"#a3e635"}}>S/{info.price}</span>
                  <span style={{color:"rgba(255,255,255,0.35)",fontSize:12}}>/{info.period}</span>
                </div>
              </div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:14,paddingTop:10}}>
                {["✓ Premios semanales automáticos","✓ Juega y gana chances","✓ Cancela cuando quieras"].map((b,i)=>(
                  <div key={i} style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:3}}>{b}</div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div style={{display:"flex",gap:8,marginBottom:28}}>
              {["Correo","Datos","Pago"].map((step,i)=>(
                <div key={step} style={{flex:1,textAlign:"center"}}>
                  <div style={{
                    height:4,borderRadius:4,marginBottom:6,
                    background:i===0?"#a3e635":"#eee",
                    transition:"all 0.3s",
                  }}/>
                  <span style={{fontSize:11,color:i===0?"#111":"#ccc",fontWeight:i===0?800:500}}>{step}</span>
                </div>
              ))}
            </div>

            <h1 style={{
              fontFamily:"'Anton',sans-serif",fontSize:"clamp(28px,6vw,44px)",
              letterSpacing:1,lineHeight:1,marginBottom:10,
            }}>
              CREA TU CUENTA
            </h1>
            <p style={{color:"#999",fontSize:14,marginBottom:24,lineHeight:1.5}}>
              Ingresa tu correo y te enviamos un enlace para acceder.<br/>
              <strong style={{color:"#666"}}>Sin contraseñas, sin complicaciones.</strong>
            </p>

            {/* Email input */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:700,color:"#555",display:"block",marginBottom:8}}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  width:"100%",padding:"18px 20px",fontSize:16,
                  border:"2px solid #eee",borderRadius:16,outline:"none",
                  transition:"all 0.2s",background:"#fff",
                  fontFamily:"'DM Sans',sans-serif",
                }}
                onFocus={(e) => {e.target.style.borderColor="#a3e635";e.target.style.boxShadow="0 0 0 4px rgba(163,230,53,0.1)"}}
                onBlur={(e) => {e.target.style.borderColor="#eee";e.target.style.boxShadow="none"}}
              />
            </div>

            {/* Error */}
            {errMsg && (
              <div style={{
                background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",
                borderRadius:12,padding:"12px 16px",marginBottom:16,
                display:"flex",alignItems:"center",gap:8,
              }}>
                <span style={{fontSize:14}}>⚠️</span>
                <p style={{color:"#ef4444",fontSize:13,fontWeight:600}}>{errMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width:"100%",padding:"18px",fontSize:16,fontWeight:800,
                background: loading ? "#eee" : "#a3e635",
                color: loading ? "#999" : "#000",
                border:"none",borderRadius:100,cursor: loading ? "not-allowed" : "pointer",
                transition:"all 0.3s",marginBottom:20,
                fontFamily:"'DM Sans',sans-serif",
                boxShadow: loading ? "none" : "0 8px 30px rgba(163,230,53,0.2)",
              }}
            >
              {loading ? "Enviando..." : "Enviar enlace mágico →"}
            </button>

            <p style={{fontSize:12,color:"#ccc",textAlign:"center",lineHeight:1.6}}>
              Al continuar aceptas nuestros{" "}
              <a href="#" style={{color:"#aaa",textDecoration:"underline"}}>Términos y condiciones</a>
              {" "}y{" "}
              <a href="#" style={{color:"#aaa",textDecoration:"underline"}}>Política de privacidad</a>
            </p>

            {/* Security footer */}
            <div style={{
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              marginTop:32,padding:"16px 0",borderTop:"1px solid #f0f0f0",
            }}>
              <span style={{fontSize:14}}>🔒</span>
              <span style={{fontSize:12,color:"#ccc"}}>Pagos seguros con Niubiz · PCI DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RegistroPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Cargando...</div>}>
      <RegistroForm />
    </Suspense>
  );
}