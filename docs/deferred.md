# Deferred

- `components/desk/DeskJourney.jsx` (startJourney closure: frame loop, flight, Lenis, hover/click, the eslint-disable on the effect deps): extract into a `scene/flight.js` / `useDeskFlight` module. Reason (a): waits on Ammiel's real-iPhone Safari check of the projected-screen fix, which runs through this exact code; restructure after that check, gated on `/tmp/storelink-shot/flash.mjs`, `wk.mjs` and `both.mjs` showing no change. Raised by the taste review on c8ae3d6, 2026-11-18.
