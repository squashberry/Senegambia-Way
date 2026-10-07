import React from "react";

export default function Onboarding({ session, step, setStep, profile, setProfile, onFinish }) {
  const titles = ["Meet your Sim", "Tell your story", "Choose a trait", "Pick your start", "Ready to enter"];
  const skins = { Deep: "🧍🏿", Dark: "🧍🏾", Brown: "🧍🏽", Light: "🧍🏼" };

  const choose = (key, value) => setProfile((current) => ({ ...current, [key]: value }));

  return (
    <div className="onboarding-screen" role="dialog" aria-modal="true" aria-label="Create your Senegambia Sim">
      <section className="onboarding-card panel">
        <div className="onboarding-stripe" aria-hidden="true" />

        <div className="onboarding-top">
          <div>
            <p className="eyebrow">Build your Senegambia life</p>
            <h1>{titles[step]}</h1>
          </div>
          <span className="onboarding-counter">{step + 1} / 5</span>
        </div>

        <div className="onboarding-progress" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index <= step ? "is-active" : ""} />
          ))}
        </div>

        {step === 0 && (
          <div className="onboarding-body">
            <div className="sim-preview">
              <div className="sim-emoji" aria-hidden="true">{skins[profile.skin] || skins.Deep}</div>
              <strong>{profile.nickname || session.displayName || "Your Sim"}</strong>
              <span>{profile.height} · {profile.shape} · {profile.outfit}</span>
              <small>{profile.hair}</small>
            </div>

            <div className="onboarding-copy">
              <h2>Make your Gambian.</h2>
              <p>Choose the look, height and shape you want other players to see, then pick a style for your first day.</p>
            </div>

            {[
              ["shape", "Shape", ["Slim", "Balanced", "Strong"]],
              ["height", "Height", ["Short", "Average", "Tall"]],
              ["skin", "Skin tone", ["Deep", "Dark", "Brown", "Light"]],
              ["hair", "Hair", ["Low cut", "Braids", "Locs", "Curls"]],
              ["outfit", "First-day style", ["Casual", "Boubou", "Workwear", "Streetwear"]]
            ].map(([key, label, values]) => (
              <div className="choice-group" key={key}>
                <span className="choice-label">{label}</span>
                <div className={"choice-grid " + (values.length === 4 ? "choice-grid-4" : "")}>
                  {values.map((value) => (
                    <button
                      key={value}
                      className={"choice-button " + (profile[key] === value ? "is-selected" : "")}
                      onClick={() => choose(key, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-body">
            <div className="onboarding-copy">
              <h2>Who are you?</h2>
              <p>Give your Sim a name and a line or two about the person you want to become around Senegambia.</p>
            </div>

            <label className="onboarding-field">
              Nickname
              <input
                value={profile.nickname}
                onChange={(event) => choose("nickname", event.target.value)}
                placeholder={session.displayName || "Your public name"}
              />
            </label>

            <label className="onboarding-field">
              About you
              <textarea
                value={profile.bio}
                onChange={(event) => choose("bio", event.target.value)}
                rows="4"
                maxLength="160"
                placeholder="Student, hustler, creative, football lover, future boss…"
              />
            </label>

            <div className="mini-tip">Your public name and bio can be changed later.</div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-body">
            <div className="onboarding-copy">
              <h2>Pick one trait.</h2>
              <p>Choose the thing that best describes how you approach life. It becomes part of your Sim identity.</p>
            </div>

            <div className="trait-grid">
              {[
                ["Resourceful", "Find a way when money is tight."],
                ["Social", "People notice you quickly."],
                ["Driven", "You hate leaving progress unfinished."],
                ["Chill", "You protect your peace."],
                ["Bold", "You like taking the first move."],
                ["Creative", "You turn ordinary days into stories."]
              ].map(([value, description]) => (
                <button
                  key={value}
                  className={"trait-card " + (profile.trait === value ? "is-selected" : "")}
                  onClick={() => choose("trait", value)}
                >
                  <strong>{value}</strong>
                  <span>{description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-body">
            <div className="onboarding-copy">
              <h2>Choose where you start.</h2>
              <p>Pick a neighbourhood that fits your first chapter. You can move later as your life changes.</p>
            </div>

            <div className="home-grid">
              {[
                ["Serrekunda", "Busy, practical and close to the everyday hustle."],
                ["Bakau", "Coastal, lively and full of familiar local life."],
                ["Fajara", "A calmer, more polished start near the coast."],
                ["Brikama", "A grounded start with room to grow."]
              ].map(([value, description]) => (
                <button
                  key={value}
                  className={"home-card " + (profile.home === value ? "is-selected" : "")}
                  onClick={() => choose("home", value)}
                >
                  <span className="home-card-pin">⌂</span>
                  <strong>{value}</strong>
                  <span>{description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-body onboarding-finish">
            <div className="ready-badge">✓</div>
            <div className="onboarding-copy">
              <h2>{profile.nickname || session.displayName}, you’re ready.</h2>
              <p>Your Sim is set up for Senegambia Way. Review the essentials below, then enter the world.</p>
            </div>

            <div className="summary-grid">
              <div><span>Name</span><strong>{profile.nickname || session.displayName}</strong></div>
              <div><span>Trait</span><strong>{profile.trait}</strong></div>
              <div><span>Home</span><strong>{profile.home}</strong></div>
              <div><span>Style</span><strong>{profile.outfit}</strong></div>
            </div>
          </div>
        )}

        <div className="onboarding-actions">
          {step > 0 ? <button className="btn btn-mist" onClick={() => setStep((current) => current - 1)}>Back</button> : <div />}
          <span />
          {step < 4 ? (
            <button className="btn btn-green onboarding-next" onClick={() => setStep((current) => current + 1)}>Continue</button>
          ) : (
            <button className="btn btn-green onboarding-next" onClick={onFinish}>Enter Senegambia</button>
          )}
        </div>
      </section>
    </div>
  );
}
