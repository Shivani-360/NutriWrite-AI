"use client";

/**
 * Sprout — the NutriWrite AI mascot.
 * One component, seven poses. Swap `pose` to match the moment:
 *
 *   idle         - default, homepage hero, empty-ish states
 *   thinking      - generate page while Gemini is working
 *   celebrating   - description generated / product saved successfully
 *   waving        - first login / onboarding greeting
 *   confused      - next to a validation error
 *   sleeping      - dashboard that's been empty a while
 *   winking       - next to a tooltip / hint
 *
 * Usage:
 *   <Sprout pose="thinking" size={110} />
 */
export default function Sprout({ pose = "idle", size = 120, className = "" }) {
  const sizes = { width: size, height: size * (pose === "confused" || pose === "sleeping" ? 1.07 : 1) };

  return (
    <svg
      viewBox="0 0 150 160"
      style={sizes}
      className={className}
      role="img"
      aria-label={`Sprout the mascot, ${pose}`}
    >
      {/* ---------------- IDLE ---------------- */}
      {pose === "idle" && (
        <g style={{ animation: "sprout-bob 3.2s ease-in-out infinite", transformOrigin: "center bottom" }}>
          <Body />
          <ellipse cx="65" cy="68" rx="4" ry="5.5" fill="#2B2A25" style={{ animation: "sprout-blink 4.5s infinite", transformOrigin: "center" }} />
          <ellipse cx="85" cy="68" rx="4" ry="5.5" fill="#2B2A25" style={{ animation: "sprout-blink 4.5s infinite", animationDelay: "0.05s", transformOrigin: "center" }} />
          <path d="M67 80 Q75 85 83 80" stroke="#2B2A25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* ---------------- THINKING ---------------- */}
      {pose === "thinking" && (
        <>
          <g style={{ animation: "sprout-sway 2.4s ease-in-out infinite", transformOrigin: "75px 125px" }}>
            <Body />
            <ellipse cx="66" cy="68" rx="4" ry="5" fill="#2B2A25" style={{ animation: "sprout-sway 2.4s ease-in-out infinite" }} />
            <ellipse cx="86" cy="68" rx="4" ry="5" fill="#2B2A25" style={{ animation: "sprout-sway 2.4s ease-in-out infinite" }} />
            <path d="M68 82 Q75 80 82 82" stroke="#2B2A25" strokeWidth="2.3" fill="none" strokeLinecap="round" />
          </g>
          <circle cx="108" cy="30" r="4" fill="#F2A93B" style={{ animation: "sprout-dot-pulse 1.2s ease-in-out infinite" }} />
          <circle cx="120" cy="22" r="4" fill="#A8446B" style={{ animation: "sprout-dot-pulse 1.2s ease-in-out infinite", animationDelay: "0.15s" }} />
          <circle cx="132" cy="30" r="4" fill="#7FA562" style={{ animation: "sprout-dot-pulse 1.2s ease-in-out infinite", animationDelay: "0.3s" }} />
        </>
      )}

      {/* ---------------- CELEBRATING ---------------- */}
      {pose === "celebrating" && (
        <g style={{ animation: "sprout-hop 0.9s ease-in-out infinite", transformOrigin: "center bottom" }}>
          <Body />
          <path d="M60 68 Q65 62 70 68" stroke="#2B2A25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M80 68 Q85 62 90 68" stroke="#2B2A25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M63 80 Q75 92 87 80" stroke="#2B2A25" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <ellipse cx="52" cy="80" rx="4.5" ry="3" fill="#F2A93B" opacity="0.6" />
          <ellipse cx="98" cy="80" rx="4.5" ry="3" fill="#F2A93B" opacity="0.6" />
        </g>
      )}

      {/* ---------------- WAVING ---------------- */}
      {pose === "waving" && (
        <g style={{ animation: "sprout-bob 2.8s ease-in-out infinite", transformOrigin: "center bottom" }}>
          <Body />
          <ellipse cx="65" cy="68" rx="4" ry="5.5" fill="#2B2A25" />
          <ellipse cx="85" cy="68" rx="4" ry="5.5" fill="#2B2A25" />
          <path d="M65 80 Q75 87 85 80" stroke="#2B2A25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path
            d="M100 62 L118 45"
            stroke="#5B8A3A"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ animation: "sprout-wave-arm 1s ease-in-out infinite", transformOrigin: "108px 60px" }}
          />
        </g>
      )}

      {/* ---------------- CONFUSED ---------------- */}
      {pose === "confused" && (
        <>
          <g style={{ animation: "sprout-tilt-shake 2s ease-in-out infinite", transformOrigin: "center bottom" }}>
            <Body />
            <ellipse cx="63" cy="70" rx="4" ry="5.5" fill="#2B2A25" />
            <ellipse cx="87" cy="66" rx="4" ry="5.5" fill="#2B2A25" />
            <path d="M66 82 Q75 78 84 84" stroke="#2B2A25" strokeWidth="2.3" fill="none" strokeLinecap="round" />
          </g>
          <text
            x="105" y="30"
            fontFamily="Fraunces, serif" fontSize="26" fontWeight="600" fill="#A8446B"
            style={{ animation: "sprout-q-float 2s ease-in-out infinite" }}
          >
            ?
          </text>
        </>
      )}

      {/* ---------------- SLEEPING ---------------- */}
      {pose === "sleeping" && (
        <>
          <g style={{ animation: "sprout-breathe 3.5s ease-in-out infinite", transformOrigin: "center" }}>
            <Body />
            <path d="M60 68 Q65 71 70 68" stroke="#2B2A25" strokeWidth="2.3" fill="none" strokeLinecap="round" />
            <path d="M80 68 Q85 71 90 68" stroke="#2B2A25" strokeWidth="2.3" fill="none" strokeLinecap="round" />
            <path d="M68 82 Q75 80 82 82" stroke="#2B2A25" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <text x="98" y="45" fontFamily="Fraunces, serif" fontSize="14" fill="#6B6759" style={{ animation: "sprout-zzz-float 3s ease-in-out infinite" }}>z</text>
          <text x="106" y="35" fontFamily="Fraunces, serif" fontSize="18" fill="#6B6759" style={{ animation: "sprout-zzz-float 3s ease-in-out infinite", animationDelay: "0.8s" }}>z</text>
          <text x="115" y="24" fontFamily="Fraunces, serif" fontSize="22" fill="#6B6759" style={{ animation: "sprout-zzz-float 3s ease-in-out infinite", animationDelay: "1.6s" }}>z</text>
        </>
      )}

      {/* ---------------- WINKING ---------------- */}
      {pose === "winking" && (
        <g style={{ animation: "sprout-bob 3s ease-in-out infinite", transformOrigin: "center bottom" }}>
          <Body />
          <ellipse cx="65" cy="68" rx="4" ry="5.5" fill="#2B2A25" style={{ animation: "sprout-wink 3.2s infinite", transformOrigin: "center" }} />
          <path d="M81 68 Q85 66 89 68" stroke="#2B2A25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M67 80 Q75 85 83 80" stroke="#2B2A25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/** Shared body shape reused by every pose — only the face/arms change above. */
function Body() {
  return (
    <>
      <rect x="65" y="95" width="20" height="30" rx="6" fill="#D8C79A" />
      <circle cx="75" cy="65" r="38" fill="#5B8A3A" />
      <circle cx="52" cy="55" r="16" fill="#6C9E48" />
      <circle cx="98" cy="55" r="16" fill="#6C9E48" />
      <circle cx="75" cy="40" r="18" fill="#79AE52" />
    </>
  );
}