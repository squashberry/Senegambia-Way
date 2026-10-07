import React, { useEffect, useState } from "react";

const STEPS = [
  { title: "Your name", prompt: "What is your full/public name?", kind: "input", key: "nickname", placeholder: "Your public name" },
  { title: "Your shape", prompt: "What kind of build should your Sim have?", kind: "options", key: "shape", options: ["Slim", "Balanced", "Strong"] },
  { title: "Your height", prompt: "How tall are you?", kind: "options", key: "height", options: ["Short", "Average", "Tall"] },
  { title: "Your skin tone", prompt: "Choose the skin tone that feels right for your Sim.", kind: "options", key: "skin", options: ["Deep", "Dark", "Brown", "Light"] },
  { title: "Your hair", prompt: "Pick the hairstyle you want to start with.", kind: "options", key: "hair", options: ["Low cut", "Braids", "Locs", "Curls"] },
  { title: "Your outfit", prompt: "What are you wearing on your first day?", kind: "options", key: "outfit", options: ["Casual", "Boubou", "Workwear", "Streetwear"] },
  { title: "Your fabric", prompt: "Pick the feel of your first outfit.", kind: "options", key: "fabric", options: ["Plain", "Batik", "Woven", "Print"] },
  { title: "Your first trait", prompt: "Which trait fits the way you move through life?", kind: "options", key: "traitOne", options: ["Resourceful", "Social", "Driven", "Chill"] },
  { title: "Your second trait", prompt: "Pick another trait to shape your story.", kind: "options", key: "traitTwo", options: ["Bold", "Creative", "Patient", "Ambitious"] },
  { title: "Your dream", prompt: "What do you want your life to become?", kind: "options", key: "dream", options: ["Build a business", "Top my career", "Become a public figure", "Own a great home"] },
  { title: "Your birth lottery", prompt: "Your starting background is decided once for your account.", kind: "birth", key: "birth" },
  { title: "Your home", prompt: "Where do you want to begin your Gambian story?", kind: "home", key: "home", options: ["Serrekunda", "Bakau", "Fajara", "Brikama"] }
];

const HOME_COPY = {
  Serrekunda: "Busy, practical and close to the everyday hustle.",
  Bakau: "Coastal, lively and full of familiar local life.",
  Fajara: "Calmer, polished and close to the coast.",
  Brikama: "Grounded, growing and full of room to build."
};

const BIRTHS = [
  { name: "Connected family", detail: "A stronger start, useful contacts and a little breathing room." },
  { name: "Hustle start", detail: "Less handed to you, but more room to prove what you can build." }
];

export default function Onboarding({ session, step, setStep, profile, setProfile, onFinish }) {
  const [birthRevealed, setBirthRevealed] = useState(Boolean(profile.birth));

  const current = STEPS[step] || STEPS[0];
  const selected = current.key ? profile[current.key] : "";

  useEffect(() => {
    if (step === 10) {
      setBirthRevealed(Boolean(profile.birth));
    }
  }, [step, profile.birth]);

  const setValue = (key, value) => {
    setProfile((previous) => ({ ...previous, [key]: value }));
  };

  const next = () => {
    if (step === STEPS.length - 1) {
      onFinish();
      return;
    }
    setStep((previous) => Math.min(STEPS.length - 1, previous + 1));
  };

  const back = () => setStep((previous) => Math.max(0, previous - 1));

  const canContinue =
    current.kind === "birth"
      ? birthRevealed
      : Boolean(String(selected || "").trim());

  const revealBirth = () => {
    const result = BIRTHS[Math.floor(Math.random() * BIRTHS.length)];
    setValue("birth", result.name);
    setBirthRevealed(true);
  };

  return (
    <div className="setup-screen" role="dialog" aria-modal="true" aria-label="Senegambia Way setup">
      <section className="setup-card panel">
        <div className="setup-top">
          <button
            className="setup-back"
            onClick={back}
            disabled={step === 0}
            aria-label="Previous step"
          >
            {step === 0 ? "" : "←"}
          </button>
          <div className="setup-counter">{step + 1}/12</div>
          <div className="setup-spacer" />
        </div>

        <div className="setup-progress" aria-hidden="true">
          <span style={{ width: ((step + 1) / STEPS.length) * 100 + "%" }} />
        </div>

        <div className="setup-heading">
          <p>{step + 1}/12 — {current.title}</p>
          <h1>{current.prompt}</h1>
          {step === 0 && <small>Shown to other players in Senegambia Way.</small>}
          {step === 10 && <small>Your birth result is not something you choose or reroll.</small>}
          {step === 11 && <small>Choose where this first chapter begins.</small>}
        </div>

        <div className="setup-content">
          {current.kind === "input" && (
            <label className="setup-input-wrap">
              <span>Public name</span>
              <input
                autoFocus
                value={profile.nickname}
                onChange={(event) => setValue("nickname", event.target.value)}
                placeholder={session?.displayName || current.placeholder}
                maxLength={40}
              />
            </label>
          )}

          {current.kind === "options" && (
            <div className="setup-options">
              {current.options.map((option) => (
                <button
                  key={option}
                  className={"setup-option " + (selected === option ? "is-selected" : "")}
                  onClick={() => setValue(current.key, option)}
                >
                  <span>{option}</span>
                  {selected === option && <b>✓</b>}
                </button>
              ))}
            </div>
          )}

          {current.kind === "birth" && (
            <div className="setup-birth">
              {!birthRevealed ? (
                <>
                  <div className="setup-birth-mark">?</div>
                  <strong>Let the city decide your starting background.</strong>
                  <span>This is assigned once, just like the reference game's birth lottery.</span>
                  <button className="btn btn-green setup-primary" onClick={revealBirth}>Reveal my start</button>
                </>
              ) : (
                <>
                  <div className="setup-birth-mark setup-birth-mark-result">✓</div>
                  <strong>{profile.birth}</strong>
                  <span>{BIRTHS.find((item) => item.name === profile.birth)?.detail || ""}</span>
                </>
              )}
            </div>
          )}

          {current.kind === "home" && (
            <div className="setup-options setup-home-options">
              {current.options.map((option) => (
                <button
                  key={option}
                  className={"setup-option setup-home-option " + (selected === option ? "is-selected" : "")}
                  onClick={() => setValue(current.key, option)}
                >
                  <span>
                    <strong>{option}</strong>
                    <small>{HOME_COPY[option]}</small>
                  </span>
                  {selected === option && <b>✓</b>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="setup-actions">
          <button className="btn btn-green setup-primary" disabled={!canContinue} onClick={next}>
            {step === STEPS.length - 1 ? "Enter Senegambia" : "Continue"}
          </button>
        </div>
      </section>
    </div>
  );
}
