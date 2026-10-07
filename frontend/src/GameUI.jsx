import React, { useEffect, useMemo, useState } from "react";

const IDLE_NAV = [
  ["home", "⌂", "Home"],
  ["buy", "▱", "Buy"],
  ["map", "⌖", "Map"],
  ["phone", "▣", "Phone"]
];

const WORK_NAV = [
  ["home", "⌂", "Home"],
  ["map", "⌖", "Map"],
  ["phone", "▣", "Phone"]
];

const NEEDS = [
  ["Hunger","hunger","Food"],
  ["Energy","energy","Rest"],
  ["Hygiene","hygiene","Wash"],
  ["Bladder","bladder","Toilet"],
  ["Fun","fun","Fun"],
  ["Social","social","Social"]
];

const PHONE_APPS = [
  ["jobs","Jobs","▦"],["messages","Messages","✉"],["bank","Bank","₵"],["hustle","Hustle","★"],
  ["daily","Daily","✓"],["gems","Gems","◆"],["market","Market","⌁"],["shop","Shop","□"],
  ["people","People","◎"],["social","Social","♡"],["home","Home","⌂"],["cars","Cars","▰"],
  ["business","Business","▥"],["skills","Skills","◇"],["profile","Profile","●"],["settings","Settings","⚙"]
];

const JOBS = [
  {name:"Marketer", pay:11600, hours:"08:00–17:00", skill:"Charisma"},
  {name:"Tech Intern", pay:9900, hours:"09:00–17:00", skill:"Coding"},
  {name:"Student Nurse", pay:9100, hours:"07:00–17:00", skill:"Fitness"},
  {name:"Trading Assistant", pay:8300, hours:"07:00–16:00", skill:"Hustle"},
];

const ITEMS = [
  {id:"fan",name:"Ceiling Fan",price:2500,icon:"◒"},
  {id:"sofa",name:"Two-seat Sofa",price:5800,icon:"▱"},
  {id:"desk",name:"Study Desk",price:4200,icon:"▤"},
  {id:"tv",name:"Smart TV",price:8900,icon:"▣"},
  {id:"bed",name:"Better Bed",price:11500,icon:"⌁"},
  {id:"generator",name:"Small Generator",price:14500,icon:"ϟ"}
];

const INITIAL_NEEDS = {hunger:76,energy:84,hygiene:73,bladder:92,fun:78,social:67};

function money(n){ return "D "+Math.max(0,Math.round(n)).toLocaleString(); }
function cap(n){ return Math.max(0,Math.min(100,Math.round(n))); }
function gameTime(total){
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const mins=((total%1440)+1440)%1440;
  let h=Math.floor(mins/60); const m=String(mins%60).padStart(2,"0"); const ap=h>=12?"PM":"AM"; h=h%12||12;
  return days[Math.floor(total/1440)%7]+" · "+h+":"+m+" "+ap;
}
function initialGame(profile){
  return {
    gameMinutes:8*60+47,
    money:profile?.birth==="Connected family"?3250:2900,
    mood:"Very Happy",
    needs:{...INITIAL_NEEDS},
    performance:51,
    job:"Marketer",
    workMinutesLeft:0,
    tasks:0,
    inventory:[],
    phoneApp:null,
    messages:[
      {name:"Senegambia Welcome",text:"Welcome to your new life.",unread:true},
      {name:"Community",text:"New players are joining Senegambia.",unread:false}
    ]
  };
}

function Icon({children}){ return <span className="llx-icon">{children}</span>; }

export default function GameUI({session,profile,activeTab,setActiveTab,onNotice}){
  const storageKey=useMemo(()=> "senegambia-game:"+ (session?.username||"player"),[session?.username]);
  const [game,setGame]=useState(()=>{
    try{const s=localStorage.getItem(storageKey); return s?{...initialGame(profile),...JSON.parse(s)}:initialGame(profile);}catch{return initialGame(profile);}
  });
  const [phoneSearch,setPhoneSearch]=useState("");

  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(game));}catch{}},[game,storageKey]);
  useEffect(()=>{
    const t=setInterval(()=>{
      setGame(g=>{
        const needs=Object.fromEntries(Object.entries(g.needs).map(([k,v])=>[k,cap(v-(k==="energy"?0.12:0.08))]));
        return {...g,gameMinutes:g.gameMinutes+1,needs,workMinutesLeft:g.workMinutesLeft?Math.max(0,g.workMinutesLeft-1):0};
      });
    },1200);
    return()=>clearInterval(t);
  },[]);

  const location=profile?.home||"Serrekunda";
  const playerName=profile?.nickname||session?.displayName||"Gambian Player";
  const dream=profile?.dream||"Build a business";
  const average=Math.round(Object.values(game.needs).reduce((a,b)=>a+b,0)/6);
  const nav=game.workMinutesLeft>0?WORK_NAV:IDLE_NAV;

  const notice=(m)=>onNotice?.(m);
  const updateNeeds=(changes,mins=10,msg)=>{
    setGame(g=>({...g,gameMinutes:g.gameMinutes+mins,needs:{...g.needs,...Object.fromEntries(Object.entries(changes).map(([k,v])=>[k,cap(g.needs[k]+v)]))}}));
    if(msg) notice(msg);
  };

  const startWork=()=>{
    setGame(g=>({...g,workMinutesLeft:8*60,tasks:0,mood:"Very Happy"}));
    setActiveTab("home");
    notice("At work · Marketer");
  };

  const workAction=(type)=>{
    const map={
      steady:{perf:6,energy:-4,fun:-2,social:1,mood:"Very Happy"},
      jaguda:{perf:10,energy:-9,fun:-6,social:-1,mood:"Focused"},
      chat:{perf:3,energy:-2,fun:3,social:9,mood:"Happy"},
      oga:{perf:8,energy:-5,social:-2,mood:"Focused"},
      easy:{perf:1,energy:2,fun:1,mood:"Relaxed"}
    };
    const a=map[type];
    setGame(g=>({...g,performance:cap(g.performance+a.perf),tasks:g.tasks+1,gameMinutes:g.gameMinutes+30,needs:{...g.needs,energy:cap(g.needs.energy+a.energy),fun:cap(g.needs.fun+(a.fun||0)),social:cap(g.needs.social+(a.social||0))}}));
  };

  const leaveWork=()=>{
    setGame(g=>({...g,workMinutesLeft:0,mood:"Okay"}));
    notice("Leave work early (partial pay)");
  };

  const buy=(item)=>{
    setGame(g=>{
      if(g.money<item.price){notice("Not enough money.");return g;}
      if(g.inventory.includes(item.id)){notice("Already owned.");return g;}
      return {...g,money:g.money-item.price,inventory:[...g.inventory,item.id]};
    });
  };

  const filteredApps=PHONE_APPS.filter(([id,name])=>!phoneSearch||name.toLowerCase().includes(phoneSearch.toLowerCase()));

  const openPhone=()=>{setPhoneSearch("");setGame(g=>({...g,phoneApp:null}));setActiveTab("phone");};
  const closePhone=()=>{setGame(g=>({...g,phoneApp:null}));setActiveTab("home");};

  const renderNeeds=()=>(
    <div className="llx-needs">
      {NEEDS.map(([label,key,action])=>(
        <div className="llx-need" key={key}>
          <div><span>{label}</span><b>{game.needs[key]}</b></div>
          <i><em style={{width:game.needs[key]+"%"}}/></i>
        </div>
      ))}
    </div>
  );

  const renderWork=()=>(
    <div className="llx-work">
      <div className="llx-work-title"><div><span>AT WORK · {game.job}</span><strong>Work</strong></div><b>Next task · 2m</b></div>
      <div className="llx-performance"><span>Performance</span><strong>{game.performance}%</strong><i><em style={{width:game.performance+"%"}}/></i></div>
      <div className="llx-work-actions">
        <button onClick={()=>workAction("steady")}><strong>Do Your Work</strong></button>
        <button onClick={()=>workAction("jaguda")}><strong>Work Like Jaguda</strong></button>
        <button onClick={()=>workAction("chat")}><strong>Chat with Colleagues</strong></button>
        <button onClick={()=>workAction("oga")}><strong>Suck Up to Oga</strong></button>
        <button onClick={()=>workAction("easy")}><strong>Take Am Easy</strong></button>
      </div>
      <button className="llx-leave" onClick={leaveWork}>Leave work early <span>(partial pay)</span></button>
    </div>
  );

  const renderHome=()=>(
    <>
      {renderNeeds()}
      <div className="llx-home-card">
        <span>HOME · {location.toUpperCase()}</span>
        <strong>{playerName}'s home</strong>
        <p>{dream} · {game.mood}</p>
        <div className="llx-home-actions">
          <button onClick={()=>updateNeeds({hunger:22,fun:2},20,"You ate at home.")}><Icon>⌁</Icon><span>Eat</span></button>
          <button onClick={()=>updateNeeds({energy:35,hunger:-4},120,"You slept.")}><Icon>◒</Icon><span>Sleep</span></button>
          <button onClick={()=>updateNeeds({hygiene:32},15,"Fresh again.")}><Icon>◌</Icon><span>Wash</span></button>
          <button onClick={()=>updateNeeds({fun:18,energy:4},20,"You relaxed.")}><Icon>○</Icon><span>Relax</span></button>
        </div>
      </div>
      {game.workMinutesLeft>0?renderWork():(
        <div className="llx-small-actions">
          <button onClick={startWork}><b>💼 Go to work</b><span>Marketer · {money(11600)} / shift</span></button>
          <button onClick={()=>setActiveTab("map")}><b>Go outside</b><span>Explore {location}</span></button>
        </div>
      )}
      <div className="llx-mini-info"><span>Dream <b>{dream}</b></span><span>Needs <b>{average}%</b></span></div>
    </>
  );

  const renderBuy=()=>(
    <div className="llx-sheet">
      <div className="llx-sheet-head"><div><span>BUY</span><strong>Items & upgrades</strong></div><button onClick={()=>setActiveTab("home")}>×</button></div>
      <div className="llx-tabs"><button className="active">Furniture</button><button>Upgrades</button><button>Transport</button></div>
      <div className="llx-item-grid">{ITEMS.map(it=><button className="llx-item" key={it.id} onClick={()=>buy(it)}><Icon>{it.icon}</Icon><span><b>{it.name}</b><small>{game.inventory.includes(it.id)?"Owned":money(it.price)}</small></span></button>)}</div>
    </div>
  );

  const renderMap=()=>(
    <div className="llx-map-panel">
      <div className="llx-map-label"><span>YOU ARE HERE</span><strong>{location}</strong><small>Tap any place marker on the map.</small></div>
      <button onClick={()=>notice("Choose a marker on the world map.")}>Find a place</button>
    </div>
  );

  const renderPhoneApp=()=>{
    const app=game.phoneApp;
    if(!app) return null;
    if(app==="jobs") return <PhoneApp title="Jobs" eyebrow="CAREER"><div className="llx-app-card"><span>YOUR JOB</span><strong>{game.job}</strong><p>Marketer · 08:00–17:00</p><button onClick={startWork}>Go to work</button></div>{JOBS.map(j=><div className="llx-list-row" key={j.name}><span><b>{j.name}</b><small>{j.hours} · {j.skill}</small></span><strong>{money(j.pay)}</strong></div>)}</PhoneApp>;
    if(app==="bank") return <PhoneApp title="Bank" eyebrow="MONEY"><div className="llx-balance"><span>AVAILABLE BALANCE</span><strong>{money(game.money)}</strong></div><div className="llx-two"><button>Send money</button><button>Save</button></div><div className="llx-list-row"><span><b>Starter balance</b><small>Senegambia Bank</small></span><strong>{money(game.money)}</strong></div></PhoneApp>;
    if(app==="messages") return <PhoneApp title="Messages" eyebrow="SOCIAL">{game.messages.map(m=><button className="llx-message" key={m.name} onClick={()=>notice("Message opened.")}><Icon>{m.name[0]}</Icon><span><b>{m.name}</b><small>{m.text}</small></span></button>)}</PhoneApp>;
    if(app==="daily"||app==="gems") return <PhoneApp title={app==="gems"?"Gems":"Daily"} eyebrow={app==="gems"?"SEARCH":"REWARDS"}><div className="llx-app-card"><span>{app==="gems"?"DAILY GEM SEARCH":"TODAY'S TASK"}</span><strong>{app==="gems"?"Find today's hidden gem":"Claim today's reward"}</strong><button onClick={()=>{setGame(g=>({...g,money:g.money+(app==="gems"?400:250)}));notice("Reward claimed.");}}>{app==="gems"?"Search":"Claim"}</button></div></PhoneApp>;
    if(app==="profile") return <PhoneApp title="Profile" eyebrow="SIM"><div className="llx-profile"><Icon>{playerName[0]}</Icon><span><b>{playerName}</b><small>{location} · {profile?.traitOne||"Resourceful"}</small></span></div><div className="llx-list-row"><span><b>Dream</b><small>{dream}</small></span></div></PhoneApp>;
    if(app==="settings") return <PhoneApp title="Settings" eyebrow="GAME"><div className="llx-list-row"><span><b>Notifications</b><small>Game alerts</small></span><strong>On</strong></div><div className="llx-list-row"><span><b>Save data</b><small>Device save</small></span><strong>Local</strong></div></PhoneApp>;
    if(app==="market"||app==="shop"||app==="home"||app==="cars"||app==="business"||app==="skills"||app==="people"||app==="social"||app==="hustle"){
      const titleMap={market:"Market",shop:"Shop",home:"Home",cars:"Cars",business:"Business",skills:"Skills",people:"People",social:"Social",hustle:"Hustle"};
      return <PhoneApp title={titleMap[app]} eyebrow="SENEGAMBIA"><div className="llx-app-card"><span>{app.toUpperCase()}</span><strong>{app==="people"?"Players nearby":app==="social"?"Friends & dating":app==="skills"?"Build your skills":"Your "+titleMap[app]+" app"}</strong><p>Interactive Senegambia system surface.</p><button onClick={()=>notice(titleMap[app]+" opened.")}>Open</button></div></PhoneApp>;
    }
    return <PhoneApp title="App" eyebrow="PHONE"><div className="llx-app-card"><strong>Senegambia Way</strong><p>Phone app ready.</p></div></PhoneApp>;
  };

  function PhoneApp({title,eyebrow,children}){
    return <div className="llx-phone-page"><div className="llx-phone-head"><button onClick={()=>setGame(g=>({...g,phoneApp:null}))}>‹</button><div><span>{eyebrow}</span><strong>{title}</strong></div><small>{gameTime(game.gameMinutes)}</small></div><div className="llx-phone-body">{children}</div></div>;
  }

  const renderPhone=()=>(
    <div className="llx-phone-overlay">
      <div className="llx-phone-window">
        {game.phoneApp?renderPhoneApp():(
          <>
            <div className="llx-phone-head"><div><span>PHONE</span><strong>Apps</strong></div><button onClick={closePhone}>×</button></div>
            <div className="llx-phone-search"><span>⌕</span><input value={phoneSearch} onChange={e=>setPhoneSearch(e.target.value)} placeholder="Search apps"/></div>
            <div className="llx-apps-grid">{filteredApps.map(([id,name,glyph])=><button className={"llx-phone-app app-"+id} key={id} onClick={()=>setGame(g=>({...g,phoneApp:id}))}><Icon>{glyph}</Icon><b>{name}</b></button>)}</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="llx-game">
      <div className="llx-world-scene" aria-hidden="true">
        <div className="llx-sky"/><div className="llx-ground"/>
        <div className="llx-road"/><div className="llx-house"/><div className="llx-yard"/>
        <div className="llx-tree t1"/><div className="llx-tree t2"/><div className="llx-tree t3"/>
        <div className="llx-person"><div/><i/></div>
      </div>

      <div className="llx-topbar">
        <div className="llx-top-left"><span className="mood-dot"/><b>{game.mood}</b><span>•</span><small>79k online now</small></div>
        <div className="llx-top-right"><span>⌁</span><b>{money(game.money)}</b><button onClick={()=>notice("Top up is a future backend feature.")}>+</button></div>
      </div>

      <div className="llx-content">
        {activeTab==="home"&&renderHome()}
        {activeTab==="buy"&&renderBuy()}
        {activeTab==="map"&&renderMap()}
      </div>

      {game.phoneApp||activeTab==="phone"?renderPhone():null}

      <nav className="llx-nav">{nav.map(([key,icon,label])=><button key={key} className={activeTab===key?"active":""} onClick={()=>key==="phone"?openPhone():setActiveTab(key)}><span>{icon}</span><small>{label}</small></button>)}</nav>
    </div>
  );
}
