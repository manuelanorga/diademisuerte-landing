"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";

const DOC_TYPES = ["DNI Peruano", "Carné de Extranjería", "Pasaporte"];
const PLAN_INFO: Record<string, { name: string; price: number; period: string }> = {
  monthly: { name: "Mensual", price: 8, period: "mes" },
  quarterly: { name: "Trimestral", price: 21, period: "3 meses" },
  biannual: { name: "Semestral", price: 39, period: "6 meses" },
};

function DatosForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "monthly";
  const info = PLAN_INFO[plan] || PLAN_INFO.monthly;
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [form, setForm] = useState({
    doc_type: "DNI Peruano", doc_number: "", first_name: "", last_name: "",
    country: "PERU", district: "", phone: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const isValid = form.doc_number.length >= 8 && form.first_name.trim() && form.last_name.trim() && form.phone.length >= 9;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/registro"); return; }
    const { error } = await supabase.from("subscribers").upsert({
      id: user.id, email: user.email, ...form, plan, status: "pending_payment",
      updated_at: new Date().toISOString(),
    });
    if (error) { console.error(error); setLoading(false); return; }
    router.push(`/registro/pagar?plan=${plan}`);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',sans-serif;background:#fafafa;color:#111}
    .dat-split{display:flex;min-height:100vh}
    .dat-left{flex:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(32px,6vw,80px);position:relative}
    .dat-right{flex:1;background:#111;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:clamp(32px,6vw,60px);position:relative;overflow:hidden}
    .field{width:100%;padding:16px 20px;font-size:15px;border:2px solid #eee;border-radius:14px;outline:none;transition:all 0.2s;background:#fff;font-family:'DM Sans',sans-serif}
    .field:focus{border-color:#a3e635;box-shadow:0 0 0 4px rgba(163,230,53,0.1)}
    select.field{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23999' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center}
    @media(max-width:768px){
      .dat-split{flex-direction:column}
      .dat-right{display:none}
      .dat-left{padding:24px 20px;padding-top:80px}
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="dat-split">
        {/* Form side */}
        <div className="dat-left">
          <div style={{maxWidth:460,width:"100%",margin:"0 auto"}}>
            {/* Back + Logo */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
              <a href="/" style={{fontSize:14,color:"#999",textDecoration:"none"}}>← Volver</a>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>🍀</span>
                <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,letterSpacing:2}}>DÍA DE MI SUERTE</span>
              </div>
            </div>

            {/* Progress */}
            <div style={{display:"flex",gap:8,marginBottom:36}}>
              {["Correo","Datos","Pago"].map((step,i)=>(
                <div key={step} style={{flex:1,textAlign:"center"}}>
                  <div style={{height:4,borderRadius:4,marginBottom:8,background:i<=1?"#a3e635":"#eee"}}/>
                  <span style={{fontSize:12,color:i<=1?"#111":"#ccc",fontWeight:i===1?800:500}}>{step}</span>
                </div>
              ))}
            </div>

            <h1 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(26px,5vw,36px)",letterSpacing:1,lineHeight:1,marginBottom:8}}>
              INFORMACIÓN DE FACTURACIÓN
            </h1>
            {userEmail && (
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(163,230,53,0.1)",borderRadius:100,padding:"6px 14px",marginBottom:24}}>
                <span style={{fontSize:11}}>✉️</span>
                <span style={{fontSize:12,fontWeight:700,color:"#84cc16"}}>{userEmail}</span>
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"#888",display:"block",marginBottom:6}}>Tipo de documento</label>
                <select className="field" value={form.doc_type} onChange={(e)=>set("doc_type",e.target.value)}>
                  {DOC_TYPES.map(d=>(<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
              <input className="field" placeholder="Número de documento" value={form.doc_number} onChange={(e)=>set("doc_number",e.target.value)} maxLength={12}/>
              <div style={{display:"flex",gap:10}}>
                <input className="field" placeholder="Nombre" value={form.first_name} onChange={(e)=>set("first_name",e.target.value)} style={{flex:1}}/>
                <input className="field" placeholder="Apellidos" value={form.last_name} onChange={(e)=>set("last_name",e.target.value)} style={{flex:1}}/>
              </div>
              <input className="field" placeholder="País" value={form.country} onChange={(e)=>set("country",e.target.value)}/>
              <input className="field" placeholder="Distrito / Provincia / Departamento" value={form.district} onChange={(e)=>set("district",e.target.value)}/>
              <div style={{display:"flex",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"0 16px",border:"2px solid #eee",borderRadius:14,background:"#fff",flexShrink:0}}>
                  <span style={{fontSize:14}}>🇵🇪</span>
                  <span style={{fontSize:14,color:"#555",fontWeight:600}}>+51</span>
                </div>
                <input className="field" placeholder="Número de celular" value={form.phone} onChange={(e)=>set("phone",e.target.value.replace(/\D/g,""))} maxLength={9} style={{flex:1}}/>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading || !isValid} style={{
              width:"100%",padding:"18px",fontSize:16,fontWeight:800,marginTop:24,
              background:!isValid?"#eee":loading?"#ddd":"#a3e635",
              color:!isValid?"#bbb":"#000",border:"none",borderRadius:100,
              cursor:!isValid||loading?"not-allowed":"pointer",transition:"all 0.3s",
              boxShadow:isValid&&!loading?"0 8px 30px rgba(163,230,53,0.2)":"none",
              fontFamily:"'DM Sans',sans-serif",
            }}>
              {loading ? "Guardando..." : "Continuar con mi pago →"}
            </button>

            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:20}}>
              <span style={{fontSize:14}}>🔒</span>
              <span style={{fontSize:12,color:"#ccc"}}>Tu información está protegida</span>
            </div>
          </div>
        </div>

        {/* Branding side */}
        <div className="dat-right">
          <div style={{position:"absolute",bottom:"-20%",left:"-20%",width:"60%",height:"60%",borderRadius:"50%",background:"radial-gradient(circle,rgba(163,230,53,0.06),transparent)",filter:"blur(60px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:340,textAlign:"center",position:"relative",zIndex:2}}>
            <div style={{fontSize:64,marginBottom:16}}>🏆</div>
            <h2 style={{fontFamily:"'Anton',sans-serif",fontSize:32,color:"#fff",letterSpacing:1,lineHeight:1.1,marginBottom:12}}>
              COMPLETA TUS DATOS<br/>Y <span style={{color:"#a3e635"}}>PARTICIPA</span>
            </h2>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,lineHeight:1.6,marginBottom:32}}>
              Solo necesitamos esta información una vez para enviarte tus premios.
            </p>

            {/* Plan reminder */}
            <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"20px",textAlign:"left"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontFamily:"'Anton',sans-serif",fontSize:20,color:"#fff"}}>{info.name.toUpperCase()}</span>
                <span style={{fontFamily:"'Anton',sans-serif",fontSize:28,color:"#a3e635"}}>S/{info.price}</span>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:4}}>/{info.period} · Cancela cuando quieras</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DatosPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Cargando...</div>}>
      <DatosForm />
    </Suspense>
  );
}
