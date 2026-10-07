import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const places = [
  { icon: "🎶", name: "Kora & Mbalax Live", x: 390.6, y: 103.7 },
  { icon: "⚽", name: "Match Day Viewing", x: 577.5, y: 132.1 },
  { icon: "🍲", name: "Domoda Spot", x: 472.4, y: 237.1 },
  { icon: "💻", name: "Gambia Tech Hub", x: 872.9, y: 147 },
  { icon: "🧺", name: "Serrekunda Market", x: 275.2, y: 532.2 },
  { icon: "🏛️", name: "Arch 22 Square", x: 456.8, y: 777.3 },
  { icon: "🏋️", name: "Fajara Club Gym", x: 673.8, y: 530 },
  { icon: "🏢", name: "Kairaba Office District", x: 457.4, y: 611.7 },
  { icon: "🪩", name: "Calypso Nightlife", x: 867.4, y: 520.5 },
  { icon: "🌿", name: "Makasutu Nature Walk", x: 1084.8, y: 523.2 },
  { icon: "🛍️", name: "Kololi Shopping Centre", x: 1016.4, y: 733.8 },
  { icon: "📚", name: "National Library", x: 771.8, y: 631.1 },
  { icon: "🏖️", name: "Kololi Beach", x: 1163, y: 946 },
  { icon: "🏥", name: "Edward Francis Small Teaching Hospital", x: 1188, y: 132.7 },
  { icon: "💇🏾‍♀️", name: "Awa's Beauty Spot", x: 554.1, y: 244.4 },
  { icon: "🕯️", name: "Senegambia Rooftop", x: 863.5, y: 700.2 },
  { icon: "🚓", name: "Gambia Police Station", x: 88.1, y: 618.7 },
  { icon: "⛪", name: "St. Mary's Cathedral", x: 137.7, y: 208.4 },
  { icon: "🕌", name: "Pipeline Mosque", x: 127.1, y: 503.2 },
  { icon: "📻", name: "West Coast Radio", x: 506.4, y: 7.1 },
  { icon: "🗳️", name: "Polling Station", x: 72.7, y: 714.7 },
  { icon: "🏨", name: "Coco Ocean Resort", x: 625.7, y: 683.2 },
  { icon: "🚘", name: "Gambia Motors", x: 339.9, y: 645.4 },
  { icon: "⛵", name: "River Gambia Cruise", x: 729.2, y: 404.7 },
  { icon: "⛳", name: "Fajara Club & Golf Course", x: 1178.5, y: 718.9 },
  { icon: "⚖️", name: "High Court of The Gambia", x: 566.4, y: 548.4 },
  { icon: "🎓", name: "University of The Gambia", x: 1034, y: 180.5 },
  { icon: "🎰", name: "Casino Senegambia", x: 291.3, y: 762.9 },
  { icon: "🫶🏾", name: "KMC Creative Hub", x: 724.4, y: 121.6 },
  { icon: "🏟️", name: "Independence Stadium", x: 644.1, y: 11.7 }
];

function Logo() {
  const clipId = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className="brand-mark" role="img" aria-label="Senegambia Way">
      <path
        d="M32 4C20.9 4 12 12.4 12 22.8c0 12.8 9.8 23.5 20 35.2 10.2-11.7 20-22.4 20-35.2C52 12.4 43.1 4 32 4Z"
        fill="#fff"
        stroke="#0C1C8C"
        strokeWidth="2.2"
      />
      <defs>
        <clipPath id={`senegambia-logo-${clipId}`}>
          <circle cx="32" cy="25" r="15.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#senegambia-logo-${clipId})`}>
        <rect x="15" y="9" width="34" height="11.5" fill="#CE1126" />
        <rect x="15" y="20.5" width="34" height="10" fill="#0C1C8C" />
        <rect x="15" y="30.5" width="34" height="11.5" fill="#3A7728" />
        <rect x="15" y="19.3" width="34" height="1.2" fill="#fff" />
        <rect x="15" y="29.3" width="34" height="1.2" fill="#fff" />
        <path
          d="M31 8c-3.2 8.1 4.6 11.4 0 17.2-4.6 5.8 3 9.8 0 17.8"
          fill="none"
          stroke="#fff"
          strokeWidth="2.1"
          strokeLinecap="round"
          opacity=".95"
        />
      </g>
      <circle cx="32" cy="25" r="15.5" fill="none" stroke="#fff" strokeWidth="1.1" opacity=".85" />
      <circle cx="32" cy="13.5" r="2.5" fill="#fff" stroke="#0C1C8C" strokeWidth="1.1" />
    </svg>
  );
}

function SocialIcon({ kind }) {
  const paths = {
    X: "M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z",
    IN: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={paths[kind]} /></svg>;
}

function App() {
  const query = new URLSearchParams(window.location.search);
  const previewMode = query.get("preview") === "1" || query.get("guest") === "1";

  const [cookieOpen, setCookieOpen] = useState(() => {
    try {
      return !localStorage.getItem("senegambia-cookie-choice");
    } catch {
      return true;
    }
  });
  const [auth, setAuth] = useState(() => {
    if (previewMode) return null;
    const authParam = query.get("auth");
    return authParam === "login" || authParam === "signup" ? authParam : null;
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [notice, setNotice] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [guestMode, setGuestMode] = useState(() => {
    if (previewMode) return true;
    try {
      return localStorage.getItem("senegambia-guest") === "1";
    } catch {
      return false;
    }
  });
  const [offline, setOffline] = useState(!navigator.onLine);
  const [booting, setBooting] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    username: "",
    recoveryEmail: "",
    password: "",
    age18: false
  });
  const [authError, setAuthError] = useState("");
  const [mapView, setMapView] = useState({ x: 0, y: 0, zoom: 1 });
  const [dragging, setDragging] = useState(false);

  const mapMarkers = useMemo(() => places, []);
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mapMarkers.slice(0, 8);
    return mapMarkers.filter((place) => place.name.toLowerCase().includes(q)).slice(0, 10);
  }, [mapMarkers, searchQuery]);

  const pointers = React.useRef(new Map());
  const dragState = React.useRef(null);
  const pinchState = React.useRef(null);
  const worldRef = React.useRef(null);

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setBooting(false), 520);
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    const handleKeyDown = (event) => {
      if (event.key === "/" && !auth && !searchOpen && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        setSearchOpen(true);
        window.setTimeout(() => document.getElementById("place-search")?.focus(), 0);
      }
      if (event.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        else if (auth) closeAuth();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(bootTimer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [auth, searchOpen]);

  const persistCookieChoice = (choice) => {
    try {
      localStorage.setItem("senegambia-cookie-choice", choice);
    } catch {}
    setCookieOpen(false);
  };

  const startGuest = () => {
    setGuestMode(true);
    try {
      localStorage.setItem("senegambia-guest", "1");
      localStorage.removeItem("senegambia-session");
    } catch {}
    closeAuth();
    showNotice("Guest mode enabled on this device.");
  };

  const clampZoom = (zoom) => Math.min(2.6, Math.max(1, zoom));

  const clampView = (x, y, zoom) => {
    const rect = worldRef.current?.getBoundingClientRect();
    if (!rect) return { x, y, zoom };

    const overscroll = 28;
    const minX = rect.width - rect.width * zoom - overscroll;
    const maxX = overscroll;
    const minY = rect.height - rect.height * zoom - overscroll;
    const maxY = overscroll;

    return {
      x: zoom === 1 ? 0 : Math.min(maxX, Math.max(minX, x)),
      y: zoom === 1 ? 0 : Math.min(maxY, Math.max(minY, y)),
      zoom
    };
  };

  const showNotice = (message) => {
    setNotice(message);
    window.clearTimeout(window.__senegambiaNotice);
    window.__senegambiaNotice = window.setTimeout(() => setNotice(null), 2200);
  };

  const zoomAt = (clientX, clientY, direction) => {
    const rect = worldRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMapView((current) => {
      const pointerX = clientX - rect.left;
      const pointerY = clientY - rect.top;
      const factor = direction > 0 ? 1.12 : 0.89;
      const nextZoom = clampZoom(current.zoom * factor);

      if (nextZoom === current.zoom) return current;

      const worldPointX = (pointerX - current.x) / current.zoom;
      const worldPointY = (pointerY - current.y) / current.zoom;
      const nextX = pointerX - worldPointX * nextZoom;
      const nextY = pointerY - worldPointY * nextZoom;

      return clampView(nextX, nextY, nextZoom);
    });
  };

  const resetMap = () => setMapView({ x: 0, y: 0, zoom: 1 });

  const focusPlace = (place, zoom = 1.55) => {
    const rect = worldRef.current?.getBoundingClientRect();
    if (!rect) return;

    const targetX = rect.width * (place.x / 1440);
    const targetY = rect.height * (place.y / 1000);
    const nextX = rect.width / 2 - targetX * zoom;
    const nextY = rect.height / 2 - targetY * zoom;

    setSelectedPlace(place);
    setMapView(clampView(nextX, nextY, zoom));
    closeSearch();
  };

  const openAuth = (mode) => {
    if (previewMode) {
      showNotice("Guest preview is already open — no account is required.");
      return;
    }
    setAuth(mode);
    setAuthError("");
    setSearchOpen(false);
    setAuthForm({ name: "", username: "", recoveryEmail: "", password: "", age18: false });
  };

  const closeAuth = () => {
    setAuth(null);
    setAuthError("");
  };

  const submitAuth = () => {
    const identifier = authForm.username.trim();
    const password = authForm.password;

    if (auth === "signup") {
      if (!authForm.name.trim()) {
        setAuthError("Add your name to continue.");
        return;
      }
      if (!/^[A-Za-z0-9_]{3,20}$/.test(identifier)) {
        setAuthError("Username must be 3–20 letters, numbers or underscores.");
        return;
      }
      if (!authForm.age18) {
        setAuthError("Confirm that you are 18 or older to continue.");
        return;
      }
      if (authForm.recoveryEmail && !/^\S+@\S+\.\S+$/.test(authForm.recoveryEmail.trim())) {
        setAuthError("Enter a valid recovery email or leave it blank.");
        return;
      }
    } else if (!identifier) {
      setAuthError("Enter your username or email.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Use at least 6 characters for the password.");
      return;
    }

    try {
      localStorage.setItem("senegambia-session", JSON.stringify({
        displayName: auth === "signup" ? authForm.name.trim() : identifier,
        username: identifier,
        mode: "preview",
        createdAt: new Date().toISOString()
      }));
      localStorage.removeItem("senegambia-guest");
    } catch {}

    setGuestMode(false);
    closeAuth();
    showNotice(auth === "signup"
      ? "Account preview created on this device."
      : "Signed in to the local account preview.");
  };

  const openSearch = () => {
    setSearchOpen(true);
    setSearchQuery("");
    window.setTimeout(() => document.getElementById("place-search")?.focus(), 0);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const onMapWheel = (event) => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 1 : -1);
  };

  const onMapPointerDown = (event) => {
    if (event.button !== 0 && event.pointerType !== "touch" && event.pointerType !== "pen") return;

    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size === 2) {
      const values = [...pointers.current.values()];
      const first = values[0];
      const second = values[1];
      const midpoint = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2
      };
      const rect = worldRef.current?.getBoundingClientRect();
      if (rect) {
        pinchState.current = {
          distance: Math.hypot(second.x - first.x, second.y - first.y),
          midpoint,
          zoom: mapView.zoom,
          worldPoint: {
            x: (midpoint.x - rect.left - mapView.x) / mapView.zoom,
            y: (midpoint.y - rect.top - mapView.y) / mapView.zoom
          }
        };
      }
      dragState.current = null;
      setDragging(false);
      event.currentTarget.setPointerCapture?.(event.pointerId);
      return;
    }

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: mapView.x,
      originY: mapView.y
    };

    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onMapPointerMove = (event) => {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }

    if (pointers.current.size >= 2 && pinchState.current) {
      const values = [...pointers.current.values()];
      const first = values[0];
      const second = values[1];
      const currentDistance = Math.hypot(second.x - first.x, second.y - first.y);
      const currentMidpoint = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2
      };
      const rect = worldRef.current?.getBoundingClientRect();
      if (!rect) return;

      const nextZoom = clampZoom(
        pinchState.current.zoom * (currentDistance / Math.max(1, pinchState.current.distance))
      );
      const nextX = currentMidpoint.x - rect.left - pinchState.current.worldPoint.x * nextZoom;
      const nextY = currentMidpoint.y - rect.top - pinchState.current.worldPoint.y * nextZoom;

      setMapView(clampView(nextX, nextY, nextZoom));
      return;
    }

    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setMapView((current) =>
      clampView(
        drag.originX + event.clientX - drag.startX,
        drag.originY + event.clientY - drag.startY,
        current.zoom
      )
    );
  };

  const onMapPointerEnd = (event) => {
    pointers.current.delete(event.pointerId);

    if (pointers.current.size < 2) {
      pinchState.current = null;
    }
    if (pointers.current.size === 0) {
      dragState.current = null;
      setDragging(false);
    }
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
  };

  const onMapDoubleClick = (event) => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, 1);
  };

  const onMapKeyDown = (event) => {
    if (event.key === "0") {
      event.preventDefault();
      resetMap();
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      const rect = worldRef.current?.getBoundingClientRect();
      if (rect) zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      const rect = worldRef.current?.getBoundingClientRect();
      if (rect) zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, -1);
    }
  };

  const stopMapPointer = (event) => {
    event.stopPropagation();
  };

  return (
    <main className="app-shell">
      <section className="world" ref={worldRef}>
        <div
          className={"map-interaction" + (dragging ? " is-dragging" : "")}
          tabIndex={0}
          role="application"
          aria-label="Interactive Senegambia Way world map. Drag to pan, scroll or pinch to zoom, and press 0 to reset."
          onWheel={onMapWheel}
          onPointerDown={onMapPointerDown}
          onPointerMove={onMapPointerMove}
          onPointerUp={onMapPointerEnd}
          onPointerCancel={onMapPointerEnd}
          onDoubleClick={onMapDoubleClick}
          onKeyDown={onMapKeyDown}
        >
          <div
            className="map-scene"
            style={{
              transform:
                "translate3d(" +
                mapView.x +
                "px," +
                mapView.y +
                "px,0) scale(" +
                mapView.zoom +
                ")"
            }}
          >
            <div className="world-art" aria-hidden="true">
              <svg className="world-svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#64bae8" />
                    <stop offset="1" stopColor="#4aa6d6" />
                  </linearGradient>
                  <linearGradient id="sand" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#efe4b9" />
                    <stop offset="1" stopColor="#e2d29b" />
                  </linearGradient>
                  <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#16324b" floodOpacity=".18" />
                  </filter>
                </defs>
                <rect width="1200" height="800" fill="url(#water)" />
                <g opacity=".35">
                  <path d="M40 90C200 70 300 96 405 86S650 105 810 88s235 4 350-10" fill="none" stroke="#bce3f4" strokeWidth="4" />
                  <path d="M30 700C170 680 310 695 460 690s280 18 420 2 225-6 300-18" fill="none" stroke="#bce3f4" strokeWidth="3" />
                </g>
                <path d="M0 86 C180 40 328 76 430 88 C550 101 601 80 704 96 C810 112 900 93 1010 78 C1080 68 1140 73 1200 56 L1200 800 L0 800 Z" fill="url(#sand)" filter="url(#soft-shadow)" />
                <path d="M1020 0 C1072 62 1080 138 1057 202 C1031 274 1070 327 1128 379 C1160 407 1170 461 1146 520 C1120 580 1128 646 1200 691 L1200 0Z" fill="#2f93bf" opacity=".55" />
                <path d="M0 564 C100 520 196 510 275 550 C350 588 422 625 500 618 C608 609 712 564 807 578 C915 592 1006 659 1200 634 L1200 800 L0 800Z" fill="#d9c88e" opacity=".72" />
                <g fill="none" strokeLinecap="round">
                  <path d="M130 110 C235 172 283 235 338 305 S442 405 504 470 S640 573 770 628 S978 699 1120 742" stroke="#f4f0dd" strokeWidth="18" opacity=".9" />
                  <path d="M140 113 C245 175 288 239 343 309 S448 410 510 476 S650 581 777 635 S982 705 1128 748" stroke="#cbbf98" strokeWidth="3" />
                  <path d="M225 52 C278 138 348 180 420 212 S577 280 671 326 S828 421 927 452" stroke="#f4f0dd" strokeWidth="11" opacity=".9" />
                  <path d="M18 320 C146 310 208 331 292 368 S438 435 562 420 S747 360 855 349 S1021 389 1191 360" stroke="#f4f0dd" strokeWidth="12" opacity=".9" />
                  <path d="M392 16 C394 128 438 206 489 275 S570 413 605 532 S653 684 718 790" stroke="#f4f0dd" strokeWidth="9" opacity=".86" />
                  <path d="M780 10 C759 103 755 184 788 263 S871 387 884 488 S863 657 905 798" stroke="#f4f0dd" strokeWidth="8" opacity=".82" />
                </g>
                <g fill="#f7f4df" stroke="#c0b58e" strokeWidth="2" opacity=".92">
                  <rect x="80" y="120" width="120" height="72" rx="12" />
                  <rect x="267" y="250" width="136" height="88" rx="14" />
                  <rect x="540" y="105" width="122" height="76" rx="14" />
                  <rect x="718" y="268" width="164" height="102" rx="18" />
                  <rect x="470" y="505" width="152" height="86" rx="16" />
                  <rect x="940" y="468" width="170" height="100" rx="18" />
                  <rect x="838" y="650" width="144" height="80" rx="15" />
                </g>
                <g fill="#6baa65" opacity=".55">
                  <circle cx="190" cy="132" r="54" />
                  <circle cx="326" cy="300" r="40" />
                  <circle cx="612" cy="126" r="46" />
                  <circle cx="792" cy="314" r="58" />
                  <circle cx="998" cy="518" r="66" />
                  <circle cx="880" cy="684" r="56" />
                </g>
              </svg>
            </div>

            <div className="place-layer">
              {mapMarkers.map((place) => {
                const left = (place.x / 1440) * 100 + "%";
                const top = (place.y / 1000) * 100 + "%";
                const active = selectedPlace?.name === place.name;
                return (
                  <div className={"place-anchor" + (active ? " is-active" : "")} style={{ left, top }} key={place.name}>
                    <button
                      className="place-tag"
                      title={place.name}
                      aria-label={place.name}
                      onPointerDown={stopMapPointer}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedPlace(active ? null : place);
                      }}
                    >
                      <span className="place-icon">{place.icon}</span>
                      <span className="place-label">{place.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="map-vignette" aria-hidden="true" />

        {previewMode && guestMode && (
          <div className="preview-badge" aria-label="Guest preview mode">
            <span>Guest preview</span>
            <button onClick={() => openAuth("login")}>Sign in</button>
          </div>
        )}

        <div className="safe-top">
          <div className="top-stack">
            <div className="top-panel panel">
              <Logo />
              <span className="brand-name">Senegambia Way</span>
              <div className="desktop-stats">
                <span className="online"><i /> 79k online</span>
                <span>👀 17565k visits</span>
              </div>
              <button className="btn btn-green header-btn" onClick={() => openAuth("signup")}>Sign up</button>
              <button className="btn btn-mist header-btn" onClick={() => openAuth("login")}>Log in</button>
            </div>

            <div className="mobile-stats">
              <span><i /> 79k online now</span>
              <span>👀 17565k visits</span>
            </div>

            <div className="chip-scroll">
              <div className="chip-row">
                <button className="pill panel" onClick={() => focusPlace(places.find((place) => place.name === "Arch 22 Square"))}>🏛️ Government</button>
                <button className="pill panel" onClick={() => focusPlace(places.find((place) => place.name === "Kololi Beach"))}>🌊 Coastal Plots</button>
                <button className="pill panel" onClick={() => focusPlace(places.find((place) => place.name === "Kairaba Office District"))}>🏘️ 400 homes</button>
              </div>
            </div>

            <button className="week-banner" onClick={() => showNotice("NAWEC watch: weekly power updates will be connected to live data later.")}>💡 NAWEC power watch this week</button>
          </div>
        </div>

        {booting && (
          <div className="boot-screen" role="status" aria-label="Loading Senegambia Way">
            <div className="boot-card panel">
              <div className="boot-mark"><Logo /></div>
              <strong>Senegambia Way</strong>
              <span>Loading the world…</span>
            </div>
          </div>
        )}

        <div className="map-hint panel">
          <span className="map-hint-gesture">✥</span>
          <span>Drag · pinch · scroll</span>
          <button type="button" onClick={openSearch}>Find</button>
          {mapView.zoom > 1 && <button type="button" onClick={resetMap}>Reset</button>}
        </div>

        {selectedPlace && (
          <div className="place-popover panel">
            <div className="place-popover-icon">{selectedPlace.icon}</div>
            <div className="place-popover-copy">
              <strong>{selectedPlace.name}</strong>
              <span>Explore this location on the interactive world.</span>
            </div>
            <div className="place-popover-actions">
              <button className="place-focus" onClick={() => focusPlace(selectedPlace)}>Center</button>
              <button aria-label="Close" className="popover-close" onClick={() => setSelectedPlace(null)}>×</button>
            </div>
          </div>
        )}

        <div className="safe-bottom">
          <div className="bottom-panel panel">
            <div className="players-row">
              <div className="avatars" aria-hidden="true">
                <span className="avatar avatar-a">S</span>
                <span className="avatar avatar-b">A</span>
                <span className="avatar avatar-c">M</span>
              </div>
              <div className="player-copy"><b>79k Gambians</b> playing right now · free</div>
            </div>

            <div className="action-grid">
              <button className="btn btn-green primary-action" onClick={() => openAuth("signup")}>Sign up free</button>
              <button className="btn btn-white secondary-action" onClick={() => openAuth("login")}>Log in</button>
            </div>

            <div className="social-row">
              <button className="official-pill" onClick={() => showNotice("This is an official Senegambia Way channel.")}>
                <span className="verified">✓</span> Official
              </button>
              <button className="social-button" aria-label="X" onClick={() => window.open("https://x.com/intent/post?text=Explore%20Senegambia%20Way%20%E2%80%94%20a%20Gambian%20world&url=" + encodeURIComponent(window.location.href), "_blank", "noopener,noreferrer")}><SocialIcon kind="X" /></button>
              <button className="social-button" aria-label="TikTok" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => showNotice("Link copied. Share Senegambia Way anywhere."), () => showNotice("Copy this page URL to share Senegambia Way."))}>♪</button>
              <button className="social-button" aria-label="Instagram" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => showNotice("Link copied. Share Senegambia Way anywhere."), () => showNotice("Copy this page URL to share Senegambia Way."))}>◎</button>
              <button className="social-button" aria-label="LinkedIn" onClick={() => navigator.share?.({title:"Senegambia Way",text:"Explore Senegambia Way",url:window.location.href}).catch(() => {}) || navigator.clipboard?.writeText(window.location.href).then(() => showNotice("Link copied. Share Senegambia Way anywhere."), () => showNotice("Copy this page URL to share Senegambia Way."))}><SocialIcon kind="IN" /></button>
            </div>
          </div>
        </div>

        {cookieOpen && (
          <div className="cookie safe-bottom" role="dialog" aria-label="Cookies">
            <div className="cookie-panel panel">
              <div className="cookie-copy">
                <span className="cookie-emoji">🍪</span>
                <p>We use a cookie to keep you signed in, and another to count visits. No ad trackers, ever. <button onClick={() => showNotice("Cookie choices stay on this device. No optional ad trackers are enabled.")}>Privacy</button></p>
              </div>
              <div className="cookie-actions">
                <button className="btn btn-mist" onClick={() => persistCookieChoice("essential")}>Essential only</button>
                <button className="btn btn-green" onClick={() => persistCookieChoice("accepted")}>Accept</button>
              </div>
            </div>
          </div>
        )}

        {notice && <div className="toast">{notice}</div>}

        {searchOpen && (
          <div className="search-backdrop" onClick={closeSearch}>
            <section className="search-panel panel" onClick={(event) => event.stopPropagation()}>
              <div className="search-head">
                <div>
                  <p className="eyebrow">Explore Senegambia</p>
                  <h2>Find a place</h2>
                </div>
                <button className="popover-close" aria-label="Close search" onClick={closeSearch}>×</button>
              </div>
              <input
                id="place-search"
                className="place-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search market, beach, hospital…"
                autoComplete="off"
              />
              <div className="search-results">
                {searchResults.map((place) => (
                  <button key={place.name} className="search-result" onClick={() => focusPlace(place)}>
                    <span>{place.icon}</span>
                    <strong>{place.name}</strong>
                    <small>Center on map</small>
                  </button>
                ))}
                {!searchResults.length && <div className="search-empty">No places match “{searchQuery}”.</div>}
              </div>
            </section>
          </div>
        )}

        {offline && (
          <div className="offline-banner" role="status">
            <span>Offline mode</span>
            <small>The map stays available. Live account features may wait for a connection.</small>
          </div>
        )}
      </section>

      {auth && !previewMode && (
        <div className="auth-screen" role="dialog" aria-modal="true" aria-label={auth === "signup" ? "Create account" : "Sign in"}>
          <button className="auth-scrim-close" aria-label="Close authentication" onClick={closeAuth}>×</button>

          <section className="auth-page panel">
            <div className="auth-page-stripe" aria-hidden="true" />

            <div className="auth-brand">
              <div className="auth-mark"><Logo /></div>
              <div>
                <p className="eyebrow">Senegambia Way</p>
                <strong>Live your Gambian story</strong>
              </div>
            </div>

            <div className="auth-head">
              <h1>{auth === "signup" ? "Create your account" : "Welcome back"}</h1>
              <p>
                {auth === "signup"
                  ? "Set up your Senegambia Way account. Email is optional and can be used for password recovery."
                  : "Sign in to continue your Sim, save and place in the world."}
              </p>
            </div>

            <div className="auth-switch" role="tablist" aria-label="Authentication">
              <button className={auth === "login" ? "is-active" : ""} onClick={() => openAuth("login")}>Log in</button>
              <button className={auth === "signup" ? "is-active" : ""} onClick={() => openAuth("signup")}>Sign up</button>
            </div>

            {auth === "signup" && (
              <>
                <label>
                  Username
                  <input
                    value={authForm.username}
                    onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))}
                    autoComplete="username"
                    placeholder="Choose a username"
                  />
                </label>

                <label>
                  Display name
                  <input
                    value={authForm.name}
                    onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                    autoComplete="name"
                    placeholder="What other players see"
                  />
                </label>

                <label>
                  Email <span className="optional">optional</span>
                  <input
                    value={authForm.recoveryEmail}
                    onChange={(event) => setAuthForm((current) => ({ ...current, recoveryEmail: event.target.value }))}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                  />
                </label>
              </>
            )}

            {auth === "login" && (
              <label>
                Username or email
                <input
                  value={authForm.username}
                  onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))}
                  autoComplete="username"
                  placeholder="Username or email"
                />
              </label>
            )}

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete={auth === "signup" ? "new-password" : "current-password"}
                placeholder="Password"
              />
            </label>

            {auth === "signup" && (
              <label className="age-check">
                <input
                  type="checkbox"
                  checked={authForm.age18}
                  onChange={(event) => setAuthForm((current) => ({ ...current, age18: event.target.checked }))}
                />
                <span>I confirm I am 18 or older and agree to the account terms.</span>
              </label>
            )}

            {authError && <div className="auth-error" role="alert">{authError}</div>}

            <button className="btn btn-green auth-submit" onClick={submitAuth}>
              {auth === "signup" ? "Sign up" : "Log in"}
            </button>

            {auth === "login" && (
              <button className="auth-link" onClick={() => showNotice("Password reset starts with the username or email linked to the account.")}>
                Forgot password?
              </button>
            )}

            <div className="auth-divider"><span>or</span></div>

            <button className="guest-button" onClick={startGuest}>
              <strong>Play offline</strong>
              <span>No account · save stays on this device</span>
            </button>

            <p className="auth-footnote">
              {auth === "signup" ? "Already have an account?" : "New to Senegambia Way?"}{" "}
              <button className="auth-link-inline" onClick={() => openAuth(auth === "signup" ? "login" : "signup")}>
                {auth === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
