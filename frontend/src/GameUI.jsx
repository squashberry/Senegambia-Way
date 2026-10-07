import React, { useEffect, useMemo, useState } from "react";

const NAV = [
  ["home", "⌂", "Home"],
  ["map", "⌖", "Map"],
  ["phone", "▣", "Phone"]
];

const PHONE_APPS = [
  ["jobs", "Jobs", "▣", "green"],
  ["messages", "Messages", "•••", "blue"],
  ["meet", "Meet Senegambia", "M", "cyan"],
  ["salary", "Salary Index", "SI", "black"],
  ["tickets", "PopOut Tickets", "P", "violet"],
  ["games", "Games", "✦", "blue"],
  ["nollywood", "Kollywood", "N", "green"],
  ["bets", "Bet Tips", "⚽", "red"],
  ["use", "use.live", "◌", "black"],
  ["versian", "versian.com", "V", "white"],
  ["contacts", "Contacts", "☎", "green"],
  ["ride", "Ride", "▰", "gold"],
  ["chow", "Chowdeck", "◒", "coral"],
  ["bank", "Bank", "$", "purple"],
  ["boutique", "Boutique", "⌁", "pink"],
  ["forbes", "Forbes", "♛", "gold"],
  ["houses", "Houses", "⌂", "gold"],
  ["cars", "Cars", "▰", "blue"],
  ["invite", "Invite", "⛓", "link"],
  ["health", "Health", "●", "pink"]
];

const NEEDS = [
  ["Hunger", "hunger"],
  ["Energy", "energy"],
  ["Hygiene", "hygiene"],
  ["Bladder", "bladder"],
  ["Fun", "fun"],
  ["Social", "social"]
];

function cap(n) { return Math.max(0, Math.min(100, Math.round(n))); }
function money(n) { return "D " + Math.round(Math.max(0, n)).toLocaleString(); }
function gameClock(minutes) {
  const mins = ((minutes % 1440) + 1440) % 1440;
  let h = Math.floor(mins / 60);
  const m = String(mins % 60).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(minutes / 1440) % 7];
  return day + " · " + h + ":" + m + " " + ap;
}

function initialState(profile) {
  return {
    minutes: 8 * 60 + 47,
    money: profile?.birth === "Connected family" ? 3250 : 2900,
    mood: "Very Happy",
    needs: { hunger: 76, energy: 84, hygiene: 73, bladder: 92, fun: 78, social: 67 },
    job: "Marketer",
    performance: 51,
    workLeft: 0,
    inventory: [],
    phoneOpen: false,
    phoneApp: null,
    phonePage: 0
  };
}

export default function GameUI({ session, profile, activeTab, setActiveTab, onNotice }) {
  const key = useMemo(() => "senegambia-game-v4:" + (session?.username || "player"), [session?.username]);
  const [game, setGame] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? { ...initialState(profile), ...JSON.parse(saved) } : initialState(profile);
    } catch {
      return initialState(profile);
    }
  });
  const [phoneQuery, setPhoneQuery] = useState("");

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(game)); } catch {}
  }, [game, key]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGame(current => ({
        ...current,
        minutes: current.minutes + 1,
        workLeft: current.workLeft > 0 ? Math.max(0, current.workLeft - 1) : 0,
        needs: Object.fromEntries(Object.entries(current.needs).map(([k, v]) => [
          k, cap(v - (k === "energy" ? 0.09 : 0.06))
        ]))
      }));
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (game.workLeft === 0 && activeTab === "home") {
      // Keep the normal Home view clean when a shift ends.
    }
  }, [game.workLeft, activeTab]);

  const location = profile?.home || "Serrekunda";
  const playerName = profile?.nickname || session?.displayName || "Gambian Player";
  const phoneApps = PHONE_APPS.filter(([id, name]) =>
    !phoneQuery.trim() || name.toLowerCase().includes(phoneQuery.trim().toLowerCase())
  );

  const notify = (message) => onNotice?.(message);

  const performHomeAction = (kind) => {
    const effects = {
      eat: { hunger: 22, fun: 2, minutes: 20, mood: "Happy", message: "You ate at home." },
      sleep: { energy: 34, hunger: -4, bladder: -6, minutes: 120, mood: "Relaxed", message: "You slept and recovered." },
      wash: { hygiene: 32, minutes: 15, mood: "Fresh", message: "Fresh again." },
      fun: { fun: 20, energy: 3, minutes: 20, mood: "Happy", message: "You relaxed at home." }
    }[kind];

    setGame(current => {
      const needs = { ...current.needs };
      Object.entries(effects).forEach(([key, value]) => {
        if (key in needs) needs[key] = cap(needs[key] + value);
      });
      return { ...current, minutes: current.minutes + effects.minutes, mood: effects.mood, needs };
    });
    notify(effects.message);
  };

  const startWork = () => {
    setGame(current => ({ ...current, workLeft: 8 * 60, mood: "Very Happy" }));
    notify("You are now at work · Marketer");
  };

  const work = (type) => {
    const effects = {
      steady: { performance: 6, energy: -4, fun: -2, social: 1, mood: "Very Happy" },
      jaguda: { performance: 10, energy: -9, fun: -6, social: -1, mood: "Focused" },
      chat: { performance: 3, energy: -2, fun: 3, social: 9, mood: "Happy" },
      oga: { performance: 8, energy: -5, social: -2, mood: "Focused" },
      easy: { performance: 1, energy: 2, fun: 1, mood: "Relaxed" }
    }[type];

    setGame(current => ({
      ...current,
      minutes: current.minutes + 30,
      performance: cap(current.performance + effects.performance),
      mood: effects.mood,
      needs: {
        ...current.needs,
        energy: cap(current.needs.energy + (effects.energy || 0)),
        fun: cap(current.needs.fun + (effects.fun || 0)),
        social: cap(current.needs.social + (effects.social || 0))
      }
    }));
  };

  const leaveWork = () => {
    setGame(current => ({ ...current, workLeft: 0, mood: "Okay" }));
    notify("Leave work early (partial pay)");
  };

  const phoneOpen = () => {
    setPhoneQuery("");
    setGame(current => ({ ...current, phoneOpen: true, phoneApp: null }));
    setActiveTab("phone");
  };

  const closePhone = () => {
    setGame(current => ({ ...current, phoneOpen: false, phoneApp: null }));
    setActiveTab("home");
  };

  const openPhoneApp = (id) => {
    setGame(current => ({ ...current, phoneApp: id }));
  };

  const closePhoneApp = () => {
    setGame(current => ({ ...current, phoneApp: null }));
  };

  const buy = (price, id, label) => {
    setGame(current => {
      if (current.money < price) {
        notify("Not enough money.");
        return current;
      }
      if (current.inventory.includes(id)) {
        notify("Already owned.");
        return current;
      }
      return { ...current, money: current.money - price, inventory: [...current.inventory, id] };
    });
    notify(label + " purchased.");
  };

  const renderNeeds = () => (
    <div className="ref-needs-strip">
      {NEEDS.map(([label, key]) => (
        <div className="ref-need" key={key}>
          <div className="ref-need-label"><span>{label}</span><b>{game.needs[key]}</b></div>
          <div className="ref-need-track"><i style={{ width: game.needs[key] + "%" }} /></div>
        </div>
      ))}
    </div>
  );

  const renderWorld = () => (
    <div className={"ref-world " + (game.workLeft > 0 ? "is-work" : "is-home")}>
      <div className="ref-sky" />
      <div className="ref-ground" />
      <div className="ref-road" />
      <div className="ref-sidewalk" />
      <div className="ref-building ref-building-a" />
      <div className="ref-building ref-building-b" />
      <div className="ref-window ref-window-a" />
      <div className="ref-window ref-window-b" />
      <div className="ref-tree ref-tree-a" />
      <div className="ref-tree ref-tree-b" />
      <div className="ref-tree ref-tree-c" />
      <div className="ref-prop prop-chair" />
      <div className="ref-prop prop-bin" />
      <div className="ref-prop prop-table" />
      <div className="ref-player" aria-label={playerName}><span>{playerName.slice(0, 1).toUpperCase()}</span></div>
      <div className="ref-location-tag">{game.workLeft > 0 ? "At work · " + game.job : location + " · Home"}</div>
    </div>
  );

  const renderTopBar = () => (
    <div className="ref-topbar">
      <div className="ref-status-left">
        <span className="ref-mood-dot" />
        <b>{game.mood}</b>
        <small>● 79k online now</small>
      </div>
      <div className="ref-status-right">
        <span>{gameClock(game.minutes)}</span>
        <strong>{money(game.money)}</strong>
        <button aria-label="Top up" onClick={() => notify("Top up will connect to the Senegambia economy.")}>＋</button>
      </div>
    </div>
  );

  const renderHomeOverlay = () => (
    <>
      <div className="ref-home-copy">
        <span className="ref-kicker">HOME</span>
        <strong>{playerName}</strong>
        <small>{location} · {game.mood}</small>
      </div>

      <div className="ref-home-actions">
        <button onClick={() => performHomeAction("eat")}><span>🍲</span><b>Eat</b></button>
        <button onClick={() => performHomeAction("sleep")}><span>🛏</span><b>Sleep</b></button>
        <button onClick={() => performHomeAction("wash")}><span>🚿</span><b>Wash</b></button>
        <button onClick={() => performHomeAction("fun")}><span>♫</span><b>Relax</b></button>
      </div>

      <div className="ref-career-mini">
        <div><span>JOB</span><b>{game.job}</b><small>{money(11600)} / shift</small></div>
        <button onClick={startWork}>Go to work</button>
      </div>
    </>
  );

  const renderMapOverlay = () => (
    <div className="ref-map-overlay">
      <div><span>YOU ARE HERE</span><b>{location}</b><small>Tap a location marker to explore.</small></div>
      <button onClick={() => notify("Tap any place marker on the Senegambia map.")}>Find a place</button>
    </div>
  );

  const renderWorkOverlay = () => (
    <div className="ref-work-panel">
      <div className="ref-work-heading">
        <div><span>AT WORK · {game.job}</span><strong>Work</strong></div>
        <small>Next task · 2m</small>
      </div>
      <div className="ref-performance-head"><span>Performance</span><b>{game.performance}%</b></div>
      <div className="ref-performance"><i style={{ width: game.performance + "%" }} /></div>
      <div className="ref-work-actions">
        <button onClick={() => work("steady")}><b>Do Your Work</b></button>
        <button onClick={() => work("jaguda")}><b>Work Like Jaguda</b></button>
        <button onClick={() => work("chat")}><b>Chat with Colleagues</b></button>
        <button onClick={() => work("oga")}><b>Suck Up to Oga</b></button>
        <button onClick={() => work("easy")}><b>Take Am Easy</b></button>
      </div>
      <button className="ref-leave" onClick={leaveWork}>Leave work early <span>(partial pay)</span></button>
    </div>
  );

  const renderPhoneIcon = ([id, name, glyph, tone]) => (
    <button key={id} className={"ref-phone-app tone-" + tone} onClick={() => openPhoneApp(id)}>
      <span className="ref-app-icon"><b>{glyph}</b>{["messages","meet","salary","tickets","games","nollywood","bets","use","versian","contacts","ride","chow","bank","boutique","forbes","houses","cars","invite","health"].includes(id) && <i>{["jobs","messages","meet","salary","tickets","games","nollywood","bets","use","versian","contacts","ride","chow","bank","boutique","forbes","houses","cars","invite","health"].indexOf(id) > 0 ? "NEW" : ""}</i>}</span>
      <small>{name}</small>
    </button>
  );

  const renderPhoneApp = () => {
    const app = game.phoneApp;
    const data = PHONE_APPS.find(x => x[0] === app);
    const title = data?.[1] || "App";
    const placeholder = {
      jobs: "Career & shifts",
      messages: "Messages & chats",
      bank: "Bank balance & transfers",
      salary: "Salary information",
      contacts: "Your contacts",
      ride: "Travel around Senegambia",
      houses: "Homes & rent",
      cars: "Cars & transport",
      health: "Health & care"
    }[app] || "Senegambia Way";
    return (
      <div className="ref-phone-inner-page">
        <button className="ref-phone-back" onClick={closePhoneApp}>‹</button>
        <div className="ref-phone-page-title">
          <span>{title}</span>
          <small>{placeholder}</small>
        </div>
        {app === "jobs" ? (
          <div className="ref-phone-job-card">
            <small>CURRENT JOB</small><strong>{game.job}</strong><b>{money(11600)} / shift</b><button onClick={startWork}>Go to work</button>
          </div>
        ) : app === "bank" ? (
          <div className="ref-phone-balance"><small>AVAILABLE BALANCE</small><strong>{money(game.money)}</strong><button onClick={() => notify("Bank transfer will connect to the multiplayer economy.")}>Send money</button></div>
        ) : app === "messages" ? (
          <div className="ref-phone-list"><button>Senegambia Welcome <small>Welcome to your new life.</small></button><button>Community <small>New players are joining around Senegambia.</small></button></div>
        ) : (
          <div className="ref-phone-placeholder"><span className="ref-app-icon small">{data?.[2] || "•"}</span><strong>{title}</strong><small>{placeholder}</small></div>
        )}
      </div>
    );
  };

  const renderPhone = () => (
    <div className="ref-phone-backdrop" onClick={closePhone}>
      <div className="ref-phone-frame" onClick={e => e.stopPropagation()}>
        <div className="ref-phone-status">
          <span>{gameClock(game.minutes).split(" · ")[1]}</span>
          <b>••• 4G ▰</b>
        </div>
        <div className="ref-phone-screen">
          {game.phoneApp ? renderPhoneApp() : (
            <>
              <div className="ref-phone-clock">{gameClock(game.minutes).split(" · ")[1]}</div>
              <div className="ref-phone-date">Monday 5 October · Senegambia</div>
              <div className="ref-phone-grid">{phoneApps.slice(0, 20).map(renderPhoneIcon)}</div>
              <div className="ref-phone-dock">
                <span /><span /><span /><span />
              </div>
              <button className="ref-phone-close" onClick={closePhone}>Close</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="reference-game">
      {renderWorld()}
      {renderTopBar()}

      <div className="reference-overlay">
        {activeTab === "home" && game.workLeft === 0 && renderHomeOverlay()}
        {activeTab === "map" && game.workLeft === 0 && renderMapOverlay()}
        {game.workLeft > 0 && renderWorkOverlay()}
        {renderNeeds()}
      </div>

      {game.phoneOpen && renderPhone()}

      <nav className="ref-bottom-nav">
        {NAV.map(([key, icon, label]) => (
          <button key={key} className={activeTab === key ? "active" : ""} onClick={() => key === "phone" ? phoneOpen() : setActiveTab(key)}>
            <span>{icon}</span><small>{label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
