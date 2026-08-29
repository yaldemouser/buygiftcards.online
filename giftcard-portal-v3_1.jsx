import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   BRAND DATA — logos via logo.dev
   ═══════════════════════════════════════════════════ */
const LOGO_DEV_TOKEN = "pk_ZgHE90OORwOmSiIo_lnp_A";
const logo = d => `https://img.logo.dev/${d}?token=${LOGO_DEV_TOKEN}&size=128&retina=true`;
const BRANDS = [
  {id:1,name:"Visa Virtual Account",slug:"visa",cat:"Visa®",tags:["visa"],type:"both",logo:logo("visa.com"),color:"#1a1f71",badge:"BEST SELLER",min:10,max:250,fixed:[25,50,100,150,200,250],desc:"Use anywhere Visa debit cards are accepted in the US. Shop online or in stores with the freedom to choose."},
  {id:2,name:"Mastercard Virtual Account",slug:"mastercard",cat:"Mastercard®",tags:["mastercard"],type:"both",logo:logo("mastercard.com"),color:"#eb001b",min:10,max:250,fixed:[25,50,100,150,200,250],desc:"Accepted worldwide wherever Mastercard debit is accepted. The perfect gift for any occasion."},
  {id:3,name:"Amazon",slug:"amazon",cat:"Shopping",tags:["shopping","egift"],type:"egift",logo:logo("amazon.com"),color:"#ff9900",min:15,max:500,fixed:[25,50,100,200,500],desc:"The iconic everything store. Let them choose from millions of items on Amazon.com."},
  {id:4,name:"Starbucks",slug:"starbucks",cat:"Food & Drink",tags:["food","popular"],type:"both",logo:logo("starbucks.com"),color:"#00704a",min:10,max:100,fixed:[10,15,25,50,100],desc:"Fuel their coffee obsession. Redeemable at any participating US Starbucks location or via the app."},
  {id:5,name:"Apple",slug:"apple",cat:"Tech",tags:["tech","egift","popular"],type:"egift",logo:logo("apple.com"),color:"#333",min:25,max:500,fixed:[25,50,100,200],desc:"For everything Apple — App Store, Apple Music, iCloud+, Apple TV+, accessories, and more."},
  {id:6,name:"DoorDash",slug:"doordash",cat:"Food & Drink",tags:["food","delivery","egift"],type:"egift",logo:logo("doordash.com"),color:"#ff3008",min:15,max:500,fixed:[20,50,100],desc:"Restaurants and more, delivered to their door. Gift the joy of not cooking tonight."},
  {id:7,name:"Nike",slug:"nike",cat:"Fashion",tags:["fashion","sports"],type:"both",logo:logo("nike.com"),color:"#111",min:25,max:250,fixed:[25,50,100,150,250],desc:"For the athlete in everyone. Redeemable at Nike stores, Nike.com, and the Nike app."},
  {id:8,name:"Netflix",slug:"netflix",cat:"Entertainment",tags:["entertainment","streaming","egift"],type:"egift",logo:logo("netflix.com"),color:"#e50914",min:25,max:200,fixed:[25,50,100],desc:"Give the gift of endless entertainment. Apply to any Netflix subscription plan."},
  {id:9,name:"Target",slug:"target",cat:"Shopping",tags:["shopping","popular"],type:"both",logo:logo("target.com"),color:"#cc0000",min:10,max:500,fixed:[25,50,75,100,200],desc:"Expect more, pay less. Redeemable at any Target store nationwide or on Target.com."},
  {id:10,name:"Uber",slug:"uber",cat:"Travel",tags:["travel","delivery"],type:"egift",logo:logo("uber.com"),color:"#000",min:15,max:200,fixed:[15,25,50,100],desc:"For rides and Uber Eats. The perfect gift for getting around or staying in."},
  {id:11,name:"Steam",slug:"steam",cat:"Gaming",tags:["gaming","egift"],type:"egift",logo:logo("store.steampowered.com"),color:"#1b2838",min:10,max:100,fixed:[10,20,50,100],desc:"For gamers. Redeemable on Steam for thousands of games, DLC, and in-game items."},
  {id:12,name:"Spotify",slug:"spotify",cat:"Entertainment",tags:["entertainment","music","egift"],type:"egift",logo:logo("spotify.com"),color:"#1db954",min:10,max:60,fixed:[10,30,60],desc:"Give the gift of music. Apply to Spotify Premium — ad-free music, podcasts, and more."},
  {id:13,name:"Chipotle",slug:"chipotle",cat:"Food & Drink",tags:["food","popular"],type:"both",logo:logo("chipotle.com"),color:"#441500",min:10,max:250,fixed:[10,25,50,100],desc:"Burritos, bowls, tacos, and salads made from fresh, high-quality ingredients with real flavor."},
  {id:14,name:"Airbnb",slug:"airbnb",cat:"Travel",tags:["travel","egift"],type:"egift",logo:logo("airbnb.com"),color:"#ff5a5f",min:25,max:500,fixed:[25,50,100,200,500],desc:"For the traveler. Redeemable for stays and experiences worldwide on Airbnb."},
  {id:15,name:"Walmart",slug:"walmart",cat:"Shopping",tags:["shopping"],type:"both",logo:logo("walmart.com"),color:"#0071ce",min:10,max:500,fixed:[25,50,100,200],desc:"Save money. Live better. Redeemable at any Walmart store or on Walmart.com."},
  {id:16,name:"Home Depot",slug:"homedepot",cat:"Home",tags:["home"],type:"both",logo:logo("homedepot.com"),color:"#f96302",min:25,max:500,fixed:[25,50,100,200,500],desc:"For the DIY enthusiast. Tools, materials, and more at Home Depot stores or homedepot.com."},
  {id:17,name:"Sephora",slug:"sephora",cat:"Fashion",tags:["fashion","beauty","egift"],type:"egift",logo:logo("sephora.com"),color:"#000",min:10,max:250,fixed:[25,50,100,250],desc:"For the beauty lover. Prestige cosmetics, skincare, fragrance, and hair care."},
  {id:18,name:"Panera Bread",slug:"panera",cat:"Food & Drink",tags:["food"],type:"both",logo:logo("panerabread.com"),color:"#4e7c32",min:10,max:200,fixed:[15,25,50,100],desc:"Fresh-baked breads, soups, salads, and sandwiches. Clean ingredients, great taste."},
  {id:19,name:"Xbox",slug:"xbox",cat:"Gaming",tags:["gaming","egift"],type:"egift",logo:logo("xbox.com"),color:"#107c10",min:10,max:100,fixed:[10,25,50,100],desc:"For gamers. Games, add-ons, devices, and more from the Microsoft Store and Xbox."},
  {id:20,name:"IKEA",slug:"ikea",cat:"Home",tags:["home","egift"],type:"egift",logo:logo("ikea.com"),color:"#0058a3",min:10,max:500,fixed:[25,50,100,250,500],desc:"Affordable modern home furnishing. Redeemable at any US IKEA store or IKEA.com."},
  {id:21,name:"Uber Eats",slug:"ubereats",cat:"Food & Drink",tags:["food","delivery","egift"],type:"egift",logo:logo("ubereats.com"),color:"#06c167",min:15,max:200,fixed:[15,25,50,100],desc:"Food delivery from their favorite local restaurants, right to their door."},
  {id:22,name:"Google Play",slug:"googleplay",cat:"Tech",tags:["tech","gaming","egift"],type:"egift",logo:logo("play.google.com"),color:"#4285f4",min:10,max:200,fixed:[10,25,50,100],desc:"Apps, games, music, movies, books, and more from the Google Play Store."},
  {id:23,name:"Lowe's",slug:"lowes",cat:"Home",tags:["home"],type:"both",logo:logo("lowes.com"),color:"#004990",min:25,max:500,fixed:[25,50,100,200,500],desc:"Home improvement made easy. Tools, appliances, flooring, paint, and more."},
  {id:24,name:"Adidas",slug:"adidas",cat:"Fashion",tags:["fashion","sports"],type:"egift",logo:logo("adidas.com"),color:"#000",min:25,max:250,fixed:[25,50,100,250],desc:"Sport-inspired lifestyle. Shoes, clothing, and accessories at adidas.com or stores."},
];

const CATEGORIES = [...new Set(BRANDS.map(b=>b.cat))].sort();
const NAV_CATS = ["Visa®","Mastercard®","eGift","Physical","All Brands","Categories","Deals","Business"];
const OCCASIONS = [
  {name:"Birthday",icon:"🎂",count:288},{name:"Thank You",icon:"💌",count:150},{name:"New Home",icon:"🏡",count:35},
  {name:"Anniversary",icon:"💍",count:150},{name:"New Baby",icon:"👶",count:29},{name:"Wedding",icon:"💒",count:149},
  {name:"Travel",icon:"✈️",count:101},{name:"Graduation",icon:"🎓",count:88},
];
const PROMOS = [
  {title:"Visa Savings",sub:"Get a FREE $10 Gift Card OR pay NO FEES on a $100 Visa Virtual Account.",cta:"Shop Now",gradient:"linear-gradient(135deg,#1a1f71 0%,#4a52c9 50%,#7c3aed 100%)",brandId:1},
  {title:"Today's Deal — 10% Off",sub:"Save on Chipotle Gift Cards today with code DAILYDEAL at checkout.",cta:"Shop Deal",gradient:"linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#c084fc 100%)",brandId:13},
  {title:"Summer's Last Hurrah",sub:"Celebrate the season with 10% off select gift cards. Limited time offer.",cta:"Shop Sale",gradient:"linear-gradient(135deg,#0369a1 0%,#0ea5e9 50%,#38bdf8 100%)"},
  {title:"Smart Savings",sub:"Save 5% on the Thank You Visa Gift Card with code ECO5.",cta:"Shop Now",gradient:"linear-gradient(135deg,#065f46 0%,#059669 50%,#34d399 100%)",brandId:1},
];

const fmt = n => "$"+Number(n).toFixed(2);
const genCode = () => {let s="";for(let i=0;i<16;i++){s+=Math.floor(Math.random()*10);}return s.replace(/(.{4})/g,"$1 ").trim();};
const genPin = () => String(Math.floor(10000000+Math.random()*90000000));
const genOrder = () => "GC-"+new Date().toISOString().slice(0,10).replace(/-/g,"")+"-"+String(Math.floor(Math.random()*99999)).padStart(5,"0");

/* ═══════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [brand, setBrand] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [catFilter, setCatFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [promoIdx, setPromoIdx] = useState(0);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState({});

  const cartN = cart.reduce((s,i)=>s+i.qty,0);
  const cartT = cart.reduce((s,i)=>s+i.price*i.qty,0);

  useEffect(()=>{const t=setInterval(()=>setPromoIdx(i=>(i+1)%PROMOS.length),6000);return()=>clearInterval(t);},[]);

  const go = (p,b) => {setPage(p);setBrand(b||null);window.scrollTo(0,0);};
  const goHome = ()=>go("home");
  const goCat = c=>{setCatFilter(c);go("catalog");};
  const addCart = (b,d,q,dt) => {
    setCart(prev=>{
      const k=`${b.id}-${d}-${dt}`;
      const i=prev.findIndex(x=>x.key===k);
      if(i>=0){const u=[...prev];u[i]={...u[i],qty:Math.min(u[i].qty+q,10)};return u;}
      return[...prev,{key:k,bid:b.id,name:b.name,logo:b.logo,denom:d,price:d,qty:q,dt}];
    });
    setCartOpen(true);
  };
  const checkout = () => {
    const items=cart.map((c,i)=>({id:Date.now()+i,name:c.name,denom:c.denom,qty:c.qty,dt:c.dt,
      codes:Array.from({length:c.qty},(_,j)=>({id:Date.now()+i*100+j,code:genCode(),pin:genPin()}))}));
    const o={id:Date.now(),num:genOrder(),total:cartT,items,date:new Date().toISOString(),status:"Delivered"};
    setOrders(p=>[o,...p]);setCart([]);setCartOpen(false);setOrder(o);go("orderDetail");
  };
  const copy = t=>{navigator.clipboard?.writeText(t);setCopied(true);setTimeout(()=>setCopied(false),1500);};

  const filtered = BRANDS.filter(b=>{
    if(search) return b.name.toLowerCase().includes(search.toLowerCase())||b.cat.toLowerCase().includes(search.toLowerCase());
    if(!catFilter) return true;
    if(catFilter==="eGift") return b.type!=="physical";
    if(catFilter==="Physical") return b.type==="both"||b.type==="physical";
    if(catFilter==="All Brands"||catFilter==="Categories"||catFilter==="Deals"||catFilter==="Business") return true;
    return b.cat===catFilter;
  });

  const BrandLogo = ({src,name,size=40,radius=10,bg="#f5f3f7"}) => (
    imgErr[src]
      ? <div style={{width:size,height:size,borderRadius:radius,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,fontWeight:800,color:"#7c3aed",flexShrink:0}}>{name?.charAt(0)}</div>
      : <img src={src} alt={name} style={{width:size,height:size,borderRadius:radius,objectFit:"contain",background:bg,padding:size>50?8:4,flexShrink:0}} onError={()=>setImgErr(p=>({...p,[src]:true}))} />
  );

  /* ─── UTILITY BAR ─── */
  const UtilBar = () => (
    <div style={{background:"#1a1025",fontSize:12,fontWeight:500,color:"#b8afc6"}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:"7px 28px",display:"flex",justifyContent:"flex-end",gap:4,flexWrap:"wrap"}}>
        {[["Track Order","trackOrder"],["Activate Card","activate"],["Check Balance","balance"],["Support","support"]].map(([l,p],i)=>(
          <span key={p}><span onClick={()=>go(p)} style={{cursor:"pointer",padding:"3px 10px",borderRadius:4,transition:"0.15s"}} onMouseOver={e=>e.target.style.color="#fff"} onMouseOut={e=>e.target.style.color="#b8afc6"}>{l.toUpperCase()}</span>{i<3&&<span style={{color:"#3d3252",margin:"0 2px"}}>|</span>}</span>
        ))}
      </div>
    </div>
  );

  /* ─── MAIN NAV ─── */
  const Nav = () => (
    <div style={{background:"#fff",borderBottom:"1px solid #eae6f0",position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:"0 28px"}}>
        <div style={{display:"flex",alignItems:"center",height:68,gap:24}}>
          <div onClick={goHome} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:19,fontWeight:900}}>G</div>
            <div style={{fontSize:19,fontWeight:800,color:"#1a1025",letterSpacing:"-0.3px"}}>giftcards<span style={{color:"#7c3aed"}}>.com</span></div>
          </div>
          <div style={{flex:1,maxWidth:520,position:"relative"}}>
            <input placeholder="Search 450+ gift card brands..." value={search}
              onChange={e=>{setSearch(e.target.value);if(e.target.value&&page!=="catalog")go("catalog");}}
              style={{width:"100%",padding:"11px 18px 11px 44px",border:"2px solid #eae6f0",borderRadius:32,fontSize:14,background:"#faf9fb",outline:"none",fontFamily:"inherit",transition:"0.2s"}}
              onFocus={e=>e.target.style.borderColor="#7c3aed"} onBlur={e=>e.target.style.borderColor="#eae6f0"} />
            <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:17,color:"#a09aab"}}>🔍</span>
            {search&&<button onClick={()=>{setSearch("");if(page==="catalog")goHome();}} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",border:"none",background:"none",fontSize:16,cursor:"pointer",color:"#a09aab"}}>✕</button>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={()=>go("orders")} style={{padding:"9px 16px",border:"none",borderRadius:10,background:"transparent",fontSize:13,fontWeight:600,cursor:"pointer",color:"#5a5068",fontFamily:"inherit"}}>My Orders</button>
            <button style={{padding:"9px 16px",border:"1.5px solid #eae6f0",borderRadius:10,background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",color:"#1a1025",fontFamily:"inherit"}}>Sign In</button>
            <button onClick={()=>setCartOpen(true)} style={{padding:"9px 16px",border:"none",borderRadius:10,background:cartN>0?"#7c3aed":"transparent",color:cartN>0?"#fff":"#5a5068",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",position:"relative",transition:"0.2s"}}>
              🛒 {cartN>0?`Cart (${cartN})`:"Cart"}
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto",marginTop:-1}}>
          {NAV_CATS.map(c=>(
            <button key={c} onClick={()=>goCat(c)} style={{padding:"13px 20px",border:"none",borderBottom:catFilter===c?"3px solid #7c3aed":"3px solid transparent",background:"transparent",fontSize:13,fontWeight:catFilter===c?700:500,cursor:"pointer",color:catFilter===c?"#7c3aed":"#5a5068",whiteSpace:"nowrap",fontFamily:"inherit",transition:"0.15s"}}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── HERO ─── */
  const Hero = () => {
    const p = PROMOS[promoIdx];
    return (
      <div style={{position:"relative",overflow:"hidden"}}>
        <div style={{background:p.gradient,padding:"56px 28px",minHeight:280,display:"flex",alignItems:"center",justifyContent:"center",transition:"0.5s"}}>
          <div style={{maxWidth:1320,width:"100%",display:"flex",alignItems:"center",gap:48,flexWrap:"wrap",justifyContent:"center"}}>
            <div style={{flex:1,minWidth:300,color:"#fff"}}>
              <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:2,opacity:0.7,marginBottom:12}}>Featured</div>
              <h2 style={{fontSize:36,fontWeight:800,margin:"0 0 14px",lineHeight:1.1,letterSpacing:"-0.5px"}}>{p.title}</h2>
              <p style={{fontSize:16,opacity:0.88,margin:"0 0 24px",lineHeight:1.6,maxWidth:440}}>{p.sub}</p>
              <button onClick={()=>{if(p.brandId)go("product",BRANDS.find(b=>b.id===p.brandId));}}
                style={{padding:"14px 32px",borderRadius:32,border:"2px solid rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",backdropFilter:"blur(8px)",fontFamily:"inherit",transition:"0.2s",letterSpacing:"0.3px"}}
                onMouseOver={e=>e.target.style.background="rgba(255,255,255,0.25)"} onMouseOut={e=>e.target.style.background="rgba(255,255,255,0.12)"}>{p.cta} →</button>
            </div>
            <div style={{display:"flex",gap:14}}>
              {[BRANDS[0],BRANDS[3],BRANDS[4]].map(b=>(
                <div key={b.id} onClick={()=>go("product",b)} style={{width:150,height:100,borderRadius:16,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"1px solid rgba(255,255,255,0.18)",transition:"0.2s"}}
                  onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <BrandLogo src={b.logo} name={b.name} size={52} radius={12} bg="rgba(255,255,255,0.9)" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8}}>
          {PROMOS.map((_,i)=><button key={i} onClick={()=>setPromoIdx(i)} style={{width:i===promoIdx?28:10,height:10,borderRadius:5,border:"none",background:i===promoIdx?"#fff":"rgba(255,255,255,0.35)",cursor:"pointer",transition:"0.3s"}} />)}
        </div>
      </div>
    );
  };

  /* ─── OCCASIONS ─── */
  const Occasions = () => (
    <div style={{maxWidth:1320,margin:"0 auto",padding:"36px 28px 12px"}}>
      <h3 style={{fontSize:15,fontWeight:700,color:"#1a1025",margin:"0 0 16px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Shop by Occasion</h3>
      <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
        {OCCASIONS.map(o=>(
          <button key={o.name} onClick={()=>goCat("All Brands")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"18px 22px",border:"1.5px solid #eae6f0",borderRadius:16,background:"#fff",cursor:"pointer",minWidth:108,transition:"0.15s",flexShrink:0,fontFamily:"inherit"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor="#7c3aed";e.currentTarget.style.background="#f9f5ff";}} onMouseOut={e=>{e.currentTarget.style.borderColor="#eae6f0";e.currentTarget.style.background="#fff";}}>
            <span style={{fontSize:32}}>{o.icon}</span>
            <span style={{fontSize:12,fontWeight:700,color:"#1a1025"}}>{o.name}</span>
            <span style={{fontSize:11,color:"#a09aab"}}>{o.count} cards</span>
          </button>
        ))}
      </div>
    </div>
  );

  /* ─── PRODUCT GRID ─── */
  const Grid = ({items,title,showAll}) => (
    <div style={{maxWidth:1320,margin:"0 auto",padding:"12px 28px 40px"}}>
      {title&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:24,fontWeight:800,margin:0,color:"#1a1025",letterSpacing:"-0.3px"}}>{title}</h2>
        {showAll&&<span onClick={()=>goCat("All Brands")} style={{fontSize:13,fontWeight:700,color:"#7c3aed",cursor:"pointer"}}>View all →</span>}
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:16}}>
        {items.map(b=>(
          <div key={b.id} onClick={()=>go("product",b)} style={{background:"#fff",border:"1.5px solid #eae6f0",borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all 0.2s",position:"relative"}}
            onMouseOver={e=>{e.currentTarget.style.boxShadow="0 12px 40px rgba(124,58,237,0.12)";e.currentTarget.style.borderColor="#c4b5fd";e.currentTarget.style.transform="translateY(-3px)";}}
            onMouseOut={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="#eae6f0";e.currentTarget.style.transform="translateY(0)";}}>
            {b.badge&&<span style={{position:"absolute",top:12,left:12,background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:8,letterSpacing:"0.5px",zIndex:1}}>{b.badge}</span>}
            <div style={{height:140,background:`linear-gradient(160deg,${b.color}10,${b.color}04)`,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #f3f0f7"}}>
              <BrandLogo src={b.logo} name={b.name} size={72} radius={14} bg="transparent" />
            </div>
            <div style={{padding:"16px 18px 18px"}}>
              <div style={{fontSize:15,fontWeight:700,color:"#1a1025",marginBottom:6,lineHeight:1.25,minHeight:38}}>{b.name}</div>
              <div style={{fontSize:14,color:"#7c3aed",fontWeight:700}}>{fmt(b.min)} – {fmt(b.max)}</div>
              <div style={{display:"flex",gap:6,marginTop:10}}>
                {b.type!=="physical"&&<span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:6,background:"#f3e8ff",color:"#7c3aed"}}>eGift</span>}
                {(b.type==="both"||b.type==="physical")&&<span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:6,background:"#f5f3f7",color:"#5a5068"}}>Physical</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length===0&&<div style={{textAlign:"center",padding:60,color:"#a09aab"}}>No gift cards found matching your search.</div>}
    </div>
  );

  /* ─── PRODUCT DETAIL ─── */
  const Detail = () => {
    const b=brand;
    const [d,setD]=useState(b?.fixed?.[1]||b?.fixed?.[0]);
    const [custom,setCustom]=useState("");
    const [q,setQ]=useState(1);
    const [dt,setDt]=useState("egift");
    const [added,setAdded]=useState(false);
    const [tab,setTab]=useState("details");
    if(!b) return null;
    const isCustom=d==="custom";
    const amt=isCustom?Number(custom)||0:d;
    return (
      <div style={{maxWidth:1320,margin:"0 auto",padding:"28px"}}>
        <div style={{fontSize:13,color:"#a09aab",marginBottom:24,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span onClick={goHome} style={{cursor:"pointer",color:"#7c3aed",fontWeight:500}}>Home</span>›
          <span onClick={()=>goCat(b.cat)} style={{cursor:"pointer",color:"#7c3aed",fontWeight:500}}>{b.cat}</span>›
          <span style={{color:"#5a5068"}}>{b.name}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"flex-start"}}>
          {/* Card preview */}
          <div style={{background:`linear-gradient(160deg,${b.color}12,${b.color}04)`,borderRadius:24,padding:48,display:"flex",alignItems:"center",justifyContent:"center",minHeight:360,border:"1.5px solid #eae6f0"}}>
            <div style={{width:320,height:200,borderRadius:20,background:`linear-gradient(140deg,${b.color}ee,${b.color}bb)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 24px 80px ${b.color}40`,position:"relative",overflow:"hidden"}}>
              <BrandLogo src={b.logo} name={b.name} size={80} radius={16} bg="rgba(255,255,255,0.95)" />
              <div style={{position:"absolute",bottom:16,right:20,fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.7)",letterSpacing:"0.5px"}}>{b.name}</div>
              <div style={{position:"absolute",top:16,left:20,fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)"}}>{dt==="egift"?"eGIFT CARD":"GIFT CARD"}</div>
              {amt>0&&<div style={{position:"absolute",bottom:16,left:20,fontSize:22,fontWeight:800,color:"#fff"}}>{fmt(amt)}</div>}
            </div>
          </div>
          {/* Form */}
          <div>
            <h1 style={{fontSize:28,fontWeight:800,margin:"0 0 8px",color:"#1a1025",letterSpacing:"-0.3px"}}>{b.name} Gift Card</h1>
            <p style={{fontSize:14,color:"#5a5068",margin:"0 0 24px",lineHeight:1.7}}>{b.desc}</p>
            {b.type==="both"&&<div style={{marginBottom:28}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10,color:"#1a1025"}}>Delivery Method</div>
              <div style={{display:"flex",border:"1.5px solid #eae6f0",borderRadius:12,overflow:"hidden"}}>
                {[["egift","⚡ eGift Card","Instant via email"],["physical","📦 Physical Card","Ships in 5-7 days"]].map(([v,l,s])=>(
                  <button key={v} onClick={()=>setDt(v)} style={{flex:1,padding:"14px 16px",border:"none",background:dt===v?"#7c3aed":"transparent",color:dt===v?"#fff":"#5a5068",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"0.15s",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <span>{l}</span><span style={{fontSize:11,fontWeight:400,opacity:0.7}}>{s}</span>
                  </button>
                ))}
              </div>
            </div>}
            <div style={{marginBottom:28}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:"#1a1025"}}>Select Amount</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {b.fixed.map(v=>(
                  <button key={v} onClick={()=>{setD(v);setAdded(false);setCustom("");}} style={{padding:"12px 24px",border:d===v?"2.5px solid #7c3aed":"2px solid #eae6f0",borderRadius:12,background:d===v?"#f9f5ff":"#fff",color:d===v?"#7c3aed":"#1a1025",fontWeight:800,fontSize:16,cursor:"pointer",fontFamily:"inherit",transition:"0.15s"}}>{fmt(v)}</button>
                ))}
                <button onClick={()=>{setD("custom");setAdded(false);}} style={{padding:"12px 24px",border:isCustom?"2.5px solid #7c3aed":"2px solid #eae6f0",borderRadius:12,background:isCustom?"#f9f5ff":"#fff",color:isCustom?"#7c3aed":"#5a5068",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Other $</button>
              </div>
              {isCustom&&<input type="number" placeholder={`${b.min} – ${b.max}`} value={custom} onChange={e=>setCustom(e.target.value)} style={{marginTop:12,width:200,padding:"12px 16px",border:"2px solid #eae6f0",borderRadius:12,fontSize:16,fontWeight:700,fontFamily:"inherit"}} />}
            </div>
            <div style={{marginBottom:32}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:"#1a1025"}}>Quantity</div>
              <div style={{display:"inline-flex",border:"1.5px solid #eae6f0",borderRadius:12,overflow:"hidden"}}>
                <button onClick={()=>{setQ(x=>Math.max(1,x-1));setAdded(false);}} disabled={q<=1} style={{width:48,height:48,border:"none",background:"#faf9fb",fontSize:20,cursor:"pointer",fontFamily:"inherit",color:"#5a5068"}}>−</button>
                <span style={{minWidth:56,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18}}>{q}</span>
                <button onClick={()=>{setQ(x=>Math.min(10,x+1));setAdded(false);}} disabled={q>=10} style={{width:48,height:48,border:"none",background:"#faf9fb",fontSize:20,cursor:"pointer",fontFamily:"inherit",color:"#5a5068"}}>+</button>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:24,paddingTop:24,borderTop:"1.5px solid #eae6f0"}}>
              <div><div style={{fontSize:12,color:"#a09aab",fontWeight:500}}>Total</div><div style={{fontSize:32,fontWeight:800,color:"#1a1025"}}>{fmt(amt*q)}</div></div>
              <button onClick={()=>{if(!amt||amt<b.min||amt>b.max)return;addCart(b,amt,q,dt);setAdded(true);setTimeout(()=>setAdded(false),2500);}}
                disabled={!amt||amt<b.min||amt>b.max}
                style={{flex:1,padding:"18px",borderRadius:14,border:"none",background:added?"#16a34a":"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"inherit",transition:"0.3s",opacity:(!amt||amt<b.min||amt>b.max)?0.4:1,letterSpacing:"0.3px"}}>
                {added?"✓ Added to Cart":"Add to Cart"}
              </button>
            </div>
            <div style={{display:"flex",gap:20,marginTop:28,flexWrap:"wrap"}}>
              {[["⚡","Instant delivery"],["🔒","Secure checkout"],["🎁","Gift message"],["↩️","Easy refunds"]].map(([i,t])=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#5a5068",fontWeight:500}}><span style={{fontSize:15}}>{i}</span>{t}</div>
              ))}
            </div>
            {/* Tabs */}
            <div style={{marginTop:36,borderTop:"1.5px solid #eae6f0",paddingTop:24}}>
              <div style={{display:"flex",gap:0,borderBottom:"1.5px solid #eae6f0",marginBottom:18}}>
                {["Details","How to Redeem","Terms"].map(t=>(
                  <button key={t} onClick={()=>setTab(t.toLowerCase().replace(/ /g,""))} style={{padding:"12px 24px",border:"none",borderBottom:tab===t.toLowerCase().replace(/ /g,"")?"3px solid #7c3aed":"3px solid transparent",background:"transparent",fontSize:13,fontWeight:tab===t.toLowerCase().replace(/ /g,"")?700:500,cursor:"pointer",color:tab===t.toLowerCase().replace(/ /g,"")?"#7c3aed":"#5a5068",fontFamily:"inherit"}}>{t}</button>
                ))}
              </div>
              <div style={{fontSize:14,color:"#5a5068",lineHeight:1.8}}>
                {tab==="details"&&<div>{b.desc} This gift card does not expire and carries no fees after purchase. Valid for redemption in the United States.</div>}
                {tab==="howtoredeem"&&<div>Visit the brand's website or app. Navigate to the gift card or payment section during checkout. Enter the card number and PIN from your gift card to apply the balance.</div>}
                {tab==="terms"&&<div>This card is redeemable for merchandise or services only and may not be redeemed for cash except where required by law. Protect this card like cash. Lost or stolen cards cannot be replaced without proof of purchase. No expiration. No fees.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─── CART DRAWER ─── */
  const Cart = () => cartOpen&&(
    <div style={{position:"fixed",inset:0,zIndex:500}}>
      <div onClick={()=>setCartOpen(false)} style={{position:"absolute",inset:0,background:"rgba(26,16,37,0.5)",backdropFilter:"blur(4px)"}} />
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:440,maxWidth:"92vw",background:"#fff",boxShadow:"-8px 0 40px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",animation:"si .25s ease"}}>
        <div style={{padding:"22px 28px",borderBottom:"1.5px solid #eae6f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 style={{margin:0,fontSize:20,fontWeight:800}}>Your Cart ({cartN})</h3>
          <button onClick={()=>setCartOpen(false)} style={{border:"none",background:"none",fontSize:24,cursor:"pointer",color:"#a09aab"}}>✕</button>
        </div>
        <div style={{flex:1,overflow:"auto",padding:"16px 28px"}}>
          {cart.length===0?<div style={{textAlign:"center",padding:"70px 0",color:"#a09aab"}}><div style={{fontSize:52,marginBottom:16}}>🛒</div><div style={{fontSize:15,fontWeight:500}}>Your cart is empty</div></div>:
            cart.map((item,i)=>(
              <div key={item.key} style={{display:"flex",gap:16,padding:"18px 0",borderBottom:"1px solid #f3f0f7",alignItems:"center"}}>
                <BrandLogo src={item.logo} name={item.name} size={48} radius={10} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:14}}>{item.name}</div>
                  <div style={{fontSize:12,color:"#5a5068"}}>{fmt(item.denom)} · {item.dt==="egift"?"eGift":"Physical"}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{display:"flex",border:"1px solid #eae6f0",borderRadius:8,overflow:"hidden"}}>
                    <button onClick={()=>setCart(c=>{const u=[...c];u[i]={...u[i],qty:Math.max(1,u[i].qty-1)};return u;})} style={{width:30,height:30,border:"none",background:"#faf9fb",cursor:"pointer"}}>−</button>
                    <span style={{minWidth:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>{item.qty}</span>
                    <button onClick={()=>setCart(c=>{const u=[...c];u[i]={...u[i],qty:Math.min(10,u[i].qty+1)};return u;})} style={{width:30,height:30,border:"none",background:"#faf9fb",cursor:"pointer"}}>+</button>
                  </div>
                  <div style={{fontWeight:800,fontSize:14,minWidth:60,textAlign:"right"}}>{fmt(item.price*item.qty)}</div>
                  <button onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))} style={{border:"none",background:"none",fontSize:18,cursor:"pointer",color:"#a09aab"}}>✕</button>
                </div>
              </div>
            ))}
        </div>
        {cart.length>0&&<div style={{padding:"24px 28px",borderTop:"1.5px solid #eae6f0",background:"#faf9fb"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:14,color:"#5a5068"}}><span>Subtotal</span><span>{fmt(cartT)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,fontSize:20,fontWeight:800}}><span>Total</span><span>{fmt(cartT)}</span></div>
          <button onClick={checkout} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.3px"}}>Checkout · {fmt(cartT)}</button>
          <div style={{textAlign:"center",marginTop:12,fontSize:12,color:"#a09aab",fontWeight:500}}>🔒 Secure checkout · 256-bit encryption</div>
        </div>}
      </div>
      <style>{`@keyframes si{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  );

  /* ─── SELF-SERVICE ─── */
  const SelfServe = ({title,icon,fields,btn}) => (
    <div style={{maxWidth:520,margin:"60px auto",padding:"0 28px"}}>
      <div style={{background:"#fff",border:"1.5px solid #eae6f0",borderRadius:24,padding:"44px 40px",boxShadow:"0 8px 40px rgba(0,0,0,0.04)"}}>
        <div style={{textAlign:"center",marginBottom:32}}><span style={{fontSize:52}}>{icon}</span><h2 style={{fontSize:24,fontWeight:800,margin:"14px 0 0",color:"#1a1025"}}>{title}</h2></div>
        {fields.map(f=>(
          <div key={f} style={{marginBottom:18}}>
            <label style={{fontSize:12,fontWeight:700,color:"#5a5068",display:"block",marginBottom:7,textTransform:"uppercase",letterSpacing:"0.5px"}}>{f}</label>
            <input placeholder={f} style={{width:"100%",padding:"13px 18px",border:"2px solid #eae6f0",borderRadius:12,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",background:"#faf9fb"}} />
          </div>
        ))}
        <button style={{width:"100%",padding:"15px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>{btn}</button>
      </div>
    </div>
  );

  /* ─── ORDERS ─── */
  const Orders = () => (
    <div style={{maxWidth:760,margin:"40px auto",padding:"0 28px"}}>
      <h1 style={{fontSize:24,fontWeight:800,margin:"0 0 24px"}}>My Orders</h1>
      {orders.length===0?<div style={{textAlign:"center",padding:70,color:"#a09aab",background:"#fff",borderRadius:20,border:"1.5px solid #eae6f0"}}><div style={{fontSize:52,marginBottom:14}}>📦</div><div style={{fontSize:16,fontWeight:600}}>No orders yet</div><button onClick={goHome} style={{marginTop:16,padding:"10px 24px",border:"none",borderRadius:10,background:"#7c3aed",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Start Shopping</button></div>:
        orders.map(o=>(
          <div key={o.id} onClick={()=>{setOrder(o);go("orderDetail");}} style={{background:"#fff",border:"1.5px solid #eae6f0",borderRadius:16,padding:"18px 24px",marginBottom:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"0.15s"}}
            onMouseOver={e=>e.currentTarget.style.borderColor="#c4b5fd"} onMouseOut={e=>e.currentTarget.style.borderColor="#eae6f0"}>
            <div><div style={{fontWeight:800,fontFamily:"'JetBrains Mono',monospace",fontSize:14,letterSpacing:"0.3px"}}>{o.num}</div><div style={{fontSize:12,color:"#a09aab",marginTop:4}}>{new Date(o.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:99,background:"#dcfce7",color:"#16a34a"}}>{o.status}</span>
              <span style={{fontWeight:800,fontSize:16}}>{fmt(o.total)}</span>
              <span style={{color:"#a09aab"}}>→</span>
            </div>
          </div>
        ))}
    </div>
  );

  /* ─── ORDER DETAIL ─── */
  const ODetail = () => {
    const o=order;if(!o)return null;
    return (
      <div style={{maxWidth:760,margin:"40px auto",padding:"0 28px"}}>
        <span onClick={()=>go("orders")} style={{fontSize:13,color:"#7c3aed",cursor:"pointer",fontWeight:600}}>← Back to Orders</span>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",margin:"20px 0 28px"}}>
          <div><h1 style={{fontSize:24,fontWeight:800,margin:"0 0 6px"}}>Order {o.num}</h1><div style={{fontSize:13,color:"#a09aab"}}>{new Date(o.date).toLocaleString()}</div></div>
          <span style={{fontSize:12,fontWeight:700,padding:"6px 18px",borderRadius:99,background:"#dcfce7",color:"#16a34a"}}>{o.status}</span>
        </div>
        {o.items.map(item=>(
          <div key={item.id} style={{background:"#fff",border:"1.5px solid #eae6f0",borderRadius:16,padding:24,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"center"}}>
              <span style={{fontWeight:800,fontSize:15}}>{item.name}</span>
              <span style={{fontSize:13,color:"#5a5068"}}>{fmt(item.denom)} × {item.qty} · {item.dt==="egift"?"eGift":"Physical"}</span>
            </div>
            <div style={{borderTop:"1.5px solid #f3f0f7",paddingTop:14}}>
              {item.codes.map(c=>(
                <div key={c.id} style={{padding:"14px 0",borderBottom:"1px dashed #eae6f0"}}>
                  {revealed[c.id]?(
                    <div>
                      <div style={{marginBottom:14}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#a09aab",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Card Number</div>
                        <div onClick={()=>copy(c.code)} style={{display:"inline-flex",gap:12,alignItems:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:17,fontWeight:700,background:"#faf9fb",padding:"12px 20px",borderRadius:12,border:"1.5px dashed #d4cfe0",cursor:"pointer",letterSpacing:1}}>
                          {c.code}<span style={{fontSize:11,fontFamily:"inherit",color:"#a09aab",fontWeight:500}}>📋 copy</span>
                        </div>
                      </div>
                      <div><div style={{fontSize:10,fontWeight:700,color:"#a09aab",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>PIN</div>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:15,background:"#faf9fb",padding:"10px 18px",borderRadius:10,display:"inline-block",letterSpacing:1}}>{c.pin}</span>
                      </div>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#a09aab",letterSpacing:2,fontSize:15}}>•••• •••• •••• {c.code.slice(-4)}</span>
                      <button onClick={()=>setRevealed(p=>({...p,[c.id]:true}))} style={{padding:"10px 24px",border:"2px solid #7c3aed",borderRadius:12,background:"transparent",color:"#7c3aed",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"0.15s"}}
                        onMouseOver={e=>{e.target.style.background="#7c3aed";e.target.style.color="#fff";}} onMouseOut={e=>{e.target.style.background="transparent";e.target.style.color="#7c3aed";}}>Reveal Code</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{background:"#fff",border:"1.5px solid #eae6f0",borderRadius:16,padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:18}}><span>Total Paid</span><span>{fmt(o.total)}</span></div>
        </div>
      </div>
    );
  };

  /* ─── TRUST ─── */
  const Trust = () => (
    <div style={{background:"linear-gradient(135deg,#7c3aed,#a855f7,#c084fc)",padding:"48px 28px",textAlign:"center",color:"#fff",marginTop:48}}>
      <h3 style={{fontSize:22,fontWeight:800,margin:"0 0 10px",letterSpacing:"-0.3px"}}>America's Highest-Rated Gift Card Destination</h3>
      <p style={{fontSize:14,opacity:0.85,margin:"0 0 28px"}}>Over 45,000 verified reviews · $2+ billion in gift card sales · 450+ brands</p>
      <div style={{display:"flex",justifyContent:"center",gap:48,flexWrap:"wrap"}}>
        {[["⭐ 4.8/5","45K+ Reviews"],["🔒","Secure & Encrypted"],["⚡","Instant eGift Delivery"],["🏆","450+ Trusted Brands"]].map(([i,t])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{i}</span><span style={{fontSize:13,fontWeight:700}}>{t}</span></div>
        ))}
      </div>
    </div>
  );

  /* ─── FOOTER ─── */
  const Footer = () => (
    <footer style={{background:"#1a1025",color:"#8a7f99",padding:"52px 28px 28px"}}>
      <div style={{maxWidth:1320,margin:"0 auto",display:"grid",gridTemplateColumns:"1.2fr repeat(4,1fr)",gap:36,marginBottom:44}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,fontWeight:900}}>G</div>
            <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>giftcards.com</span>
          </div>
          <p style={{fontSize:13,lineHeight:1.8,maxWidth:240}}>America's trusted online gift card marketplace. 450+ brands, instant delivery, secure checkout.</p>
        </div>
        {[{t:"Shop",l:["All Gift Cards","eGift Cards","Physical Cards","Visa® Cards","Mastercard® Cards","Deals & Promotions"]},
          {t:"Self-Service",l:["Track Order","Activate Card","Check Balance","Corporate & Bulk"]},
          {t:"Support",l:["Help Center","Contact Us","FAQs","Shipping Info","Returns & Refunds"]},
          {t:"Company",l:["About Us","Careers","Press","Affiliates","Terms of Use","Privacy Policy"]}
        ].map(s=>(
          <div key={s.t}>
            <div style={{fontSize:12,fontWeight:800,color:"#fff",marginBottom:16,textTransform:"uppercase",letterSpacing:1}}>{s.t}</div>
            {s.l.map(l=><div key={l} style={{fontSize:13,marginBottom:11,cursor:"pointer",transition:"0.15s"}} onMouseOver={e=>e.target.style.color="#fff"} onMouseOut={e=>e.target.style.color="#8a7f99"}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid #2d2343",paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
        <div style={{fontSize:12}}>© 2026 GiftCards.com — All rights reserved. A Blackhawk Network brand.</div>
        <div style={{display:"flex",gap:10}}>
          {["Visa","Mastercard","Amex","PayPal","Apple Pay"].map(p=><span key={p} style={{fontSize:11,fontWeight:600,padding:"5px 12px",borderRadius:6,background:"#2d2343",color:"#8a7f99"}}>{p}</span>)}
        </div>
      </div>
    </footer>
  );

  const PAGES={
    home:()=><><Hero/><Occasions/><Grid items={BRANDS.slice(0,8)} title="Buy gift cards from trusted brands" showAll /><Grid items={BRANDS.slice(8,16)} title="More popular brands" showAll /><Trust/></>,
    catalog:()=><Grid items={filtered} title={catFilter&&catFilter!=="All Brands"&&catFilter!=="Categories"&&catFilter!=="Deals"&&catFilter!=="Business"?`${catFilter} Gift Cards`:search?`Results for "${search}"`:"All Gift Cards"} />,
    product:Detail,orders:Orders,orderDetail:ODetail,
    trackOrder:()=><SelfServe title="Track Your Order" icon="📦" fields={["Order Number","Email Address"]} btn="Track Order" />,
    activate:()=><SelfServe title="Activate Your Card" icon="🔓" fields={["16-Digit Card Number","Security Code (CVV)","Expiration Date"]} btn="Activate Card" />,
    balance:()=><SelfServe title="Check Your Balance" icon="💰" fields={["16-Digit Card Number","PIN / Security Code"]} btn="Check Balance" />,
    support:()=><SelfServe title="Contact Support" icon="💬" fields={["Full Name","Email Address","Order Number (optional)","Describe your issue"]} btn="Submit Request" />,
  };
  const P=PAGES[page]||PAGES.home;

  return (
    <div style={{fontFamily:"'Outfit',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"#faf9fb",minHeight:"100vh",color:"#1a1025",fontSize:14,lineHeight:1.5}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>
      <UtilBar/><Nav/><P/><Footer/><Cart/>
      {copied&&<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1a1025",color:"#fff",padding:"14px 28px",borderRadius:14,fontSize:14,fontWeight:700,zIndex:999,boxShadow:"0 12px 40px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:8}}>✓ Copied to clipboard</div>}
    </div>
  );
}
