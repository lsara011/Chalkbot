import React from "react";

type Props = { onPick: (q: string) => void };
type Question = { text: string };

const APA_QUESTIONS: Question[] = [
  { text: "What happens if the cue ball scratches on the break in 8-Ball?" },
  { text: "What happens if the cue ball scratches on the break in 9-Ball?" },
  { text: "What is a legal 8-Ball break?" },
  { text: "What is a legal 9-Ball break?" },
  { text: "When is the table considered “open” in 8-Ball?" },
  { text: "When does a player’s turn end in 8-Ball?" },
  { text: "When does a player’s turn end in 9-Ball?" },
  { text: "What is a foul for failing to hit a rail after contact?" },
  { text: "What happens if the 8-Ball is pocketed on the break?" },
  { text: "What happens if the 9-Ball is pocketed on the break?" },

  { text: "When does the opponent get ball-in-hand?" },
  { text: "What is considered a double-hit foul?" },
  { text: "What is considered a push-shot foul?" },
  { text: "What happens if a player accidentally touches a ball?" },
  { text: "What is a foul for failure to hit the correct ball first in 9-Ball?" },
  { text: "Is it a foul to shoot while balls are still moving?" },
  { text: "What happens if a player pockets the cue ball and the object ball?" },
  { text: "What is a scratch on the 8-Ball?" },
  { text: "What is a scratch on the 9-Ball?" },
  { text: "Can you use a jump shot in APA play?" },

  { text: "How many time-outs are allowed for a skill level 2 or 3 player?" },
  { text: "How many time-outs are allowed for a skill level 4 or higher?" },
  { text: "Who can call a time-out?" },
  { text: "Can a captain call a time-out while they are the shooter?" },
  { text: "Can a player refuse a time-out?" },
  { text: "What is the penalty for taking too long on a time-out?" },
  { text: "Can more than one teammate give advice during a time-out?" },
  { text: "Can a player step away from the table during a time-out?" },
  { text: "What happens if advice is given outside a time-out?" },
  { text: "Can spectators coach players during matches?" },

  { text: "What is a defensive shot?" },
  { text: "When should a defensive shot be marked on the scoresheet?" },
  { text: "Why are defensive shots tracked?" },
  { text: "What happens if defensive shots are not recorded?" },
  { text: "How do defensive shots affect skill levels?" },
  { text: "Can a safety be called as a defensive shot?" },
  { text: "What is the difference between a safety and a defensive shot?" },
  { text: "Do safeties always count as defensive shots?" },
  { text: "How does the scorekeeper mark an intentional miss?" },
  { text: "What happens if both teams disagree on a defensive shot ruling?" },

  { text: "What are weekly team fees used for?" },
  { text: "How much does each team pay per match?" },
  { text: "What happens if a team cannot field enough players?" },
  { text: "What is a team forfeit?" },
  { text: "What happens if both teams forfeit a match?" },
  { text: "Are team fees still owed for a forfeited match?" },
  { text: "How are forfeited matches recorded?" },
  { text: "How do forfeits affect team standings?" },
  { text: "How many forfeits can remove a team from a session?" },
  { text: "What happens if a player is late to the match?" },

  { text: "What is the starting skill level for new 8-Ball players?" },
  { text: "What is the starting skill level for new 9-Ball players?" },
  { text: "How are skill levels adjusted?" },
  { text: "Do skill levels change only between sessions?" },
  { text: "What is the maximum combined skill level for 5 players in 8-Ball?" },
  { text: "What is the maximum combined skill level for 5 players in 9-Ball?" },
  { text: "What happens if a team exceeds the skill level limit?" },
  { text: "How often are skill levels reviewed?" },
  { text: "Can a player’s skill level go down?" },
  { text: "Who determines a player’s official skill level?" },

  { text: "How many teams qualify for playoffs?" },
  { text: "What determines playoff seeding?" },
  { text: "What happens in the case of a tie in standings?" },
  { text: "Are there special rules for playoff matches?" },
  { text: "How are tiebreakers handled in playoffs?" },
  { text: "Can higher-skill players be benched in playoffs?" },
  { text: "Are all playoff matches played to the same race chart?" },
  { text: "Can substitutes play in playoffs?" },
  { text: "What happens if a playoff match is unfinished?" },
  { text: "How are league winners advanced to regionals?" },

  { text: "When can a player legally shoot the 8-Ball?" },
  { text: "What happens if the 8-Ball is pocketed early?" },
  { text: "Can you combo the 8-Ball with another ball?" },
  { text: "What happens if you pocket the 8-Ball and scratch?" },
  { text: "What happens if you pocket the 8-Ball in the wrong pocket?" },
  { text: "Do you have to call the pocket for the 8-Ball?" },
  { text: "Can a player continue shooting after pocketing the 8-Ball on the break?" },
  { text: "What happens if the 8-Ball is jumped off the table?" },
  { text: "Is it a loss if the 8-Ball is pocketed on a foul shot?" },
  { text: "Can a player purposely pocket the 8-Ball to end the game?" },

  { text: "What ball must be struck first in 9-Ball?" },
  { text: "Can a player combo into the 9-Ball at any time?" },
  { text: "What happens if the 9-Ball is pocketed illegally?" },
  { text: "What happens if the 9-Ball is made on a push-out?" },
  { text: "What is a legal push-out in 9-Ball?" },
  { text: "When can a push-out be played?" },
  { text: "What happens if the 9-Ball is pocketed on a push-out foul?" },
  { text: "What happens if the shooter misses the 9-Ball but makes another ball?" },
  { text: "How are 9-Ball points scored?" },
  { text: "How many total points are possible in a 9-Ball match?" },

  { text: "What is considered sharking?" },
  { text: "What is the penalty for unsportsmanlike conduct?" },
  { text: "What is the proper etiquette when an opponent is shooting?" },
  { text: "Can players argue with the scorekeeper?" },
  { text: "How are disputes resolved during a match?" },
  { text: "What happens if a player uses abusive language?" },
  { text: "Can a player be suspended from the league?" },
  { text: "What happens if a player breaks house rules?" },
  { text: "What is the role of the League Operator in disputes?" },
  { text: "How should captains handle disagreements at the table?" },
];

// unbiased 4-sample via Fisher–Yates
function sampleUnbiased<T>(arr: T[], k: number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(k, a.length));
}

export default function Welcome({ onPick }: Props) {
  const [shown, setShown] = React.useState<Question[]>(() =>
    sampleUnbiased(APA_QUESTIONS, 4)
  );

  const shuffle = () => setShown(sampleUnbiased(APA_QUESTIONS, 4));

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={logoRow}>
          <div style={logoDisc}>
            <div style={logoCenter} />
          </div>
          <div style={titleCol}>
            <h1 style={title}>Miami APA ChalkBot</h1>
            <div style={byline}>
              By <span style={strong}>Luis Saravia</span>
            </div>
          </div>
        </div>

        <p style={subtitle}>
          Answers questions using Miami APA bylaws and APA Team Manual (2023)
        </p>

        <div style={chipGrid}>
          {shown.map((s) => (
            <button
              key={s.text}
              style={chip}
              onClick={() => onPick(s.text)}
              title={s.text}
            >
              <span style={chipText}>{s.text}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button style={refreshBtn} onClick={shuffle} aria-label="Shuffle questions">
            Shuffle questions
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- inline styles (yours, plus a small refresh button) ---- */
const wrap: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  padding: 8,
};

const card: React.CSSProperties = {
  width: "min(820px, 100%)",
  background: "#0b1220",
  border: "1px solid #1f2a44",
  borderRadius: 12,
  padding: 20,
  color: "#e5e7eb",
  boxShadow: "0 0 0 1px rgba(31,42,68,0.4) inset",
};

const logoRow: React.CSSProperties = {
  display: "flex",
  gap: 14,
  alignItems: "center",
};

const logoDisc: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 30% 30%, #1e293b, #111827 60%), linear-gradient(#0ea5e9, #0284c7)",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 0 0 2px #0b1220, 0 0 0 3px #1f2a44",
};

const logoCenter: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#0b1220",
};

const titleCol: React.CSSProperties = { display: "grid", gap: 2 };
const title: React.CSSProperties = { margin: 0, fontSize: 22, fontWeight: 700 };
const byline: React.CSSProperties = { fontSize: 12, color: "#9ca3af" };
const strong: React.CSSProperties = { color: "#e5e7eb", fontWeight: 600 };

const subtitle: React.CSSProperties = {
  marginTop: 14,
  marginBottom: 10,
  color: "#cbd5e1",
  fontSize: 14,
};

const chipGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 10,
  marginTop: 8,
};

const chip: React.CSSProperties = {
  textAlign: "left",
  background: "#111827",
  border: "1px solid #1f2a44",
  color: "#e5e7eb",
  padding: "10px 12px",
  borderRadius: 10,
  cursor: "pointer",
};

const chipText: React.CSSProperties = {
  display: "block",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: 14,
};

const refreshBtn: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1f2a44",
  color: "#e5e7eb",
  borderRadius: 999,
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 13,
};
