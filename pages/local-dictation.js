import Head from "next/head";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiGithub,
  FiMic,
  FiCpu,
  FiZap,
  FiBookOpen,
  FiType,
  FiPackage,
  FiWifiOff,
  FiUserX,
  FiCheckCircle,
  FiCheck,
  FiArrowDown,
} from "react-icons/fi";

import SignalPanel from "../components/local-dictation/SignalPanel";
import {
  Page,
  Wrap,
  Kick,
  Hero,
  Highlight,
  Deck,
  CtaRow,
  DownloadButton,
  GhostLink,
  Section,
  SectionHead,
  SectionDeck,
  PrivacyBand,
  PrivacyPoints,
  Steps,
  Step,
  StepLabel,
  StepDesc,
  Features,
  FeatureCard,
  FeatureIcon,
  LearnBand,
  LearnDemo,
  ResultCard,
  LearnArrow,
  DownloadBand,
  CenterCtas,
  InstallNote,
} from "../components/local-dictation/page.styles";

const REPO = "https://github.com/AmmDuncan/local-dictation";
const DOWNLOAD = `${REPO}/releases/latest`;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, type: "spring", mass: 1.1, delay },
});

const features = [
  {
    icon: <FiMic />,
    title: "Push-to-talk",
    body: (
      <>
        Hold <code>⌃ Space</code>, speak, release. Your words appear at the cursor — in any app,
        native or web.
      </>
    ),
  },
  {
    icon: <FiCpu />,
    title: "100% on-device",
    body: "Whisper and a local language model run entirely on your Mac. No internet, no account, no cloud.",
  },
  {
    icon: <FiZap />,
    title: "Smart correction",
    body: (
      <>
        Fixes what speech-to-text mishears — <code>clot</code> → <code>Claude</code> — and leaves
        real words alone.
      </>
    ),
  },
  {
    icon: <FiBookOpen />,
    title: "Custom vocabulary",
    body: "Teach it your names, jargon, and product terms so they transcribe right every time.",
  },
  {
    icon: <FiType />,
    title: "Types anywhere",
    body: "Inserts at your cursor with smart spacing and capitalization that continues the sentence.",
  },
  {
    icon: <FiPackage />,
    title: "Self-contained",
    body: "Bundled Whisper + llama servers, zero Homebrew deps, and it updates itself via Sparkle.",
  },
];

const steps = [
  {
    state: "listening",
    n: 1,
    t: "Speak",
    d: "Hold ⌃Space and talk. A live waveform and rolling transcript show it's hearing you.",
  },
  {
    state: "transcribing",
    n: 2,
    t: "Transcribe",
    d: "Release. Whisper transcribes locally and a small model cleans up the text — all offline.",
  },
  {
    state: "done",
    n: 3,
    t: "Inserted",
    d: "The finished text is typed at your cursor and copied to the clipboard. The panel auto-dismisses.",
  },
];

export default function LocalDictation() {
  return (
    <Page>
      <Head>
        <title>Local Dictation — private, on-device dictation for macOS</title>
        <meta
          name="description"
          content="A private, on-device dictation app for macOS. Hold ⌃Space, speak, release — your words appear at the cursor. Whisper transcribes and a local model cleans up, 100% offline. Nothing leaves your Mac."
        />
        <meta
          property="og:title"
          content="Local Dictation — dictation that never leaves your Mac"
        />
        <meta
          property="og:description"
          content="Private, on-device dictation for macOS. Whisper + a local model, fully offline. Nothing leaves your Mac."
        />
      </Head>

      <Wrap>
        {/* ---------- Hero ---------- */}
        <Hero>
          <div>
            <motion.div {...fade()}>
              <Kick>Local Dictation · macOS</Kick>
            </motion.div>
            <motion.h1 {...fade(0.05)}>
              Talk. It types.
              <br />
              Nothing leaves your <Highlight>Mac</Highlight>.
            </motion.h1>
            <motion.div {...fade(0.12)}>
              <Deck>
                A private, on-device dictation app for macOS. Hold <strong>⌃ Space</strong>, speak,
                and release — your words land at the cursor in any app. Transcribed and cleaned up
                on-device, fully offline.
              </Deck>
            </motion.div>
            <motion.div {...fade(0.18)}>
              <CtaRow>
                <DownloadButton href={DOWNLOAD} target="_blank" rel="noreferrer">
                  <FiDownload />
                  Download for macOS
                  <small>· Apple Silicon</small>
                </DownloadButton>
                <GhostLink href={REPO} target="_blank" rel="noreferrer">
                  <FiGithub />
                  View source
                </GhostLink>
              </CtaRow>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, type: "spring", mass: 1.3, delay: 0.15 }}
          >
            <SignalPanel state="listening" />
          </motion.div>
        </Hero>

        {/* ---------- Private by design ---------- */}
        <Section as={motion.section} {...fade()}>
          <PrivacyBand>
            <div>
              <Kick>Private by design</Kick>
              <h2>Your voice stays yours.</h2>
              <p>
                Most dictation tools stream your audio to a server. Local Dictation never does —
                transcription and cleanup happen entirely on your machine.
              </p>
            </div>
            <PrivacyPoints>
              <li>
                <FiWifiOff />
                <span>
                  <strong>No cloud, ever.</strong> Audio is processed on-device and discarded —
                  never uploaded.
                </span>
              </li>
              <li>
                <FiUserX />
                <span>
                  <strong>No account, no telemetry.</strong> Zero network calls to transcribe a
                  word.
                </span>
              </li>
              <li>
                <FiCheckCircle />
                <span>
                  <strong>Open source.</strong> Read every line on GitHub.
                </span>
              </li>
            </PrivacyPoints>
          </PrivacyBand>
        </Section>

        {/* ---------- How it works ---------- */}
        <Section>
          <motion.div {...fade()}>
            <SectionHead>
              <Kick>How it works</Kick>
              <h2>Speak → transcribe → inserted.</h2>
              <SectionDeck>
                The overlay breathes with your voice and tells you exactly what stage it&rsquo;s in. This
                is the app&rsquo;s real interface.
              </SectionDeck>
            </SectionHead>
          </motion.div>
          <Steps>
            {steps.map((step, i) => (
              <Step as={motion.div} key={step.state} {...fade(i * 0.08)}>
                <StepLabel>
                  <span className="num">{step.n}</span>
                  <span className="t">{step.t}</span>
                </StepLabel>
                <SignalPanel state={step.state} compact />
                <StepDesc>{step.d}</StepDesc>
              </Step>
            ))}
          </Steps>
        </Section>

        {/* ---------- It learns your corrections ---------- */}
        <Section>
          <LearnBand as={motion.div} {...fade()}>
            <div>
              <Kick>It adapts to you</Kick>
              <h2>Correct it once. It remembers.</h2>
              <p>
                Fix a dictation with <code>⌃⌥Z</code> and the swap becomes a rule — on-device,
                private, yours. The more you talk, the more it sounds like you.
              </p>
            </div>
            <LearnDemo>
              <ResultCard>
                <span className="cap">You said · today</span>
                <p className="q">
                  &ldquo;Ask <s>clot</s> to refactor this.&rdquo;
                </p>
                <span className="chip">
                  <FiCheck />
                  Taught: clot → Claude
                </span>
              </ResultCard>
              <LearnArrow>
                <FiArrowDown />
                next time
              </LearnArrow>
              <ResultCard>
                <span className="cap">You said · tomorrow</span>
                <p className="q">
                  &ldquo;Ask <em>Claude</em> to refactor this.&rdquo;
                </p>
                <span className="chip">
                  <FiCheck />
                  Right, automatically
                </span>
              </ResultCard>
            </LearnDemo>
          </LearnBand>
        </Section>

        {/* ---------- Features ---------- */}
        <Section>
          <motion.div {...fade()}>
            <SectionHead>
              <Kick>What&rsquo;s inside</Kick>
              <h2>Built to feel instant and stay out of the way.</h2>
            </SectionHead>
          </motion.div>
          <Features>
            {features.map((f, i) => (
              <FeatureCard as={motion.div} key={f.title} {...fade((i % 3) * 0.06)}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </FeatureCard>
            ))}
          </Features>
        </Section>

        {/* ---------- Download ---------- */}
        <Section>
          <DownloadBand>
            <motion.div {...fade()}>
              <Kick style={{ justifyContent: "center" }}>Get it</Kick>
              <h2>Try dictation that stays on your Mac.</h2>
              <CenterCtas>
                <DownloadButton href={DOWNLOAD} target="_blank" rel="noreferrer">
                  <FiDownload />
                  Download for macOS
                  <small>· Apple Silicon</small>
                </DownloadButton>
                <GhostLink href={REPO} target="_blank" rel="noreferrer">
                  <FiGithub />
                  View source
                </GhostLink>
              </CenterCtas>
              <InstallNote>
                Apple Silicon · macOS 14+. It isn&rsquo;t notarized by Apple, so on first launch open it
                via the bundled installer, or <code>right-click → Open</code> / System Settings →
                Open Anyway.
              </InstallNote>
            </motion.div>
          </DownloadBand>
        </Section>
      </Wrap>
    </Page>
  );
}
