"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Inicio", path: "/mi-cuenta", icon: "🏠" },
  { label: "Mi Perfil", path: "/mi-cuenta/perfil", icon: "👤" },
  { label: "Mi Suscripción", path: "/mi-cuenta/suscripcion", icon: "💳" },
  { label: "Mis Códigos", path: "/mi-cuenta/codigos", icon: "🎰" },
  { label: "Mis Recibos", path: "/mi-cuenta/recibos", icon: "🧾" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [sub, setSub] = useState<{ first_name?: string; last_name?: string } | null>(null);
  const [mobMenu, setMobMenu] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      const { data: s } = await supabase.from("subscribers").select("first_name, last_name").eq("id", data.user.id).single();
      setSub(s);
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',sans-serif;background:#fafafa;color:#111}
    .dash{display:flex;min-height:100vh}
    .dash-side{width:240px;background:#111;color:#fff;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:40}
    .dash-main{flex:1;margin-left:240px;min-height:100vh}
    .dash-topbar{display:none}
    .dash-overlay{display:none}

    @media(max-width:768px){
      .dash-side{transform:translateX(-100%);transition:transform 0.3s cubic-bezier(.22,1,.36,1);width:280px}
      .dash-side.open{transform:translateX(0)}
      .dash-main{margin-left:0}
      .dash-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid #eee;position:sticky;top:0;background:#fafafa;z-index:30}
      .dash-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:35}
      .dash-overlay.open{display:block}
    }
  `;

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <style>{css}</style>
      <div className="dash">
        {/* ── SIDEBAR ── */}
        <aside className={`dash-side ${mobMenu ? "open" : ""}`}>
          {/* Logo */}
          <div style={{padding:"24px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
              <span style={{fontSize:20}}>🍀</span>
              <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,letterSpacing:2,color:"#fff"}}>DÍA DE MI SUERTE</span>
            </a>
          </div>

          {/* Nav items */}
          <nav style={{flex:1,padding:"16px 12px"}}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.path}
                onClick={() => { router.push(item.path); setMobMenu(false); }}
                style={{
                  display:"flex",alignItems:"center",gap:12,width:"100%",
                  padding:"14px 16px",marginBottom:4,borderRadius:12,border:"none",
                  cursor:"pointer",transition:"all 0.2s",textAlign:"left",
                  fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,
                  background: isActive(item.path) ? "#a3e635" : "transparent",
                  color: isActive(item.path) ? "#000" : "rgba(255,255,255,0.5)",
                }}
              >
                <span style={{fontSize:18}}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User info + logout */}
          <div style={{padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"#a3e635",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#000"}}>
                {sub?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {sub?.first_name ? `${sub.first_name} ${sub.last_name || ""}` : user?.email}
                </div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              width:"100%",padding:"10px",fontSize:13,fontWeight:600,
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10,color:"rgba(255,255,255,0.4)",cursor:"pointer",transition:"all 0.2s",
            }}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobMenu && <div className="dash-overlay open" onClick={() => setMobMenu(false)} />}

        {/* ── MAIN ── */}
        <main className="dash-main">
          {/* Mobile topbar */}
          <div className="dash-topbar">
            <button onClick={() => setMobMenu(true)} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",flexDirection:"column",gap:4}}>
              <div style={{width:20,height:2,background:"#111"}} />
              <div style={{width:15,height:2,background:"#111",marginLeft:5}} />
              <div style={{width:10,height:2,background:"#111",marginLeft:10}} />
            </button>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:16}}>🍀</span>
              <span style={{fontFamily:"'Anton',sans-serif",fontSize:14,letterSpacing:2}}>DÍA DE MI SUERTE</span>
            </div>
            <div style={{width:28}} />
          </div>

          {/* Page content */}
          <div style={{padding:"clamp(20px,4vw,40px)"}}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
