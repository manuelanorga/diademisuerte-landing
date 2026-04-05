"use client";
import { useState, useEffect, useRef } from "react";

/* ── This Wednesday's specific prize ── */
const THIS_WEEK_PRIZE = { name: "iPhone 16 Pro", value: "S/ 5,199", emoji: "📱" };

const HERO_SLIDES = [
  { tag: "ESTE MIÉRCOLES 8PM", title: "SORTEO EN VIVO", highlight: "iPHONE 16 PRO", sub: "Por menos que un café a la semana, podrías ganarte un smartphone.", emoji: "📱" },
  { tag: "CADA MIÉRCOLES 8PM", title: "LLEVATE UNA", highlight: "PLAYSTATION 5", sub: "Solo S/2 por semana. ¿Cuánto cuesta el café que te tomas cada día?", emoji: "🎮" },
  { tag: "PREMIOS REALES CADA SEMANA", title: "GIFT CARDS DE", highlight: "S/1,900", sub: "Menos de S/0.30 al día te da acceso a premios que cambian tu semana.", emoji: "💳" },
  { tag: "GRAN SORTEO MENSUAL", title: "MACBOOK", highlight: "AIR M3", sub: "Una suscripción de S/8. Un premio de S/5,999. Las cuentas son claras.", emoji: "💻" },
];

const PRIZES = [
  { emoji: "📱", name: "iPhone 16 Pro", val: "S/ 5,199" },
  { emoji: "🎮", name: "PlayStation 5", val: "S/ 2,299" },
  { emoji: "⌚", name: "Apple Watch Ultra", val: "S/ 3,699" },
  { emoji: "🎧", name: "AirPods Max", val: "S/ 2,499" },
  { emoji: "💻", name: "MacBook Air M3", val: "S/ 5,999" },
  { emoji: "💳", name: "Gift Card S/1,900", val: "S/ 1,900" },
  { emoji: "📺", name: 'Smart TV 65"', val: "S/ 3,499" },
  { emoji: "🕹️", name: "Nintendo Switch", val: "S/ 1,499" },
  { emoji: "⌚", name: "Redmi Watch", val: "S/ 429" },
  { emoji: "📟", name: "Smartband Xiaomi", val: "S/ 189" },
  { emoji: "💸", name: "Yape S/100", val: "S/ 100" },
];

const WINNERS_GALLERY = [
  { bg:"#e8e0d4" },{ bg:"#d4dce8" },{ bg:"#d4e8d8" },{ bg:"#e0d4e8" },
  { bg:"#e8dcd4" },{ bg:"#d4e4e8" },{ bg:"#e8d4d4" },{ bg:"#d8d4e8" },
  { bg:"#e8e4d4" },{ bg:"#d4e8e0" },{ bg:"#e4d4e8" },{ bg:"#d4d8e8" },
];

const REELS = [
  { name: "Rosa M.", caption: "No lo puedo creer, gané un Nintendo Switch", bg: "#f0e6d4" },
  { name: "Juan C.", caption: "Me suscribí hace 2 semanas y ya gané", bg: "#d4e0f0" },
  { name: "María G.", caption: "Esto es 100% real, aquí está mi MacBook", bg: "#e6d4f0" },
  { name: "Carlos R.", caption: "Mejor inversión de S/8 de mi vida", bg: "#d4f0e0" },
];

const PLANS = [
  { id:"monthly", name:"Mensual", price:8, period:"mes", pricePerMonth:"8.00", highlight:"Chances normales", badge:null, save:null, benefits:["Suscripción activa = participas siempre","Premios semanales automáticos","Juega y gana chances extras","Cancela cuando quieras"] },
  { id:"quarterly", name:"Trimestral", price:21, period:"3 meses", pricePerMonth:"7.00", highlight:"Doble de chances", badge:"MÁS POPULAR", save:"Ahorras S/1 al mes", benefits:["Suscripción activa = participas siempre","Premios semanales automáticos","Juega y gana el DOBLE de chances","Cancela cuando quieras"] },
  { id:"biannual", name:"Semestral", price:39, period:"6 meses", pricePerMonth:"6.50", highlight:"Triple de chances", badge:"MEJOR VALOR", save:"Ahorras S/1.50 al mes", benefits:["Suscripción activa = participas siempre","Premios semanales automáticos","Juega y gana el TRIPLE de chances","Cancela cuando quieras"] },
];

const FAQS = [
  { q:"¿Los premios son reales?", a:"100% reales. Cada semana transmitimos los sorteos en vivo por Instagram. Puedes ver a los ganadores anteriores en nuestras redes con pruebas de entrega." },
  { q:"¿Cómo funcionan los sorteos?", a:"Cada miércoles a las 8PM hacemos un sorteo en vivo por Instagram Live. Todos los suscriptores activos participan automáticamente." },
  { q:"¿Puedo cancelar cuando quiera?", a:"Sí. Cancela cuando quieras sin penalidades. Sin contratos ni letra pequeña." },
  { q:"¿En qué países está disponible?", a:"Actualmente en Perú. Los premios se envían a tu dirección o se entregan en persona en Lima." },
  { q:"¿Necesito ver el live para ganar?", a:"No. Te contactamos directamente si ganas. Pero el live es parte de la diversión." },
  { q:"¿Cómo sé que el sorteo es transparente?", a:"Usamos un sistema aleatorio verificable y todo se transmite en vivo sin edición. Miles de personas lo ven cada semana." },
  { q:"¿El pago es seguro?", a:"Sí. Procesamos todos los pagos a través de Niubiz, la pasarela más grande y segura del Perú. Aceptamos Visa, Mastercard, Diners y American Express." },
];

const NOTIF_DATA = [
  { name:"Carlos", city:"Lima", time:"hace 3 min" },
  { name:"Juana", city:"Trujillo", time:"hace 12 min" },
  { name:"Miguel", city:"Arequipa", time:"hace 28 min" },
  { name:"Ana", city:"Cusco", time:"hace 1 hora" },
  { name:"Pedro", city:"Chiclayo", time:"hace 2 horas" },
  { name:"Lucía", city:"Piura", time:"hace 3 horas" },
  { name:"Diego", city:"Huancayo", time:"ayer" },
  { name:"Sofía", city:"Ica", time:"ayer" },
];

/* ── Components ── */
function Countdown() {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const next = () => { const n=new Date(),g=new Date(n); g.setHours(20,0,0,0); let d=(3-n.getDay()+7)%7; if(d===0&&n>=g)d=7; g.setDate(g.getDate()+d); return g; };
    const tick = () => { const df=Math.max(0,next().getTime()-new Date().getTime()); setT({d:Math.floor(df/864e5),h:Math.floor((df%864e5)/36e5),m:Math.floor((df%36e5)/6e4),s:Math.floor((df%6e4)/1e3)}); };
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id);
  }, []);
  return (
    <div style={{display:"flex",gap:6}}>
      {([["d","DÍAS"],["h","HRS"],["m","MIN"],["s","SEG"]] as const).map(([k,l])=>(
        <div key={k} className="cd-block" style={{background:"#111",borderRadius:12,padding:"10px 12px",minWidth:52,textAlign:"center"}}>
          <div className="cd-num" style={{fontFamily:"var(--heading)",fontSize:22,color:"#fff",lineHeight:1}}>{String(t[k]).padStart(2,"0")}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",letterSpacing:2,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function FadeIn({ children, delay=0 }: { children: React.ReactNode; delay?: number }) {
  const ref=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{ const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.1}); if(ref.current)obs.observe(ref.current); return()=>obs.disconnect(); },[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(36px)",transition:`all 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`}}>{children}</div>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={()=>setOpen(!open)} style={{background:open?"rgba(163,230,53,0.06)":"#f5f5f5",border:"1px solid",borderColor:open?"rgba(163,230,53,0.3)":"#eee",borderRadius:16,padding:"20px 24px",cursor:"pointer",marginBottom:10,transition:"all 0.3s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:16,color:"#111",flex:1,paddingRight:16}}>{q}</span>
        <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:open?"var(--lime)":"#eee",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",transform:open?"rotate(45deg)":"none"}}>
          <span style={{fontSize:20,fontWeight:300,color:open?"#000":"#888",lineHeight:1}}>+</span>
        </div>
      </div>
      <div style={{maxHeight:open?300:0,overflow:"hidden",transition:"max-height 0.4s ease"}}>
        <p style={{color:"#666",fontSize:15,lineHeight:1.7,marginTop:14,marginBottom:0}}>{a}</p>
      </div>
    </div>
  );
}

/* ── Floating notification ── */
function SocialProofToast() {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const loop = () => {
      setShow(true);
      setTimeout(() => { setShow(false); setTimeout(() => { setIdx(i => (i + 1) % NOTIF_DATA.length); loop(); }, 2000); }, 5000);
    };
    const initial = setTimeout(loop, 8000);
    return () => clearTimeout(initial);
  }, []);
  const n = NOTIF_DATA[idx];
  return (
    <div className="notif-toast" style={{
      position:"fixed", bottom:90, left:20, zIndex:80,
      background:"#fff", borderRadius:16, padding:"14px 20px",
      boxShadow:"0 8px 40px rgba(0,0,0,0.12)", border:"1px solid #eee",
      display:"flex", alignItems:"center", gap:12,
      transform: show ? "translateY(0)" : "translateY(120%)",
      opacity: show ? 1 : 0,
      transition: "all 0.5s cubic-bezier(.22,1,.36,1)",
      maxWidth: 320,
    }}>
      <div style={{width:36,height:36,borderRadius:"50%",background:"var(--lime)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#000",flexShrink:0}}>
        {n.name[0]}
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:"#111"}}>{n.name} de {n.city}</div>
        <div style={{fontSize:12,color:"#999"}}>se suscribió {n.time}</div>
      </div>
      <div style={{fontSize:10,color:"var(--lime-dark)",fontWeight:800,background:"rgba(163,230,53,0.1)",padding:"4px 8px",borderRadius:6,flexShrink:0}}>✓</div>
    </div>
  );
}

/* ── MAIN ── */
export default function Landing() {
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };
  const onTS = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const d = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) setSlide(s => d > 0 ? (s+1)%HERO_SLIDES.length : (s-1+HERO_SLIDES.length)%HERO_SLIDES.length);
    touchStart.current = null;
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth;overflow-x:hidden}
    :root{--lime:#a3e635;--lime-dark:#84cc16;--bg:#fafafa;--heading:'Anton',sans-serif;--body:'DM Sans',sans-serif;--mono:'DM Mono',monospace}
    body{font-family:var(--body);background:var(--bg);color:#111;overflow-x:hidden;-webkit-font-smoothing:antialiased}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(163,230,53,0.2)}50%{box-shadow:0 0 50px rgba(163,230,53,0.45)}}
    .cta-lime{background:var(--lime);color:#000;border:none;border-radius:100px;padding:16px 36px;font-size:16px;font-weight:800;cursor:pointer;font-family:var(--body);transition:all 0.3s}
    .cta-lime:hover{background:var(--lime-dark);transform:translateY(-2px);box-shadow:0 12px 40px rgba(163,230,53,0.3)}
    .cta-outline{background:transparent;color:#111;border:2px solid #ddd;border-radius:100px;padding:14px 32px;font-size:15px;font-weight:700;cursor:pointer;font-family:var(--body);transition:all 0.3s}
    .cta-outline:hover{border-color:#111}
    .section{padding:100px 20px;max-width:1100px;margin:0 auto}
    .slider-slide{position:absolute;inset:0;display:flex;align-items:center;padding:0 clamp(24px,5vw,80px);opacity:0;transition:opacity 0.7s ease;pointer-events:none}
    .slider-slide.active{opacity:1;pointer-events:auto}
    .slider-slide.active .s-inner{animation:sIn .8s cubic-bezier(.22,1,.36,1) forwards}
    @keyframes sIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    .desk-links{display:flex;gap:4px;align-items:center}
    .mob-toggle{display:none}
    .prizes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10}
    .winners-bento{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,140px);gap:8}
    .winners-bento>div:nth-child(1){grid-column:span 1;grid-row:span 2}
    .winners-bento>div:nth-child(4){grid-column:span 1;grid-row:span 2}
    .winners-bento>div:nth-child(7){grid-column:span 2}
    .reels-track{display:flex;gap:14;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:8px 20px}
    .reels-track::-webkit-scrollbar{display:none}

    /* Sticky mobile CTA */
    .sticky-cta{display:none}

    /* WhatsApp button */
    .wa-btn{position:fixed;bottom:20px;right:20px;z-index:80;width:56px;height:56px;border-radius:50%;background:#25D366;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,0.4);transition:all 0.3s;font-size:28}
    .wa-btn:hover{transform:scale(1.1);box-shadow:0 8px 30px rgba(37,211,102,0.5)}

    @media(max-width:900px){.desk-links{display:none!important}.mob-toggle{display:flex!important}}
    @media(max-width:768px){
      .section{padding:64px 16px}
      #hero{height:100dvh!important}
      .slider-slide{align-items:flex-start;padding:0 20px;padding-top:90px;padding-bottom:120px}
      .s-grid{flex-direction:column-reverse!important;text-align:center!important;gap:16px!important}
      .s-text{text-align:center!important}
      .s-text p{margin-left:auto!important;margin-right:auto!important}
      .s-ctas{justify-content:center!important;flex-direction:column!important}
      .s-feats{justify-content:center!important;gap:10px!important}
      .s-product>div:first-child{font-size:80px!important}
      .hero-arrow{display:none!important}
      .hero-bar{flex-direction:column!important;gap:12px!important;padding:12px 16px!important}
      .hero-stats{display:none!important}
      .cta-lime{padding:16px 28px;font-size:15px;width:100%;text-align:center}
      .cta-outline{padding:14px 24px;font-size:14px;width:100%;text-align:center}
      .prizes-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8}
      .winners-bento{grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,120px)}
      .winners-bento>div:nth-child(1),.winners-bento>div:nth-child(4){grid-row:span 1}
      .winners-bento>div:nth-child(7){grid-column:span 1}
      .sticky-cta{display:flex!important}
      .wa-btn{bottom:80px;right:16px;width:50px;height:50px;font-size:24px}
      .notif-toast{bottom:150px!important;left:12px!important;right:12px!important;max-width:none!important}
    }
    @media(max-width:640px){.plans-grid{grid-template-columns:1fr!important}}
    @media(max-width:480px){.winners-bento{grid-template-columns:repeat(2,1fr);grid-template-rows:auto}.prizes-grid{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:380px){.cd-block{padding:8px 6px!important;min-width:44px!important}.cd-num{font-size:18px!important}}
  `;

  return (
    <>
      <style>{css}</style>

      {/* ═══ FLOATING SOCIAL PROOF ═══ */}
      <SocialProofToast />

      {/* ═══ WHATSAPP BUTTON ═══ */}
      <a href="https://wa.me/51XXXXXXXXX?text=Hola%2C%20quiero%20información%20sobre%20Día%20de%20mi%20Suerte" target="_blank" rel="noopener noreferrer" className="wa-btn" aria-label="WhatsApp">
        💬
      </a>

      {/* ═══ STICKY MOBILE CTA ═══ */}
      <div className="sticky-cta" style={{
        position:"fixed",bottom:0,left:0,right:0,zIndex:70,
        background:"rgba(255,255,255,0.95)",backdropFilter:"blur(16px)",
        borderTop:"1px solid #eee",padding:"10px 16px",
        alignItems:"center",justifyContent:"space-between",gap:12,
        transform: showSticky ? "translateY(0)" : "translateY(100%)",
        transition:"transform 0.4s cubic-bezier(.22,1,.36,1)",
      }}>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#111"}}>Suscríbete desde S/8/mes</div>
          <div style={{fontSize:11,color:"#999"}}>Este miércoles: {THIS_WEEK_PRIZE.emoji} {THIS_WEEK_PRIZE.name}</div>
        </div>
        <button className="cta-lime" style={{padding:"12px 24px",fontSize:14,width:"auto",flexShrink:0}} onClick={()=>scrollTo("planes")}>
          Suscribirme →
        </button>
      </div>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",
        width:"calc(100% - 32px)",maxWidth:1100,zIndex:100,
        background:"rgba(250,250,250,0.75)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        border:"1px solid rgba(0,0,0,0.06)",borderRadius:100,
        padding:"0 6px 0 20px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <span style={{fontSize:20}}>🍀</span>
            <span style={{fontFamily:"var(--heading)",fontSize:18,letterSpacing:2,color:"#111"}}>DÍA DE MI SUERTE</span>
          </div>
          <div className="desk-links" style={{gap:2}}>
            {[["Inicio","hero"],["Premios","premios"],["Ganadores","ganadores"],["Suscripción","planes"]].map(([l,id])=>(
              <span key={id} onClick={()=>scrollTo(id)} style={{padding:"8px 14px",fontSize:13,fontWeight:600,color:"#666",cursor:"pointer",borderRadius:100,transition:"all 0.25s",whiteSpace:"nowrap"}}
                onMouseEnter={e=>{(e.target as HTMLElement).style.color="#111";(e.target as HTMLElement).style.background="rgba(0,0,0,0.04)"}}
                onMouseLeave={e=>{(e.target as HTMLElement).style.color="#666";(e.target as HTMLElement).style.background="transparent"}}
              >{l}</span>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button style={{background:"var(--lime)",border:"none",borderRadius:100,padding:"10px 20px",fontSize:13,fontWeight:800,color:"#000",cursor:"pointer",transition:"all 0.25s",fontFamily:"var(--body)",flexShrink:0}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--lime-dark)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--lime)"}
          >Iniciar sesión</button>
          <div className="mob-toggle" style={{cursor:"pointer",padding:8,flexDirection:"column",gap:0,marginLeft:4}} onClick={()=>setMenuOpen(!menuOpen)}>
            {menuOpen?(<><div style={{width:22,height:2,background:"#111",transform:"rotate(45deg) translate(4px,4px)",transition:"all 0.3s"}}/><div style={{width:22,height:2,background:"#111",opacity:0,marginTop:5}}/><div style={{width:22,height:2,background:"#111",transform:"rotate(-45deg) translate(4px,-4px)",transition:"all 0.3s"}}/></>):(<><div style={{width:22,height:2,background:"#111",marginBottom:5}}/><div style={{width:16,height:2,background:"#111",marginBottom:5,marginLeft:6}}/><div style={{width:10,height:2,background:"#111",marginLeft:12}}/></>)}
          </div>
        </div>
      </nav>
      {menuOpen&&(<div style={{position:"fixed",top:76,left:16,right:16,zIndex:99,background:"rgba(250,250,250,0.97)",backdropFilter:"blur(20px)",border:"1px solid rgba(0,0,0,0.06)",borderRadius:24,padding:"28px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        {[["Inicio","hero"],["Premios","premios"],["Ganadores","ganadores"],["Suscripción","planes"],["FAQ","faq"]].map(([l,id])=>(<span key={id} onClick={()=>scrollTo(id)} style={{fontSize:18,fontWeight:700,color:"#333",cursor:"pointer"}}>{l}</span>))}
      </div>)}

      {/* ═══ HERO SLIDER ═══ */}
      <section id="hero" onTouchStart={onTS} onTouchEnd={onTE} style={{minHeight:"100vh",height:"100vh",position:"relative",overflow:"hidden",background:"var(--bg)"}}>
        {HERO_SLIDES.map((s,i) => (
          <div key={i} className={`slider-slide ${slide===i?"active":""}`}>
            <div className="s-inner s-grid" style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",maxWidth:1100,margin:"0 auto",gap:"clamp(32px,6vw,80px)",flexWrap:"wrap"}}>
              <div className="s-text" style={{flex:"1 1 400px",minWidth:0}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#111",borderRadius:100,padding:"8px 18px",marginBottom:24}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:"var(--lime)"}}/>
                  <span style={{fontSize:12,fontWeight:700,color:"#fff",letterSpacing:2,fontFamily:"var(--mono)"}}>{s.tag}</span>
                </div>
                <h1 style={{fontFamily:"var(--heading)",fontSize:"clamp(48px,9vw,100px)",lineHeight:0.95,letterSpacing:1,color:"#111",marginBottom:16,textTransform:"uppercase"}}>
                  {s.title}<br/><span style={{color:"var(--lime)"}}>{s.highlight}</span>
                </h1>
                <p style={{fontFamily:"var(--mono)",fontSize:"clamp(14px,1.8vw,18px)",color:"#777",lineHeight:1.6,marginBottom:32,maxWidth:420}}>{s.sub}</p>
                <div className="s-ctas" style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:28}}>
                  <button className="cta-lime" onClick={()=>scrollTo("planes")}>Suscríbete desde S/8 →</button>
                  <button className="cta-outline" onClick={()=>scrollTo("premios")}>Ver premios</button>
                </div>
                <div className="s-feats" style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                  {[`🎯 Este miércoles: ${THIS_WEEK_PRIZE.name}`,"🔴 En vivo por IG","✌️ Sin contratos"].map((t,j)=>(<span key={j} style={{fontSize:13,color:"#999",fontWeight:500}}>{t}</span>))}
                </div>
              </div>
              <div className="s-product" style={{flex:"0 1 380px",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                {/* ▼ Replace with <img> or <video> ▼ */}
                <div style={{fontSize:"clamp(120px,22vw,240px)",lineHeight:1,animation:"float 4s ease-in-out infinite",filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.08))"}}>{s.emoji}</div>
                <div style={{position:"absolute",width:"70%",height:"70%",borderRadius:"50%",background:"radial-gradient(circle,rgba(163,230,53,0.15),transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
              </div>
            </div>
          </div>
        ))}
        {[{s:"left",d:-1,i:"‹"},{s:"right",d:1,i:"›"}].map(a=>(<button key={a.s} className="hero-arrow" onClick={()=>setSlide((slide+a.d+HERO_SLIDES.length)%HERO_SLIDES.length)} style={{position:"absolute",top:"50%",[a.s]:20,transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"#fff",border:"1px solid #eee",color:"#111",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",zIndex:10,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}} onMouseEnter={e=>{e.currentTarget.style.background="var(--lime)";e.currentTarget.style.borderColor="var(--lime)"}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor="#eee"}}>{a.i}</button>))}
        <div className="hero-bar" style={{position:"absolute",bottom:0,left:0,right:0,zIndex:10,borderTop:"1px solid rgba(0,0,0,0.04)",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:28,background:"rgba(250,250,250,0.85)",backdropFilter:"blur(12px)",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>{HERO_SLIDES.map((_,i)=>(<button key={i} onClick={()=>setSlide(i)} style={{width:slide===i?28:10,height:10,borderRadius:10,border:"none",cursor:"pointer",background:slide===i?"var(--lime)":"#ddd",transition:"all 0.4s"}}/>))}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:11,color:"#aaa",letterSpacing:2,fontFamily:"var(--mono)",whiteSpace:"nowrap"}}>SORTEOS TODOS LOS MIÉRCOLES</span>
            <Countdown/>
          </div>
          <a href="https://www.instagram.com/diademisuerte/" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"#fff",borderRadius:100,padding:"8px 18px",fontSize:12,fontWeight:800,textDecoration:"none",transition:"all 0.3s",flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><span style={{animation:"pulse 1.5s infinite"}}>🔴</span> Ver en IG Live</a>
          <div className="hero-stats" style={{display:"flex",gap:20}}>{[{n:"2,847+",l:"Suscriptores"},{n:"S/150K+",l:"En premios"}].map((s,i)=>(<div key={i} style={{textAlign:"center"}}><div style={{fontFamily:"var(--heading)",fontSize:18,color:"#111"}}>{s.n}</div><div style={{fontSize:9,color:"#aaa"}}>{s.l}</div></div>))}</div>
        </div>
      </section>

      {/* ═══ PREMIOS ═══ */}
      <section id="premios" className="section">
        <FadeIn><div style={{textAlign:"center",marginBottom:48}}>
          <span style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--lime-dark)",letterSpacing:4,fontWeight:700}}>PREMIOS REALES</span>
          <h2 style={{fontFamily:"var(--heading)",fontSize:"clamp(36px,7vw,64px)",letterSpacing:1,marginTop:8,lineHeight:1,textTransform:"uppercase"}}>ESTO PUEDES <span style={{color:"var(--lime-dark)"}}>GANAR</span></h2>
          <p style={{fontFamily:"var(--mono)",fontSize:13,color:"#999",marginTop:10}}>Este miércoles sorteamos: <strong style={{color:"#111"}}>{THIS_WEEK_PRIZE.emoji} {THIS_WEEK_PRIZE.name} ({THIS_WEEK_PRIZE.value})</strong></p>
        </div></FadeIn>
        <div className="prizes-grid">
          {PRIZES.map((p,i)=>(<FadeIn key={i} delay={i*40}><div style={{background:"#f5f5f5",borderRadius:16,padding:"20px 12px",textAlign:"center",border:"1px solid #eee",transition:"all 0.3s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--lime)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,0.06)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#eee";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}><div style={{fontSize:36,marginBottom:8,animation:`float ${3+i*.3}s ease-in-out infinite`}}>{p.emoji}</div><div style={{fontWeight:700,fontSize:11,lineHeight:1.3}}>{p.name}</div><div style={{color:"var(--lime-dark)",fontWeight:800,fontSize:14,fontFamily:"var(--heading)",letterSpacing:1,marginTop:4}}>{p.val}</div></div></FadeIn>))}
        </div>
        <FadeIn delay={300}><div style={{textAlign:"center",marginTop:36}}><p style={{fontSize:17,fontWeight:800}}>🏆 Más de <span style={{color:"var(--lime-dark)",fontFamily:"var(--heading)",fontSize:22}}>S/ 150,000</span> en premios entregados</p></div></FadeIn>
      </section>

      {/* ═══ GANADORES ═══ */}
      <section id="ganadores" style={{padding:"80px 20px",background:"#f0f0f0"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}><FadeIn>
          <div style={{background:"#fff",borderRadius:28,border:"1px solid #eee",padding:"clamp(20px,4vw,40px)",overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <span style={{fontSize:28}}>👑</span>
              <div><h2 style={{fontFamily:"var(--heading)",fontSize:"clamp(24px,5vw,36px)",color:"#111",letterSpacing:1,lineHeight:1}}>Ellos Ya Ganaron</h2><p style={{fontFamily:"var(--mono)",fontSize:13,color:"#999",marginTop:4}}>El próximo puedes ser tú...</p></div>
            </div>
            <div className="winners-bento">{WINNERS_GALLERY.map((w,i)=>(<div key={i} style={{borderRadius:14,overflow:"hidden",background:w.bg,minHeight:0}}>{/* <img src={`/winners/${i+1}.jpg`} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/> */}<div style={{width:"100%",height:"100%",background:`linear-gradient(135deg,${w.bg},${w.bg}cc)`}}/></div>))}</div>
            <div style={{textAlign:"center",marginTop:24}}><button className="cta-lime" style={{fontSize:15,padding:"14px 36px"}}>Ver más ganadores →</button></div>
          </div>
        </FadeIn></div>
      </section>

      {/* ═══ TESTIMONIOS VIDEO (REELS) ═══ */}
      <section style={{padding:"80px 0",background:"var(--bg)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:40}}>
            <span style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--lime-dark)",letterSpacing:4,fontWeight:700}}>TESTIMONIOS</span>
            <h2 style={{fontFamily:"var(--heading)",fontSize:"clamp(32px,6vw,52px)",letterSpacing:1,marginTop:8,lineHeight:1,textTransform:"uppercase"}}>ESCUCHA A NUESTROS <span style={{color:"var(--lime-dark)"}}>GANADORES</span></h2>
          </div></FadeIn>
        </div>
        <div className="reels-track" style={{gap:14}}>
          {REELS.map((r,i)=>(
            <div key={i} style={{
              scrollSnapAlign:"start",flex:"0 0 220px",height:380,borderRadius:20,
              overflow:"hidden",position:"relative",background:r.bg,cursor:"pointer",
              transition:"transform 0.3s",
            }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            >
              {/* ▼ Replace with real reel video ▼ */}
              {/* <video src={`/reels/reel-${i+1}.mp4`} autoPlay muted loop playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/> */}
              <div style={{width:"100%",height:"100%",background:`linear-gradient(180deg,${r.bg},${r.bg}88)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:12}}>▶</div>
                <div style={{fontWeight:800,fontSize:14,color:"#333"}}>{r.name}</div>
                <p style={{fontSize:12,color:"#666",textAlign:"center",marginTop:8,lineHeight:1.5,fontStyle:"italic"}}>"{r.caption}"</p>
              </div>
              {/* Play button overlay */}
              <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#fff"}}>REEL</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PLANES ═══ */}
      <section id="planes" style={{padding:"100px 20px",background:"#111"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:56}}>
            <span style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--lime)",letterSpacing:4,fontWeight:700}}>SUSCRIPCIÓN</span>
            <h2 style={{fontFamily:"var(--heading)",fontSize:"clamp(32px,6vw,56px)",letterSpacing:1,marginTop:8,lineHeight:1,color:"#fff",textTransform:"uppercase"}}>ELIGE TU <span style={{color:"var(--lime)"}}>PLAN</span></h2>
            <p style={{color:"rgba(255,255,255,0.4)",marginTop:10,fontSize:15}}>Sin contratos. Cancela cuando quieras.</p>
          </div></FadeIn>
          <div className="plans-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
            {PLANS.map((plan,i)=>(<FadeIn key={plan.id} delay={i*100}><div style={{background:plan.badge==="MÁS POPULAR"?"rgba(163,230,53,0.06)":"rgba(255,255,255,0.03)",border:plan.badge==="MÁS POPULAR"?"2px solid var(--lime)":"1px solid rgba(255,255,255,0.08)",borderRadius:24,padding:"36px 28px",textAlign:"center",position:"relative",transition:"all 0.3s",animation:plan.badge==="MÁS POPULAR"?"glow 3s ease-in-out infinite":"none"}}>
              {plan.badge&&(<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"var(--lime)",color:"#000",fontSize:11,fontWeight:800,padding:"6px 18px",borderRadius:100,letterSpacing:2,whiteSpace:"nowrap"}}>{plan.badge}</div>)}
              <h3 style={{fontFamily:"var(--heading)",fontSize:28,letterSpacing:2,color:"#fff",marginTop:plan.badge?8:0}}>{plan.name.toUpperCase()}</h3>
              <div style={{margin:"20px 0 4px"}}><span style={{fontFamily:"var(--heading)",fontSize:60,color:"#fff"}}>S/{plan.price}</span><span style={{color:"rgba(255,255,255,0.35)",fontSize:14}}>/{plan.period}</span></div>
              {plan.save?(<div style={{marginBottom:20}}><span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Solo S/{plan.pricePerMonth}/mes · </span><span style={{fontSize:13,color:"var(--lime)",fontWeight:700}}>{plan.save}</span></div>):(<div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:20}}>S/{plan.pricePerMonth}/mes</div>)}
              <div style={{display:"inline-block",background:plan.id!=="monthly"?"rgba(163,230,53,0.15)":"rgba(255,255,255,0.06)",border:"1px solid",borderColor:plan.id!=="monthly"?"rgba(163,230,53,0.25)":"rgba(255,255,255,0.08)",borderRadius:100,padding:"8px 20px",marginBottom:24,fontSize:13,fontWeight:700,color:plan.id!=="monthly"?"var(--lime)":"rgba(255,255,255,0.5)"}}>{plan.id==="monthly"?"🎯":"🔥"} {plan.highlight}</div>
              <div style={{textAlign:"left",marginBottom:24}}>{plan.benefits.map((b,j)=>(<div key={j} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}><span style={{color:"var(--lime)",fontSize:14,marginTop:2,flexShrink:0}}>✓</span><span style={{fontSize:14,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{b}</span></div>))}</div>
              {/* onClick → navigate to registration */}
              <button className="cta-lime" style={{width:"100%",padding:"16px 0"}} onClick={()=>window.location.href=`/registro?plan=${plan.id}`}>{plan.badge==="MÁS POPULAR"?"¡EMPEZAR AHORA!":"ELEGIR PLAN"}</button>
            </div></FadeIn>))}
          </div>
        </div>
      </section>

      {/* ═══ GARANTÍA NIUBIZ ═══ */}
      <section style={{padding:"60px 20px",background:"var(--bg)"}}>
        <FadeIn>
          <div style={{maxWidth:800,margin:"0 auto",textAlign:"center",padding:"40px clamp(20px,4vw,48px)",background:"#fff",border:"1px solid #eee",borderRadius:24,boxShadow:"0 4px 30px rgba(0,0,0,0.03)"}}>
            <div style={{fontSize:40,marginBottom:12}}>🔒</div>
            <h3 style={{fontFamily:"var(--heading)",fontSize:"clamp(22px,4vw,32px)",letterSpacing:1,marginBottom:8}}>TU PAGO ES 100% SEGURO</h3>
            <p style={{fontSize:15,color:"#777",lineHeight:1.7,maxWidth:520,margin:"0 auto 20px"}}>
              Todos los pagos son procesados por <strong style={{color:"#111"}}>Niubiz</strong>, la pasarela de pagos más grande y segura del Perú. Tu información está protegida con encriptación de nivel bancario.
            </p>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",alignItems:"center"}}>
              {["VISA","MC","AMEX","DINERS"].map(c=>(<div key={c} style={{background:"#f5f5f5",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:800,color:"#888",letterSpacing:1}}>{c}</div>))}
            </div>
            <p style={{fontSize:12,color:"#bbb",marginTop:16}}>PCI DSS Compliant · Encriptación SSL · Niubiz™</p>
          </div>
        </FadeIn>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="section">
        <FadeIn><div style={{textAlign:"center",marginBottom:48}}>
          <span style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--lime-dark)",letterSpacing:4,fontWeight:700}}>FAQ</span>
          <h2 style={{fontFamily:"var(--heading)",fontSize:"clamp(32px,6vw,56px)",letterSpacing:1,marginTop:8,lineHeight:1,textTransform:"uppercase"}}>PREGUNTAS <span style={{color:"var(--lime-dark)"}}>FRECUENTES</span></h2>
        </div></FadeIn>
        <FadeIn delay={100}><div style={{maxWidth:680,margin:"0 auto"}}>{FAQS.map((f,i)=><FAQItem key={i} q={f.q} a={f.a}/>)}</div></FadeIn>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section style={{padding:"100px 20px",background:"#111",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"60vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(163,230,53,0.06),transparent 60%)",filter:"blur(80px)",pointerEvents:"none"}}/>
        <FadeIn><div style={{maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative",zIndex:2}}>
          <h2 style={{fontFamily:"var(--heading)",fontSize:"clamp(36px,8vw,72px)",lineHeight:0.95,letterSpacing:2,color:"#fff",textTransform:"uppercase"}}>EL PRÓXIMO<br/>GANADOR<br/><span style={{color:"var(--lime)"}}>PODRÍAS SER TÚ</span></h2>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:16,marginTop:16,marginBottom:36}}>Este miércoles sorteamos un {THIS_WEEK_PRIZE.emoji} {THIS_WEEK_PRIZE.name}. No te quedes fuera.</p>
          <button className="cta-lime" style={{fontSize:18,padding:"20px 52px"}} onClick={()=>scrollTo("planes")}>¡QUIERO PARTICIPAR! 🍀</button>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.2)",marginTop:16}}>Sin compromisos · Cancela cuando quieras · Pagos seguros con Niubiz</p>
        </div></FadeIn>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{background:"#111",padding:"60px 20px 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))",gap:"40px 32px",paddingBottom:40}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><span style={{fontSize:24}}>🍀</span><span style={{fontFamily:"var(--heading)",fontSize:26,letterSpacing:2,color:"#fff",lineHeight:1}}>DÍA DE MI<br/>SUERTE</span></div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>La plataforma de sorteos semanales donde tu suscripción te da la chance de ganar premios increíbles.</p>
            </div>
            <div>{["Términos y condiciones","Política de privacidad","Reglamento","Preguntas Frecuentes"].map(l=>(<p key={l} onClick={()=>l==="Preguntas Frecuentes"&&scrollTo("faq")} style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:12,cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>(e.target as HTMLElement).style.color="#fff"} onMouseLeave={e=>(e.target as HTMLElement).style.color="rgba(255,255,255,0.5)"}>{l}</p>))}</div>
            <div>
              <h4 style={{fontSize:14,fontWeight:700,color:"#d4a017",marginBottom:14}}>¿Necesitas ayuda?</h4>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:6}}>Envíanos un correo electrónico a:</p>
              <a href="mailto:soporte@amsinnova.com" style={{fontSize:14,color:"#fff",fontWeight:600,textDecoration:"none",display:"block",marginBottom:16}}>soporte@amsinnova.com</a>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>Horario de atención:<br/>Lunes a viernes de 9:00am a 6:00pm</p>
            </div>
            <div>
              <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 18px",marginBottom:14,display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}>
                <span style={{fontSize:24}}>📖</span><div><div style={{fontSize:12,fontWeight:800,color:"#fff",letterSpacing:1}}>LIBRO DE</div><div style={{fontSize:12,fontWeight:800,color:"#fff",letterSpacing:1}}>RECLAMACIONES</div></div>
              </div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:4}}>RUC: <span style={{color:"rgba(255,255,255,0.6)",fontWeight:600}}>20612907219</span></p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>AMS INNOVA S.A.C</p>
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>© diademisuerte.com 2026</p>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {[{l:"IG",h:"https://www.instagram.com/diademisuerte/"},{l:"TT",h:"https://www.tiktok.com/@diademisuerte"}].map(s=>(<a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer" style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)",textDecoration:"none",transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.background="var(--lime)";e.currentTarget.style.color="#000";e.currentTarget.style.borderColor="var(--lime)"}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.color="rgba(255,255,255,0.5)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}}>{s.l}</a>))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
