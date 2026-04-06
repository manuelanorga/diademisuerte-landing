"use client";
import { useState } from "react";

export default function Codigos() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const handleValidate = () => {
    if (!code.trim()) { setMsg("Ingresa un código"); return; }
    // TODO: Validate code against Supabase table
    setMsg("🎉 ¡Código válido! Se agregó 1 chance extra a tu cuenta.");
    setCode("");
    setTimeout(() => setMsg(""), 5000);
  };

  return (
    <div>
      <h1 style={{ fontFamily:"'Anton',sans-serif", fontSize:"clamp(28px,5vw,36px)", letterSpacing:1, marginBottom:8 }}>MIS CÓDIGOS DE LA SUERTE</h1>
      <p style={{ color:"#999", fontSize:14, marginBottom:32 }}>Valida códigos y gana más oportunidades de ganar</p>

      {/* Code input */}
      <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, padding:28, marginBottom:24, maxWidth:500 }}>
        <h3 style={{ fontSize:16, fontWeight:800, marginBottom:16 }}>🎟️ Validar código</h3>
        <div style={{ display:"flex", gap:10 }}>
          <input
            value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Ingresa tu código aquí"
            style={{ flex:1, padding:"14px 16px", fontSize:15, border:"2px solid #eee", borderRadius:12, outline:"none", fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase", letterSpacing:2 }}
            onFocus={e => e.target.style.borderColor = "#a3e635"}
            onBlur={e => e.target.style.borderColor = "#eee"}
            onKeyDown={e => e.key === "Enter" && handleValidate()}
          />
          <button onClick={handleValidate} style={{ background:"#a3e635", color:"#000", border:"none", borderRadius:12, padding:"14px 24px", fontSize:14, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap" }}>
            Validar
          </button>
        </div>
        {msg && <p style={{ marginTop:12, fontSize:14, fontWeight:600, color: msg.includes("Error") || msg.includes("Ingresa") ? "#ef4444" : "#16a34a" }}>{msg}</p>}
      </div>

      {/* Chances summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))", gap:16, marginBottom:24 }}>
        <div style={{ background:"#111", borderRadius:20, padding:24, color:"#fff", textAlign:"center" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:8, fontWeight:700 }}>CHANCES ACTUALES</div>
          <div style={{ fontFamily:"'Anton',sans-serif", fontSize:48, color:"#a3e635" }}>0</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>para el próximo sorteo</div>
        </div>
        <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, padding:24, textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#999", marginBottom:8, fontWeight:700 }}>CÓDIGOS USADOS</div>
          <div style={{ fontFamily:"'Anton',sans-serif", fontSize:48, color:"#111" }}>0</div>
          <div style={{ fontSize:12, color:"#ccc" }}>en total</div>
        </div>
      </div>

      {/* Coming soon: Roulette */}
      <div style={{ background:"#f5f5f5", border:"2px dashed #ddd", borderRadius:20, padding:40, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🎰</div>
        <h3 style={{ fontFamily:"'Anton',sans-serif", fontSize:22, letterSpacing:1, marginBottom:8 }}>RULETA DE LA SUERTE</h3>
        <p style={{ color:"#999", fontSize:14 }}>Próximamente: gira la ruleta y gana chances extras</p>
      </div>
    </div>
  );
}
