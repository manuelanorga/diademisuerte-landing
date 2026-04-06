"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Perfil() {
  const [sub, setSub] = useState<Record<string, string> | null>(null);
  const [userId, setUserId] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone:"", country:"", district:"" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id.slice(0, 12));
      const { data: d } = await s.from("subscribers").select("*").eq("id", data.user.id).single();
      if (d) {
        setSub(d);
        setForm({ phone: d.phone || "", country: d.country || "", district: d.district || "" });
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg("");
    const s = createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return;
    const { error } = await s.from("subscribers").update({ ...form, updated_at: new Date().toISOString() }).eq("id", user.id);
    setSaving(false);
    if (error) setMsg("Error al guardar");
    else { setMsg("✓ Datos actualizados"); setEditing(false); setSub(prev => prev ? { ...prev, ...form } : prev); }
    setTimeout(() => setMsg(""), 3000);
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const css = `.field-edit{width:100%;padding:14px 16px;font-size:15px;border:1px solid #eee;border-radius:12px;outline:none;font-family:'DM Sans',sans-serif;transition:all 0.2s;background:#fff}.field-edit:focus{border-color:#a3e635;box-shadow:0 0 0 4px rgba(163,230,53,0.1)}.field-edit:disabled{background:#f9f9f9;color:#888}`;

  return (
    <div>
      <style>{css}</style>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Anton',sans-serif", fontSize:"clamp(28px,5vw,36px)", letterSpacing:1 }}>MI PERFIL</h1>
          <p style={{ color:"#999", fontSize:14 }}>Gestiona tu información personal</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ background:"#111", color:"#fff", border:"none", borderRadius:100, padding:"12px 24px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Editar información</button>
        ) : (
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => { setEditing(false); if(sub) setForm({ phone:sub.phone||"", country:sub.country||"", district:sub.district||"" }); }} style={{ background:"transparent", border:"1px solid #ddd", borderRadius:100, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", color:"#888" }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ background:"#a3e635", color:"#000", border:"none", borderRadius:100, padding:"10px 24px", fontSize:13, fontWeight:800, cursor:"pointer" }}>{saving ? "Guardando..." : "Guardar cambios"}</button>
          </div>
        )}
      </div>

      {msg && <div style={{ background:msg.includes("Error") ? "rgba(239,68,68,0.1)" : "rgba(163,230,53,0.1)", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:14, fontWeight:600, color:msg.includes("Error") ? "#ef4444" : "#16a34a" }}>{msg}</div>}

      {/* Identity card (non-editable) */}
      <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, padding:28, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, paddingBottom:20, borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"#a3e635", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#000", flexShrink:0 }}>{sub?.first_name?.[0] || "?"}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:18, fontWeight:800 }}>{sub?.first_name} {sub?.last_name}</div>
            <div style={{ fontSize:13, color:"#999" }}>{sub?.email}</div>
          </div>
          {sub?.status && (<span style={{ background:sub.status==="active"?"rgba(163,230,53,0.1)":"rgba(245,158,11,0.1)", color:sub.status==="active"?"#16a34a":"#f59e0b", fontSize:12, fontWeight:800, padding:"6px 14px", borderRadius:100, flexShrink:0 }}>{sub.status==="active"?"Activo":sub.status==="pending_payment"?"Pendiente":sub.status}</span>)}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(180px,100%),1fr))", gap:20 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#bbb", marginBottom:6, letterSpacing:1 }}>CÓDIGO DE IDENTIFICACIÓN</div>
            <div style={{ fontFamily:"monospace", fontSize:16, fontWeight:700, color:"#7c3aed", background:"rgba(124,58,237,0.06)", padding:"10px 14px", borderRadius:10 }}>{userId || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#bbb", marginBottom:6, letterSpacing:1 }}>TIPO DE DOCUMENTO</div>
            <div style={{ fontSize:15, fontWeight:600, padding:"10px 0" }}>{sub?.doc_type || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#bbb", marginBottom:6, letterSpacing:1 }}>N° DOCUMENTO</div>
            <div style={{ fontSize:15, fontWeight:600, padding:"10px 0" }}>{sub?.doc_number || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#bbb", marginBottom:6, letterSpacing:1 }}>CORREO ELECTRÓNICO</div>
            <div style={{ fontSize:15, fontWeight:600, padding:"10px 0" }}>{sub?.email || "—"}</div>
          </div>
        </div>
        <p style={{ fontSize:11, color:"#ccc", marginTop:12 }}>🔒 Esta información no se puede editar por seguridad</p>
      </div>

      {/* Editable info */}
      <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, padding:28, marginBottom:20 }}>
        <h3 style={{ fontSize:16, fontWeight:800, marginBottom:20 }}>Información de contacto</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))", gap:"0 20px" }}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#888", display:"block", marginBottom:6 }}>Nombres</label>
            <input className="field-edit" value={sub?.first_name || ""} disabled /><span style={{ fontSize:10, color:"#ccc" }}>No editable</span>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#888", display:"block", marginBottom:6 }}>Apellidos</label>
            <input className="field-edit" value={sub?.last_name || ""} disabled /><span style={{ fontSize:10, color:"#ccc" }}>No editable</span>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#888", display:"block", marginBottom:6 }}>Teléfono</label>
            <input className="field-edit" value={form.phone} onChange={e=>set("phone",e.target.value.replace(/\D/g,""))} disabled={!editing} maxLength={9} placeholder="987654321" />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#888", display:"block", marginBottom:6 }}>País</label>
            <input className="field-edit" value={form.country} onChange={e=>set("country",e.target.value)} disabled={!editing} />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#888", display:"block", marginBottom:6 }}>Ubicación (Departamento-Provincia-Distrito)</label>
            <input className="field-edit" value={form.district} onChange={e=>set("district",e.target.value)} disabled={!editing} placeholder="Lima-Lima-San Isidro" />
          </div>
        </div>
      </div>

      {/* Delete account */}
      <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:20, padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div style={{ flex:1, minWidth:200 }}>
            <h3 style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>Gestión de mi cuenta</h3>
            <p style={{ fontSize:13, color:"#999", lineHeight:1.6 }}>Eliminar tu cuenta implicará la pérdida permanente de todos los datos asociados a ella, incluyendo tu perfil y configuraciones. Además, perderás acceso a los servicios, funciones y beneficios que nuestra plataforma ofrece.</p>
          </div>
          {!showDelete ? (
            <button onClick={()=>setShowDelete(true)} style={{ background:"transparent", border:"2px solid #fca5a5", borderRadius:100, padding:"12px 28px", fontSize:13, fontWeight:800, color:"#ef4444", cursor:"pointer", flexShrink:0 }}>Eliminar Cuenta</button>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
              <p style={{ fontSize:12, color:"#ef4444", fontWeight:700 }}>¿Estás seguro? Esta acción es irreversible.</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowDelete(false)} style={{ background:"#f5f5f5", border:"none", borderRadius:100, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancelar</button>
                <button style={{ background:"#ef4444", color:"#fff", border:"none", borderRadius:100, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer" }}>Sí, eliminar mi cuenta</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}