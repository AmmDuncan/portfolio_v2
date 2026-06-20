import s from "./SignalPanel.module.css";

const WaveGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3v18M7 7v10M17 7v10M3 10v4M21 10v4"
      stroke="#06231b"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const ShieldGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PrivacyPill = () => (
  <span className={s.privacyPill}>
    <ShieldGlyph />
    On-device
  </span>
);

const Head = ({ name, sub, pill = true }) => (
  <div className={s.head}>
    <div className={s.badge}>
      <WaveGlyph />
    </div>
    <div className={s.label}>
      <span className={s.stateName}>{name}</span>
      <span className={s.sub}>{sub}</span>
    </div>
    {pill && <PrivacyPill />}
  </div>
);

/**
 * A single Local Dictation "Signal Energy" overlay panel on its dark showcase
 * stage. `state` picks which moment of the flow it shows.
 * @param state - "listening" | "transcribing" | "done"
 */
export default function SignalPanel({ state = "listening", compact = false }) {
  return (
    <div className={`${s.stage} ${compact ? s.compact : ""}`}>
      <div className={s.fakeText}>
        <div className={s.ln} />
        <div className={s.ln} />
        <div className={s.ln} />
        <div className={s.ln} />
      </div>
      {state === "done" && <div className={s.fakeCursor} />}
      <div className={s.halo} />

      <div className={s.panel}>
        <div className={s.accentLine} />
        <div className={s.panelInner}>
          {state === "listening" && (
            <>
              <Head name="Listening…" sub="Speak now — I'm hearing you" />
              <div className={s.wave}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={s.bar} />
                ))}
              </div>
              <div className={s.transcript}>
                <span className={s.final}>She sells sea shells by the</span>
                <span className={s.partial}> sea sho</span>
                <span className={s.caretTxt} />
              </div>
              <div className={s.hint}>
                <span className={s.keys}>
                  Hold <kbd className={s.kbd}>⌃ Space</kbd> · release to insert
                </span>
                <span className={s.timer}>
                  <span className={s.recDot} />
                  0:04
                </span>
              </div>
            </>
          )}

          {state === "transcribing" && (
            <>
              <Head name="Transcribing…" sub="Processing your words locally" />
              <div className={s.procWave}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={s.pdot} />
                ))}
              </div>
              <div className={s.procTrack}>
                <div className={s.procFill} />
              </div>
              <div className={s.hint}>
                <span className={s.keys}>Nothing leaves your Mac — no cloud, no upload</span>
              </div>
            </>
          )}

          {state === "done" && (
            <>
              <Head name="Inserted" sub="42 words typed at your cursor" />
              <div className={s.checkWrap}>
                <div className={s.checkRing}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="#06231b"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className={s.doneTranscript}>
                &quot;She sells sea shells by the sea shore, and the shells she sells are surely
                seashells.&quot;
              </div>
              <div className={s.doneMeta}>
                <span className={s.insert}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Typed at cursor
                </span>
                <span>· copied to clipboard</span>
              </div>
              <div className={s.dismissTrack}>
                <div className={s.dismissFill} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
