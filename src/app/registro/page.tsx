"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PLAN_NAMES: Record<string, string> = {
  monthly: "Mensual · S/8",
  quarterly: "Trimestral · S/21",
  biannual: "Semestral · S/39",
};

function RegistroForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "monthly";
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState(error === "auth" ? "Hubo un error de autenticación. Intenta de nuevo." : "");

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
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',sans-serif;background:#fafafa;color:#111}
  `;

  if (sent) {
    return (
      <>
        <style>{css}</style>
        <div style={{
          minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
          padding:20,background:"#fafafa",
        }}>
          <div style={{maxWidth:440,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:20}}>📬</div>
            <h1 style={{fontFamily:"'Anton',sans-serif",fontSize:36,letterSpacing:1,marginBottom:12}}>
              REVISA TU CORREO
            </h1>
            <p style={{color:"#777",fontSize:16,lineHeight:1.6,marginBottom:24}}>
              Enviamos un enlace mágico a<br/>
              <strong style={{color:"#111"}}>{email}</strong>
            </p>
            <p style={{color:"#999",fontSize:14,lineHeight:1.6}}>
              Haz clic en el enlace del correo para continuar con tu suscripción.
              Revisa la carpeta de spam si no lo encuentras.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{
                marginTop:24,background:"transparent",border:"2px solid #ddd",borderRadius:100,
                padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",color:"#666",
              }}
            >
              Usar otro correo
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        padding:20,background:"#fafafa",
      }}>
        <div style={{maxWidth:440,width:"100%"}}>
          {/* Back to home */}
          <a href="/" style={{
            display:"inline-flex",alignItems:"center",gap:6,
            fontSize:14,color:"#999",textDecoration:"none",marginBottom:32,
          }}>
            ← Volver al inicio
          </a>

          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
            <span style={{fontSize:28}}>🍀</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:22,letterSpacing:2}}>DÍA DE MI SUERTE</span>
          </div>

          {/* Plan badge */}
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,
            background:"rgba(163,230,53,0.1)",border:"1px solid rgba(163,230,53,0.25)",
            borderRadius:100,padding:"8px 18px",marginBottom:24,
          }}>
            <span style={{fontSize:12,fontWeight:700,color:"#84cc16"}}>
              Plan: {PLAN_NAMES[plan] || "Mensual · S/8"}
            </span>
          </div>

          <h1 style={{
            fontFamily:"'Anton',sans-serif",fontSize:"clamp(32px,7vw,44px)",
            letterSpacing:1,lineHeight:1,marginBottom:12,
          }}>
            CREA TU CUENTA
          </h1>
          <p style={{color:"#777",fontSize:15,marginBottom:32,lineHeight:1.5}}>
            Ingresa tu correo y te enviamos un enlace para acceder. Sin contraseñas, sin complicaciones.
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
                width:"100%",padding:"16px 20px",fontSize:16,
                border:"2px solid #eee",borderRadius:16,outline:"none",
                transition:"border-color 0.2s",background:"#fff",
              }}
              onFocus={(e) => e.target.style.borderColor = "#a3e635"}
              onBlur={(e) => e.target.style.borderColor = "#eee"}
            />
          </div>

          {/* Error */}
          {errMsg && (
            <p style={{color:"#ef4444",fontSize:13,marginBottom:16,fontWeight:600}}>{errMsg}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width:"100%",padding:"18px",fontSize:16,fontWeight:800,
              background: loading ? "#ddd" : "#a3e635",
              color:"#000",border:"none",borderRadius:100,cursor: loading ? "not-allowed" : "pointer",
              transition:"all 0.3s",marginBottom:16,
            }}
          >
            {loading ? "Enviando..." : "Enviar enlace mágico →"}
          </button>

          <p style={{fontSize:12,color:"#bbb",textAlign:"center",lineHeight:1.6}}>
            Al continuar aceptas nuestros{" "}
            <a href="#" style={{color:"#999",textDecoration:"underline"}}>Términos y condiciones</a>
            {" "}y{" "}
            <a href="#" style={{color:"#999",textDecoration:"underline"}}>Política de privacidad</a>
          </p>

          {/* Security badge */}
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            marginTop:32,padding:"12px 0",borderTop:"1px solid #eee",
          }}>
            <span style={{fontSize:16}}>🔒</span>
            <span style={{fontSize:12,color:"#bbb"}}>Pagos seguros con Niubiz · PCI DSS Compliant</span>
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
