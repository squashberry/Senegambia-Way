import React, { useEffect, useMemo, useState } from "react";

const NAV = [
  ["home", "⌂", "Home"],
  ["map", "⌖", "Map"],
  ["phone", "◫", "Phone"]
];

const STARTER_ACTIONS = [
  ["work", "Go to work", "Find a shift and start earning."],
  ["eat", "Eat something", "Restore hunger before your day gets busy."],
  ["rest", "Rest", "Recover energy at home."],
  ["outside", "Go outside", "Step into the neighbourhood."],
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function GameUI({ session, profile, activeTab, setActiveTab, onNotice }) {
  const [clock, setClock] = useState(() => new Date());
  const [mood, setMood] = useState("Very Happy");
  const [stats, setStats] = useState({ energy: 86, hunger: 72, happiness: 91 });
  const [phonePanel, setPhonePanel] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setPhonePanel(activeTab === "phone");
  }, [activeTab]);

  const location = profile?.home || "Serrekunda";
  const dream = profile?.dream || "Build a business";
  const playerName = profile?.nickname || session?.displayName || "Gambian Player";

  const money = useMemo(() => {
    const birthBonus = profile?.birth === "Connected family" ? 800 : 450;
    return 2450 + birthBonus;
  }, [profile?.birth]);

  const doAction = (type) => {
    const next = { ...stats };

    if (type === "eat") {
      next.hunger = Math.min(100, next.hunger + 24);
      setMood("Happy");
      onNotice("You had a quick meal. Hunger restored.");
    } else if (type === "rest") {
      next.energy = Math.min(100, next.energy + 25);
      setMood("Relaxed");
      onNotice("You rested at home. Energy restored.");
    } else if (type === "work") {
      setMood("Focused");
      onNotice("Your starter shift is ready. Job system is next.");
    } else {
      setMood("Excited");
      onNotice("You stepped outside. Explore the map to choose where to go.");
      setActiveTab("map");
    }

    setStats(next);
  };

  return (
    <div className="game-hud" aria-label="Senegambia Way game interface">
      <div className="game-status panel">
        <div className="game-player">
          <div className="game-avatar">{playerName.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{playerName}</strong>
            <small>{location} · {profile?.traitOne || "Resourceful"}</small>
          </div>
        </div>

        <div className="game-status-items">
          <span className="game-time">{clock.toLocaleDateString([], { weekday: "short" })} · {formatTime(clock)}</span>
          <span className="game-mood"><i /> {mood}</span>
          <span>● 79k online</span>
          <strong>D {money.toLocaleString()}</strong>
        </div>
      </div>

      {activeTab === "home" && !phonePanel && (
        <section className="game-context-card panel">
          <div className="game-context-head">
            <div>
              <span className="game-eyebrow">AT HOME · {location.toUpperCase()}</span>
              <h1>Your day in Senegambia</h1>
              <p>Build your life, chase your dream and make the next move.</p>
            </div>
            <span className="game-home-badge">⌂</span>
          </div>

          <div className="game-bars">
            {[
              ["Energy", stats.energy],
              ["Hunger", stats.hunger],
              ["Happiness", stats.happiness]
            ].map(([label, value]) => (
              <div className="game-bar-row" key={label}>
                <div><span>{label}</span><b>{value}%</b></div>
                <i><em style={{ width: value + "%" }} /></i>
              </div>
            ))}
          </div>

          <div className="game-goal">
            <div>
              <span>YOUR DREAM</span>
              <strong>{dream}</strong>
            </div>
            <span className="game-arrow">→</span>
          </div>

          <div className="game-actions">
            {STARTER_ACTIONS.map(([type, label, description]) => (
              <button className="game-action" key={type} onClick={() => doAction(type)}>
                <strong>{label}</strong>
                <span>{description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeTab === "map" && !phonePanel && (
        <section className="game-map-card panel">
          <span className="game-eyebrow">EXPLORE</span>
          <h2>Where are you going?</h2>
          <p>Drag the world, tap a place marker, or use Find to move around Senegambia.</p>
          <div className="game-map-shortcuts">
            <button onClick={() => onNotice("Find is available in the map controls.")}>Find a place</button>
            <button onClick={() => onNotice("Your home is in " + location + ".")}>My home · {location}</button>
          </div>
        </section>
      )}

      {activeTab === "phone" && (
        <section className="game-phone panel">
          <div className="game-phone-head">
            <div>
              <span className="game-eyebrow">PHONE</span>
              <h2>Stay connected</h2>
            </div>
            <button className="game-close-phone" onClick={() => setActiveTab("home")} aria-label="Close phone">×</button>
          </div>

          <div className="game-phone-list">
            <button onClick={() => onNotice("Messages will be connected to the multiplayer layer next.")}>
              <span className="phone-icon">✉</span>
              <div><strong>Messages</strong><small>Talk to friends around Senegambia</small></div>
              <b>›</b>
            </button>
            <button onClick={() => onNotice("Contacts are ready for the social system.")}>
              <span className="phone-icon">◎</span>
              <div><strong>People</strong><small>Friends, neighbours and new connections</small></div>
              <b>›</b>
            </button>
            <button onClick={() => onNotice("Your profile is available from the player chip.")}>
              <span className="phone-icon">◉</span>
              <div><strong>My profile</strong><small>{profile?.nickname || playerName}</small></div>
              <b>›</b>
            </button>
          </div>
        </section>
      )}

      <nav className="game-dock panel" aria-label="Game navigation">
        {NAV.map(([key, icon, label]) => (
          <button
            key={key}
            className={activeTab === key ? "is-active" : ""}
            onClick={() => setActiveTab(key)}
          >
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
