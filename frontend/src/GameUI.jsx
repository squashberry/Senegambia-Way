import React, { useEffect, useMemo, useState } from "react";

const NAV = [
  ["home", "⌂", "Home"],
  ["buy", "▱", "Buy"],
  ["map", "⌖", "Map"],
  ["phone", "▣", "Phone"]
];

const NEEDS = [
  ["Hunger", "hunger", "🍽️"],
  ["Energy", "energy", "⚡"],
  ["Hygiene", "hygiene", "🧼"],
  ["Bladder", "bladder", "🚿"],
  ["Fun", "fun", "◌"],
  ["Social", "social", "◉"]
];

const PHONE_APPS = [
  ["jobs", "Jobs", "▣", "Career, shifts & pay"],
  ["messages", "Messages", "✉", "Chats & requests"],
  ["bank", "Bank", "₵", "Balance & transfers"],
  ["hustle", "Hustle", "★", "Player work board"],
  ["daily", "Daily", "✓", "Daily tasks"],
  ["gems", "Gems", "◆", "Free daily search"],
  ["market", "Market", "⌁", "Buy & resell"],
  ["shop", "Shop", "□", "Items & upgrades"],
  ["people", "People", "◎", "Players nearby"],
  ["social", "Social", "♡", "Friends & dating"],
  ["home", "Home", "⌂", "Home & staff"],
  ["cars", "Cars", "▰", "Transport"],
  ["business", "Business", "▥", "Businesses"],
  ["skills", "Skills", "◇", "Skills & progress"],
  ["profile", "Profile", "◉", "Your Sim"],
  ["settings", "Settings", "⚙", "Account & game"]
];

const JOBS = [
  { name: "Marketer", pay: 4200, hours: "9:00 AM – 5:00 PM", skill: "Charisma", level: 0 },
  { name: "Banking Assistant", pay: 5100, hours: "8:00 AM – 4:00 PM", skill: "Finance", level: 0 },
  { name: "Tech Intern", pay: 5600, hours: "9:00 AM – 5:00 PM", skill: "Coding", level: 0 },
  { name: "Radio Presenter", pay: 3800, hours: "10:00 AM – 6:00 PM", skill: "Creativity", level: 0 }
];

const SHOP_ITEMS = [
  { id: "fan", name: "Ceiling Fan", price: 2500, tag: "Comfort", icon: "◒" },
  { id: "sofa", name: "Two-seat Sofa", price: 5800, tag: "Fun", icon: "▱" },
  { id: "desk", name: "Study Desk", price: 4200, tag: "Focus", icon: "▤" },
  { id: "tv", name: "Smart TV", price: 8900, tag: "Fun", icon: "▣" },
  { id: "bed", name: "Better Bed", price: 11500, tag: "Energy", icon: "⌁" },
  { id: "generator", name: "Small Generator", price: 14500, tag: "Power", icon: "ϟ" }
];

const initialNeeds = { hunger: 76, energy: 84, hygiene: 73, bladder: 92, fun: 78, social: 67 };

function money(value) {
  return "D " + Math.max(0, Math.round(value)).toLocaleString();
}

function cap(value) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function formatGameTime(total) {
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(total / 1440) % 7];
  const mins = ((total % 1440) + 1440) % 1440;
  let h = Math.floor(mins / 60);
  const m = String(mins % 60).padStart(2, "0");
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return day + " · " + h + ":" + m + " " + suffix;
}

function makeInitialState(profile) {
  const connected = profile?.birth === "Connected family";
  return {
    gameMinutes: 8 * 60 + 47,
    money: connected ? 3250 : 2900,
    mood: "Very Happy",
    needs: { ...initialNeeds },
    performance: 51,
    job: "Marketer",
    appliedJob: "",
    workMinutesLeft: 0,
    workTasks: 0,
    inventory: [],
    messages: [
      { name: "Senegambia Welcome", preview: "Welcome to your new life. Your city is waiting.", unread: true },
      { name: "Community Board", preview: "New players are joining around Senegambia.", unread: false }
    ]
  };
}

export default function GameUI({ session, profile, activeTab, setActiveTab, onNotice }) {
  const stateKey = useMemo(
    () => "senegambia-game-state:" + (session?.username || "player"),
    [session?.username]
  );

  const [game, setGame] = useState(() => {
    try {
      const saved = localStorage.getItem(stateKey);
      return saved ? { ...makeInitialState(profile), ...JSON.parse(saved) } : makeInitialState(profile);
    } catch {
      return makeInitialState(profile);
    }
  });
  const [phoneApp, setPhoneApp] = useState(null);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [homeAction, setHomeAction] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(stateKey, JSON.stringify(game));
    } catch {}
  }, [game, stateKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGame((current) => {
        const nextNeeds = Object.fromEntries(
          Object.entries(current.needs).map(([key, value]) => [
            key,
            cap(value - (key === "energy" ? 0.18 : 0.11))
          ])
        );
        const next = {
          ...current,
          gameMinutes: current.gameMinutes + 1,
          needs: nextNeeds
        };
        if (current.workMinutesLeft > 0) {
          next.workMinutesLeft = Math.max(0, current.workMinutesLeft - 1);
        }
        return next;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (game.workMinutesLeft === 0 && game.workTasks > 0) {
      setGame((current) => ({
        ...current,
        workTasks: 0,
        performance: cap(current.performance + 4),
        money: current.money + Math.round((current.workTasks / 4) * 700),
        mood: "Relieved"
      }));
    }
  }, [game.workMinutesLeft, game.workTasks]);

  const location = profile?.home || "Serrekunda";
  const dream = profile?.dream || "Build a business";
  const playerName = profile?.nickname || session?.displayName || "Gambian Player";
  const needsAverage = Math.round(
    Object.values(game.needs).reduce((sum, value) => sum + value, 0) / Object.keys(game.needs).length
  );

  const notice = (message) => onNotice?.(message);

  const mutateNeeds = (changes, minutes = 10, message = "") => {
    setGame((current) => {
      const nextNeeds = { ...current.needs };
      Object.entries(changes).forEach(([key, change]) => {
        nextNeeds[key] = cap(nextNeeds[key] + change);
      });
      return { ...current, gameMinutes: current.gameMinutes + minutes, needs: nextNeeds };
    });
    if (message) notice(message);
  };

  const goWork = () => {
    setGame((current) => ({
      ...current,
      workMinutesLeft: 8 * 60,
      workTasks: 0,
      mood: "Focused"
    }));
    setActiveTab("home");
    notice("You are at work. Complete your tasks before leaving.");
  };

  const performWork = (mode) => {
    const effects = {
      steady: { performance: 6, energy: -4, fun: -2, social: 1, mood: "Focused", label: "You did your work steadily." },
      jaguda: { performance: 10, energy: -9, fun: -6, social: -1, mood: "Driven", label: "You worked like Jaguda. Performance jumped." },
      gist: { performance: 3, energy: -2, fun: 3, social: 9, mood: "Social", label: "You gisted with colleagues." },
      oga: { performance: 8, energy: -5, social: -2, mood: "Sharp", label: "You sucked up to oga. It paid off today." },
      easy: { performance: 1, energy: 2, fun: 1, social: 0, mood: "Relaxed", label: "You took am easy and protected your energy." }
    }[mode];

    setGame((current) => ({
      ...current,
      performance: cap(current.performance + effects.performance),
      workTasks: current.workTasks + 1,
      needs: {
        ...current.needs,
        energy: cap(current.needs.energy + effects.energy),
        fun: cap(current.needs.fun + (effects.fun || 0)),
        social: cap(current.needs.social + (effects.social || 0))
      },
      mood: effects.mood,
      gameMinutes: current.gameMinutes + 30,
      money: current.money + 120
    }));
    notice(effects.label);
  };

  const leaveWork = () => {
    setGame((current) => ({
      ...current,
      workMinutesLeft: 0,
      mood: "Okay"
    }));
    notice("You left work early. Partial pay has been added.");
  };

  const buyItem = (item) => {
    setGame((current) => {
      if (current.money < item.price) {
        notice("You need more money for " + item.name + ".");
        return current;
      }
      if (current.inventory.includes(item.id)) {
        notice("You already own " + item.name + ".");
        return current;
      }
      return {
        ...current,
        money: current.money - item.price,
        inventory: [...current.inventory, item.id]
      };
    });
  };

  const filteredApps = PHONE_APPS.filter(([id, name, icon, desc]) =>
    !phoneSearch.trim() ||
    name.toLowerCase().includes(phoneSearch.trim().toLowerCase()) ||
    desc.toLowerCase().includes(phoneSearch.trim().toLowerCase())
  );

  const openPhone = () => {
    setPhoneApp(null);
    setPhoneSearch("");
    setActiveTab("phone");
  };

  const closePhone = () => {
    setPhoneApp(null);
    setPhoneSearch("");
    setActiveTab("home");
  };

  const appBack = () => setPhoneApp(null);

  const changeJob = (job) => {
    setGame((current) => ({ ...current, appliedJob: job.name }));
    notice(job.name + " application submitted. Start tomorrow.");
  };

  const renderNeeds = () => (
    <div className="sim-needs-grid">
      {NEEDS.map(([label, key, icon]) => (
        <div className="sim-need" key={key}>
          <div className="sim-need-head">
            <span><b>{icon}</b>{label}</span>
            <strong>{game.needs[key]}%</strong>
          </div>
          <div className="sim-need-track"><i style={{ width: game.needs[key] + "%" }} /></div>
        </div>
      ))}
    </div>
  );

  const renderHome = () => (
    <section className="ll-panel ll-home-panel">
      <div className="ll-panel-topline">
        <div>
          <span className="ll-kicker">HOME · {location.toUpperCase()}</span>
          <h1>{playerName}'s place</h1>
          <p>Keep your needs up, build your life and decide what happens next.</p>
        </div>
        <div className="ll-money">{money(game.money)}</div>
      </div>

      {renderNeeds()}

      <div className="ll-home-scene" aria-label="Home scene">
        <div className="ll-room-wall" />
        <div className="ll-room-window"><span /><span /><span /></div>
        <div className="ll-room-sofa"><i /><i /><i /></div>
        <div className="ll-room-rug" />
        <div className="ll-room-table"><i /><i /><i /><i /></div>
        <div className="ll-room-player">
          <div className="ll-player-head">{playerName.slice(0, 1).toUpperCase()}</div>
          <div className="ll-player-body" />
          <span>{playerName}</span>
        </div>
        <div className="ll-home-scene-label">{location} · Senegambia</div>
      </div>

      <div className="ll-action-row">
        {[
          ["eat", "Eat at home", "Hunger +22", () => mutateNeeds({ hunger: 22, fun: 2 }, 25, "You had a proper home meal.")],
          ["sleep", "Sleep", "Energy +35", () => mutateNeeds({ energy: 35, hunger: -4, bladder: -5 }, 120, "You slept and recovered.")],
          ["shower", "Take a shower", "Hygiene +32", () => mutateNeeds({ hygiene: 32, bladder: 4 }, 15, "Fresh again.")],
          ["relax", "Relax", "Fun +18", () => mutateNeeds({ fun: 18, energy: 4 }, 20, "You chilled at home.")]
        ].map(([id, title, sub, action]) => (
          <button className="ll-action" key={id} onClick={() => { setHomeAction(id); action(); }}>
            <strong>{title}</strong><span>{sub}</span>
          </button>
        ))}
      </div>

      {game.workMinutesLeft > 0 ? (
        <WorkCard />
      ) : (
        <div className="ll-home-lower">
          <button className="ll-wide-action ll-primary" onClick={goWork}>
            <span><b>At work · {game.job}</b><small>Ready for your shift</small></span>
            <strong>Go to work <i>→</i></strong>
          </button>
          <button className="ll-wide-action" onClick={() => setActiveTab("map")}>
            <span><b>Go outside</b><small>Explore the neighbourhood and find activities.</small></span>
            <strong>Map <i>→</i></strong>
          </button>
        </div>
      )}

      <div className="ll-dream-strip">
        <div><span>YOUR DREAM</span><strong>{dream}</strong></div>
        <div><span>SIM CONDITION</span><strong>{game.mood} · {needsAverage}% average needs</strong></div>
      </div>

      {homeAction ? <span className="sr-only">Last home action: {homeAction}</span> : null}
    </section>
  );

  function WorkCard() {
    const hours = Math.max(0, game.workMinutesLeft);
    const hh = Math.floor(hours / 60);
    const mm = String(hours % 60).padStart(2, "0");
    return (
      <div className="ll-work-card">
        <div className="ll-work-head">
          <div><span className="ll-kicker">AT WORK · {game.job.toUpperCase()}</span><h2>Work shift</h2></div>
          <span className="ll-work-clock">Next task · {hh}h {mm}m</span>
        </div>
        <div className="ll-performance">
          <div><span>Performance</span><strong>{game.performance}%</strong></div>
          <div className="ll-performance-track"><i style={{ width: game.performance + "%" }} /></div>
        </div>
        <div className="ll-work-actions">
          {[
            ["steady", "Do Your Work", "Steady gains"],
            ["jaguda", "Work Like Jaguda", "Big gains, big drain"],
            ["gist", "Gist with Colleagues", "Social + performance"],
            ["oga", "Suck Up to Oga", "Risk / reward"],
            ["easy", "Take Am Easy", "Save energy"]
          ].map(([id, title, sub]) => (
            <button key={id} onClick={() => performWork(id)}>
              <strong>{title}</strong><span>{sub}</span>
            </button>
          ))}
        </div>
        <button className="ll-leave-work" onClick={leaveWork}>Leave work early <span>(partial pay)</span></button>
      </div>
    );
  }

  const renderBuy = () => (
    <section className="ll-panel ll-store-panel">
      <div className="ll-panel-topline">
        <div><span className="ll-kicker">BUY</span><h1>Make your place yours</h1><p>Furniture, comfort and small upgrades for your Senegambia home.</p></div>
        <div className="ll-money">{money(game.money)}</div>
      </div>
      <div className="ll-store-tabs"><button className="active">Furniture</button><button>Transport</button><button>Upgrades</button></div>
      <div className="ll-store-grid">
        {SHOP_ITEMS.map((item) => {
          const owned = game.inventory.includes(item.id);
          return (
            <article className={owned ? "ll-store-card owned" : "ll-store-card"} key={item.id}>
              <div className="ll-store-icon">{item.icon}</div>
              <div><span>{item.tag}</span><h3>{item.name}</h3></div>
              <button disabled={owned} onClick={() => buyItem(item)}>{owned ? "Owned" : money(item.price)}</button>
            </article>
          );
        })}
      </div>
    </section>
  );

  const renderMap = () => (
    <section className="ll-panel ll-map-panel">
      <div className="ll-panel-topline">
        <div><span className="ll-kicker">MAP</span><h1>Senegambia</h1><p>Your world is behind this panel — drag, zoom and tap places to explore.</p></div>
        <div className="ll-money">{money(game.money)}</div>
      </div>
      <div className="ll-map-sheet">
        <div className="ll-map-sheet-copy">
          <span>YOU ARE HERE</span>
          <strong>{location}</strong>
          <small>Travel takes game time. Walking is free.</small>
        </div>
        <button onClick={() => notice("Tap a marker on the city map to choose an activity.")}>Find a place</button>
      </div>
    </section>
  );

  const renderPhoneHome = () => (
    <>
      <div className="ll-phone-head">
        <div><span className="ll-kicker">PHONE</span><h2>My apps</h2></div>
        <span>{formatGameTime(game.gameMinutes)}</span>
      </div>
      <div className="ll-phone-search"><span>⌕</span><input value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)} placeholder="Search apps" /></div>
      <div className="ll-app-grid">
        {filteredApps.map(([id, name, icon, desc]) => (
          <button key={id} className="ll-app" onClick={() => setPhoneApp(id)}>
            <span className={"ll-app-icon ll-app-" + id}>{icon}</span>
            <strong>{name}</strong><small>{desc}</small>
          </button>
        ))}
      </div>
      <div className="ll-phone-dock">
        <button onClick={() => setPhoneApp("profile")}>Profile</button>
        <button onClick={() => setPhoneApp("messages")}>Messages</button>
        <button onClick={() => setPhoneApp("bank")}>Bank</button>
        <button onClick={() => setPhoneApp("settings")}>Settings</button>
      </div>
    </>
  );

  const renderPhoneApp = () => {
    if (phoneApp === "jobs") {
      return <PhoneApp title="Jobs" eyebrow="CAREER">
        <div className="ll-current-job"><span>YOUR JOB</span><strong>{game.job}</strong><div><b>{money(JOBS.find((j) => j.name === game.job)?.pay || 4200)} / shift</b><small>Mon – Fri · 9:00 AM – 5:00 PM</small></div><button onClick={goWork}>Go to work</button></div>
        <div className="ll-phone-section-title">Available careers</div>
        {JOBS.map((job) => <div className="ll-job-row" key={job.name}><div><strong>{job.name}</strong><small>{job.hours} · requires {job.skill} {job.level}</small></div><span>{money(job.pay)}</span><button disabled={game.appliedJob === job.name} onClick={() => changeJob(job)}>{game.appliedJob === job.name ? "Applied" : "Apply — start tomorrow"}</button></div>)}
      </PhoneApp>;
    }

    if (phoneApp === "bank") {
      return <PhoneApp title="Bank" eyebrow="MONEY">
        <div className="ll-bank-balance"><span>AVAILABLE BALANCE</span><strong>{money(game.money)}</strong><small>Senegambia Bank · savings 0.00%</small></div>
        <div className="ll-bank-actions"><button onClick={() => notice("Transfers will connect to other players in the multiplayer layer.")}>Send money</button><button onClick={() => notice("Cash-out is disabled. This is game currency.")}>Move to savings</button></div>
        <div className="ll-phone-section-title">Recent activity</div>
        {[["Starter balance", "+ D 2,900"],["Home setup", "— D 0"],["Daily task", "+ D 250"]].map(([a,b]) => <div className="ll-transaction" key={a}><span>{a}</span><strong>{b}</strong></div>)}
      </PhoneApp>;
    }

    if (phoneApp === "messages") {
      return <PhoneApp title="Messages" eyebrow="SOCIAL">
        {game.messages.map((message) => <button className="ll-message-row" key={message.name} onClick={() => notice("Message thread opened.")}><span className="ll-message-avatar">{message.name.slice(0,1)}</span><div><strong>{message.name}</strong><small>{message.preview}</small></div>{message.unread ? <i /> : null}</button>)}
        <button className="ll-message-new" onClick={() => notice("Choose a player from People to start a new chat.")}>New message</button>
      </PhoneApp>;
    }

    if (phoneApp === "hustle") {
      return <PhoneApp title="Hustle" eyebrow="PLAYER WORK">
        <div className="ll-hustle-card"><span>NEW TO HUSTLE</span><strong>Your Hustle rating starts here.</strong><p>Players can post work, hire help and review completed jobs.</p><button onClick={() => notice("The Hustle board is opening soon in Senegambia.")}>Browse board</button></div>
        {["Cook for a player", "Help decorate a home", "Drive someone across town"].map((job) => <div className="ll-hustle-row" key={job}><span>{job}</span><strong>From D 750</strong></div>)}
      </PhoneApp>;
    }

    if (phoneApp === "daily" || phoneApp === "gems") {
      const isGems = phoneApp === "gems";
      return <PhoneApp title={isGems ? "Gems" : "Daily"} eyebrow={isGems ? "SEARCH" : "REWARDS"}>
        <div className="ll-reward-card"><span>{isGems ? "DAILY GEM SEARCH" : "TODAY'S TASKS"}</span><strong>{isGems ? "Find today's hidden gem" : "Complete small tasks for free Dalasi"}</strong><p>{isGems ? "One clue is hidden around the map each day." : "Tasks reset on your game day."}</p><button onClick={() => { setGame((c) => ({ ...c, money: c.money + (isGems ? 400 : 250) })); notice(isGems ? "You found D 400 in gems rewards." : "Daily task complete: + D 250."); }}>{isGems ? "Search now" : "Claim D 250"}</button></div>
      </PhoneApp>;
    }

    if (phoneApp === "market" || phoneApp === "shop") {
      return <PhoneApp title={phoneApp === "market" ? "Market" : "Shop"} eyebrow={phoneApp === "market" ? "CITY MARKET" : "ITEMS"}><div className="ll-market-grid">{SHOP_ITEMS.map((item) => <div className="ll-market-card" key={item.id}><span>{item.icon}</span><strong>{item.name}</strong><small>{money(item.price)}</small><button onClick={() => buyItem(item)}>Buy</button></div>)}</div></PhoneApp>;
    }

    if (phoneApp === "people" || phoneApp === "social") {
      const list = phoneApp === "people" ? ["Awa", "Lamin", "Fatou", "Ebrima"] : ["New in Senegambia", "Friends", "Dating"];
      return <PhoneApp title={phoneApp === "people" ? "People" : "Social"} eyebrow="COMMUNITY">{list.map((name) => <button className="ll-person-row" key={name} onClick={() => notice("Opening " + name + ".")}><span>{name.slice(0,1)}</span><div><strong>{name}</strong><small>{phoneApp === "people" ? "Nearby · " + location : "Community group"}</small></div><b>›</b></button>)}</PhoneApp>;
    }

    if (phoneApp === "home") {
      return <PhoneApp title="Home" eyebrow="LIVING"><div className="ll-list-card"><strong>{location}</strong><small>Current home · weekly rent D 1,250</small><button onClick={() => setActiveTab("home")}>Open home</button></div><div className="ll-list-card"><strong>Staff</strong><small>No staff hired yet.</small><button onClick={() => notice("Staff unlocks as your home grows.")}>Manage staff</button></div></PhoneApp>;
    }

    if (phoneApp === "cars") {
      return <PhoneApp title="Cars" eyebrow="TRANSPORT"><div className="ll-list-card"><strong>Walk / shared ride</strong><small>Free or low-cost travel around Senegambia.</small><button onClick={() => setActiveTab("map")}>Go to map</button></div><div className="ll-list-card"><strong>Own a car</strong><small>Buy later and cut your long-trip costs.</small><button onClick={() => notice("Vehicle store is coming next.")}>Browse</button></div></PhoneApp>;
    }

    if (phoneApp === "business") {
      return <PhoneApp title="Business" eyebrow="BUILD"><div className="ll-list-card"><strong>Start something of your own</strong><small>Businesses settle daily but cost capital to own.</small><button onClick={() => notice("Business management opens after you build enough capital.")}>View options</button></div></PhoneApp>;
    }

    if (phoneApp === "skills") {
      return <PhoneApp title="Skills" eyebrow="PROGRESS">{["Charisma", "Coding", "Finance", "Creativity", "Hustle"].map((skill, index) => <div className="ll-skill-row" key={skill}><span>{skill}</span><strong>{index === 0 ? 2 : 0}</strong><i><em style={{ width: (index === 0 ? 20 : 5) + "%" }} /></i></div>)}</PhoneApp>;
    }

    if (phoneApp === "profile") {
      return <PhoneApp title="Profile" eyebrow="SIM"><div className="ll-profile-card"><div className="ll-profile-avatar">{playerName.slice(0,1).toUpperCase()}</div><div><strong>{playerName}</strong><span>{location} · {profile?.traitOne || "Resourceful"}</span><small>{profile?.bio || "Building a life in Senegambia."}</small></div></div><div className="ll-list-card"><strong>Dream</strong><small>{dream}</small></div><div className="ll-list-card"><strong>Birth lottery</strong><small>{profile?.birth || "Assigned start"}</small></div></PhoneApp>;
    }

    if (phoneApp === "settings") {
      return <PhoneApp title="Settings" eyebrow="GAME"><button className="ll-settings-row" onClick={() => notice("Notifications toggled.")}>Notifications <b>On</b></button><button className="ll-settings-row" onClick={() => notice("Game saves locally while the real account service is pending.")}>Save data <b>Local</b></button><button className="ll-settings-row" onClick={() => notice("Account settings are ready for the real backend.")}>Account <b>{session?.username || "player"}</b></button></PhoneApp>;
    }

    return <PhoneApp title="App" eyebrow="SENEGAMBIA"><div className="ll-list-card"><strong>Coming next</strong><small>This phone app is already wired into the HUD and can grow into the persistent game service.</small></div></PhoneApp>;
  };

  function PhoneApp({ title, eyebrow, children }) {
    return (
      <>
        <div className="ll-phone-head">
          <button className="ll-phone-back" onClick={appBack}>‹</button>
          <div><span className="ll-kicker">{eyebrow}</span><h2>{title}</h2></div>
          <span>{formatGameTime(game.gameMinutes)}</span>
        </div>
        <div className="ll-phone-app-body">{children}</div>
      </>
    );
  }

  return (
    <div className="ll-game-hud">
      <header className="ll-topbar">
        <div className="ll-player-chip">
          <div className="ll-avatar">{playerName.slice(0,1).toUpperCase()}</div>
          <div><strong>{playerName}</strong><small>{location} · {profile?.traitOne || "Resourceful"}</small></div>
        </div>
        <div className="ll-top-stats">
          <span>{formatGameTime(game.gameMinutes)}</span>
          <span><i />{game.mood}</span>
          <span>● 79k online</span>
          <strong>{money(game.money)}</strong>
        </div>
      </header>

      <div className="ll-game-scene">
        <div className="ll-scene-sky" />
        <div className="ll-scene-ground" />
        <div className="ll-scene-tree ll-tree-one" />
        <div className="ll-scene-tree ll-tree-two" />
        <div className="ll-scene-road" />
        <div className="ll-scene-home" />
        <div className="ll-scene-person"><div className="head">{playerName.slice(0,1)}</div><div className="body" /></div>
        <span className="ll-scene-caption">{activeTab === "map" ? "Senegambia map" : location}</span>
      </div>

      <main className="ll-main-content">
        {activeTab === "home" && renderHome()}
        {activeTab === "buy" && renderBuy()}
        {activeTab === "map" && renderMap()}
        {activeTab === "phone" && (
          <section className="ll-phone-shell">
            <div className="ll-phone-frame">
              <div className="ll-phone-status"><span>9:41</span><span>▮▮▮ ◉</span></div>
              <div className="ll-phone-screen">
                {phoneApp ? renderPhoneApp() : renderPhoneHome()}
              </div>
            </div>
            <button className="ll-phone-close" onClick={closePhone}>Close phone</button>
          </section>
        )}
      </main>

      <nav className="ll-bottom-nav" aria-label="Game navigation">
        {NAV.map(([key, icon, label]) => (
          <button key={key} className={activeTab === key ? "active" : ""} onClick={() => key === "phone" ? openPhone() : setActiveTab(key)}>
            <span>{icon}</span><small>{label}</small>
          </button>
        ))}
      </nav>

      <div className="ll-current-job-pill">
        <span>{game.job}</span><b>{game.performance}%</b>
      </div>
    </div>
  );
}
