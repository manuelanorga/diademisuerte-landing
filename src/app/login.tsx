"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // If already logged in, redirect
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push("/mi-cuenta");
    });
  }, [router]);

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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/mi-cuenta`,
      },
    });

    if (error) {
      setErrMsg("Error al enviar el enlace. Intenta de nuevo en unos minutos.");
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
    .login-split{display:flex;min-height:100vh}
    .login-brand{flex:1;background:#111;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:clamp(32px,6vw,60px);position:relative;overflow:hidden}
    .login-form{flex:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(32px,6vw,80px);position:relative}
    @media(max-width:768px){
      .login-split{flex-direction:column}
      .login-brand{display:none}
      .login-form{padding:24px 20px;padding-top:80px}
      .login-mob-bar{display:flex!important}
      .cta-login{width:100%;text-align:center}
    }
    .login-mob-bar{
      display:none;align-items:center;justify-content:center;gap:8;
      background:#111;padding:16px 20px;
      position:fixed;top:0;left:0;right:0;z-index:50;
    }
  `;

  if (sent) {
    return (
      <>
        <style>{css}</style>
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{maxWidth:440,width:"100%",textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(163,230,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36}}>📬</div>
            <h1 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(28px,6vw,40px)",letterSpacing:1,marginBottom:12}}>REVISA TU CORREO</h1>
            <p style={{color:"#777",fontSize:15,lineHeight:1.6,marginBottom:8}}>Enviamos un enlace de acceso a</p>
            <p style={{fontSize:16,fontWeight:800,color:"#111",background:"rgba(163,230,53,0.1)",borderRadius:12,padding:"10px 18px",display:"inline-block",marginBottom:20}}>{email}</p>
            <p style={{color:"#bbb",fontSize:13,lineHeight:1.6}}>Haz clic en el enlace del correo para ingresar a tu cuenta.<br/>Revisa spam si no lo encuentras.</p>
            <button onClick={() => { setSent(false); setEmail(""); }} style={{marginTop:20,background:"transparent",border:"2px solid #eee",borderRadius:100,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",color:"#666"}}>
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

      {/* Mobile top bar */}
      <div className="login-mob-bar">
        <span style={{fontSize:18}}>🍀</span>
        <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,letterSpacing:2,color:"#fff"}}>DÍA DE MI SUERTE</span>
      </div>

      <div className="login-split">
        {/* Left: Branding */}
        <div className="login-brand">
          <div style={{position:"absolute",top:"-20%",right:"-20%",width:"60%",height:"60%",borderRadius:"50%",background:"radial-gradient(circle,rgba(163,230,53,0.08),transparent)",filter:"blur(60px)",pointerEvents:"none"}}/>
          <a href="/" style={{position:"absolute",top:24,left:24,display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <span style={{fontSize:20}}>🍀</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:18,letterSpacing:2,color:"#fff"}}>DÍA DE MI SUERTE</span>
          </a>
          <div style={{maxWidth:340,textAlign:"center",position:"relative",zIndex:2}}>
            <div style={{fontSize:72,marginBottom:16}}>👋</div>
            <h2 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(28px,4vw,38px)",color:"#fff",letterSpacing:1,lineHeight:1.1,marginBottom:12}}>
              BIENVENIDO<br/>DE <span style={{color:"#a3e635"}}>VUELTA</span>
            </h2>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,lineHeight:1.6}}>
              Ingresa a tu cuenta para ver tus sorteos, premios y gestionar tu suscripción.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="login-form">
          <div style={{maxWidth:400,width:"100%",margin:"0 auto"}}>
            <a href="/" style={{fontSize:14,color:"#999",textDecoration:"none",display:"block",marginBottom:28}}>← Volver al inicio</a>

            <h1 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(28px,6vw,40px)",letterSpacing:1,lineHeight:1,marginBottom:10}}>
              INICIAR SESIÓN
            </h1>
            <p style={{color:"#999",fontSize:14,marginBottom:28,lineHeight:1.5}}>
              Ingresa tu correo y te enviamos un enlace para acceder. Sin contraseñas.
            </p>

            {/* Email */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:700,color:"#555",display:"block",marginBottom:8}}>Correo electrónico</label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  width:"100%",padding:"18px 20px",fontSize:16,
                  border:"2px solid #eee",borderRadius:16,outline:"none",
                  transition:"all 0.2s",background:"#fff",fontFamily:"'DM Sans',sans-serif",
                }}
                onFocus={(e) => {e.target.style.borderColor="#a3e635";e.target.style.boxShadow="0 0 0 4px rgba(163,230,53,0.1)"}}
                onBlur={(e) => {e.target.style.borderColor="#eee";e.target.style.boxShadow="none"}}
              />
            </div>

            {/* Error */}
            {errMsg && (
              <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>⚠️</span>
                <p style={{color:"#ef4444",fontSize:13,fontWeight:600}}>{errMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cta-login"
              style={{
                width:"100%",padding:"18px",fontSize:16,fontWeight:800,
                background: loading ? "#eee" : "#a3e635",color: loading ? "#999" : "#000",
                border:"none",borderRadius:100,cursor: loading ? "not-allowed" : "pointer",
                transition:"all 0.3s",marginBottom:20,fontFamily:"'DM Sans',sans-serif",
                boxShadow: loading ? "none" : "0 8px 30px rgba(163,230,53,0.2)",
              }}
            >
              {loading ? "Enviando..." : "Enviar enlace de acceso →"}
            </button>

            {/* Register link */}
            <p style={{fontSize:14,color:"#999",textAlign:"center"}}>
              ¿No tienes cuenta?{" "}
              <a href="/registro?plan=monthly" style={{color:"#84cc16",fontWeight:700,textDecoration:"none"}}>Suscríbete aquí</a>
            </p>

            {/* Security */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:28,padding:"14px 0",borderTop:"1px solid #f0f0f0"}}>
              <span style={{fontSize:14}}>🔒</span>
              <span style={{fontSize:12,color:"#ccc"}}>Acceso seguro · Sin contraseñas</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
