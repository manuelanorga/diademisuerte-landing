"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";

const DOC_TYPES = ["DNI Peruano", "Carné de Extranjería", "Pasaporte"];

function DatosForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "monthly";
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [form, setForm] = useState({
    doc_type: "DNI Peruano",
    doc_number: "",
    first_name: "",
    last_name: "",
    country: "PERU",
    district: "",
    phone: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const isValid =
    form.doc_number.length >= 8 &&
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.phone.length >= 9;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/registro");
      return;
    }

    // Save billing data to Supabase
    const { error } = await supabase.from("subscribers").upsert({
      id: user.id,
      email: user.email,
      doc_type: form.doc_type,
      doc_number: form.doc_number,
      first_name: form.first_name,
      last_name: form.last_name,
      country: form.country,
      district: form.district,
      phone: form.phone,
      plan,
      status: "pending_payment",
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving data:", error);
      setLoading(false);
      return;
    }

    // Go to payment
    router.push(`/registro/pagar?plan=${plan}`);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',sans-serif;background:#fafafa;color:#111}
    .field{width:100%;padding:16px 20px;font-size:15;border:2px solid #eee;border-radius:16px;outline:none;transition:border-color 0.2s;background:#fff;font-family:'DM Sans',sans-serif}
    .field:focus{border-color:#a3e635}
    select.field{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23999' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center}
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        padding:20,background:"#fafafa",
      }}>
        <div style={{maxWidth:480,width:"100%"}}>
          {/* Back */}
          <a href="/" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:14,color:"#999",textDecoration:"none",marginBottom:32}}>
            ← Volver al inicio
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
                <div style={{height:4,borderRadius:4,background:i<=1?"#a3e635":"#eee",marginBottom:6,transition:"all 0.3s"}}/>
                <span style={{fontSize:11,color:i<=1?"#111":"#ccc",fontWeight:i===1?800:500}}>{step}</span>
              </div>
            ))}
          </div>

          <h1 style={{fontFamily:"'Anton',sans-serif",fontSize:"clamp(28px,6vw,38px)",letterSpacing:1,lineHeight:1,marginBottom:8}}>
            INFORMACIÓN DE FACTURACIÓN
          </h1>
          {userEmail && (
            <p style={{color:"#999",fontSize:13,marginBottom:28}}>Registrado como: <strong style={{color:"#111"}}>{userEmail}</strong></p>
          )}

          {/* Form */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Doc type */}
            <div>
              <label style={{fontSize:12,fontWeight:700,color:"#888",display:"block",marginBottom:6}}>Tipo de documento de identidad</label>
              <select className="field" value={form.doc_type} onChange={(e)=>set("doc_type",e.target.value)}>
                {DOC_TYPES.map(d=>(<option key={d} value={d}>{d}</option>))}
              </select>
            </div>

            {/* Doc number */}
            <input className="field" placeholder="Número de documento" value={form.doc_number}
              onChange={(e)=>set("doc_number",e.target.value)} maxLength={12}/>

            {/* Name */}
            <input className="field" placeholder="Escribe tu nombre" value={form.first_name}
              onChange={(e)=>set("first_name",e.target.value)}/>

            {/* Last name */}
            <input className="field" placeholder="Escribe tus apellidos" value={form.last_name}
              onChange={(e)=>set("last_name",e.target.value)}/>

            {/* Country */}
            <input className="field" placeholder="País" value={form.country}
              onChange={(e)=>set("country",e.target.value)}/>

            {/* District */}
            <input className="field" placeholder="Escribe tu Distrito/Provincia/Departamento" value={form.district}
              onChange={(e)=>set("district",e.target.value)}/>

            {/* Phone */}
            <div style={{display:"flex",gap:8}}>
              <div style={{
                display:"flex",alignItems:"center",gap:6,padding:"0 16px",
                border:"2px solid #eee",borderRadius:16,background:"#fff",flexShrink:0,
              }}>
                <span style={{fontSize:14}}>🇵🇪</span>
                <span style={{fontSize:14,color:"#555",fontWeight:600}}>+51</span>
              </div>
              <input className="field" placeholder="Número de celular" value={form.phone}
                onChange={(e)=>set("phone",e.target.value.replace(/\D/g,""))} maxLength={9} style={{flex:1}}/>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !isValid}
            style={{
              width:"100%",padding:"18px",fontSize:16,fontWeight:800,marginTop:24,
              background: !isValid ? "#eee" : loading ? "#ddd" : "#a3e635",
              color: !isValid ? "#bbb" : "#000",
              border:"none",borderRadius:100,
              cursor: !isValid || loading ? "not-allowed" : "pointer",
              transition:"all 0.3s",
            }}
          >
            {loading ? "Guardando..." : "Continuar con mi pago →"}
          </button>

          {/* Security */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:24}}>
            <span style={{fontSize:16}}>🔒</span>
            <span style={{fontSize:12,color:"#bbb"}}>Tu información está protegida</span>
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
