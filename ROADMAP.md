# PetCalm — Fixes, Optimizations & Feature Roadmap

> Based on full codebase audit (Feb 2026). Items ordered by priority within each section.
> **PHASE 1 COMPLETE** — All critical blockers implemented (Feb 2026)
> **PHASE 2 COMPLETE** — All high-priority fixes implemented (Feb 2026)
> **PHASE 3 COMPLETE** — All performance optimizations implemented (Feb 2026)
> **PHASE 4 COMPLETE** — All new features implemented (Feb 2026)

---

## Current App Score

| Dimension | Score | Notes |
|---|---|---|
| Content quality | 9/10 | Clinically grounded, comprehensive |
| UX/Design | 7/10 | Clean, some friction points |
| Technical stability | 6/10 | Solid MVP, gaps in error handling |
| App Store readiness | 7/10 | Icons ✅ Notifications ✅ Privacy Policy ✅ Crash Reporting ✅ Splash Screen ✅ |
| Revenue potential | 8/10 | Strong niche, multiple monetization paths |
| Competitive moat | 7/10 | Clinical content + AI analysis is differentiated |
| **Overall** | **7.5/10** | Phase 1 complete — ready for limited beta / TestFlight |

---

## PHASE 1 — Critical Blockers ✅ DONE

These will cause immediate 1-star reviews or app store rejection if not fixed.

### 1.1 App Icons ✅
> **Implemented:** `public/icons/icon-{48,72,96,144,192,512}.png` generated (sage green #5B8A72 with paw print). `manifest.json` updated with all sizes + `purpose: "any maskable"`.

~~**Problem:** `public/manifest.json` references `icons/icon-192.png` and `icons/icon-512.png` but neither file exists.~~

**Problem:** `public/manifest.json` references `icons/icon-192.png` and `icons/icon-512.png` but neither file exists.
**Impact:** App Store submission will be rejected. PWA install prompt will not appear.

**Fix:**
- Create `public/icons/` directory
- Add `icon-192.png` (192×192 px, PNG, app logo)
- Add `icon-512.png` (512×512 px, PNG, same logo)
- Also add for Play Store: `icon-48.png`, `icon-72.png`, `icon-96.png`, `icon-144.png`
- Recommended tool: [realfavicongenerator.net](https://realfavicongenerator.net)

---

### 1.2 Push Notifications ✅
> **Implemented:** Installed `@capacitor/local-notifications@6`. Created `services/notifications.ts` with `scheduleReminder()`, `cancelReminder()`, `syncReminders()`, and `requestNotificationPermission()`. Home.tsx wired: permission requested on mount; reminders schedule/cancel/toggle all sync to native notifications. No-ops silently in browser.

### ~~1.2 Push Notifications — Reminders Are Silent~~ (archived)

**Problem:** Users can create reminders in the UI but they never fire when the app is closed. Users will feel the app is broken.
**Impact:** Highest driver of 1-star reviews in productivity/health apps.

**Fix using Capacitor + Firebase Cloud Messaging:**
```bash
npm install @capacitor/push-notifications
npx cap sync android
```
- Add `google-services.json` from Firebase Console to `android/app/`
- Implement local notifications for scheduled reminders
- For background scheduling use `@capacitor/local-notifications` (no server required)

```bash
npm install @capacitor/local-notifications
```

**Implementation sketch:**
- When user saves a reminder, schedule a local notification for each enabled day/time
- Cancel scheduled notifications when reminder is disabled or deleted

---

### 1.3 Gemini API Key Security ✅
> **Implemented:** Created `cloudflare-worker.js` ready-to-deploy proxy (100k req/day free tier). `geminiService.ts` now reads `GEMINI_PROXY_URL` env var — when set, all requests go through the worker (API key stays server-side). Falls back to direct API for local dev. `vite.config.ts` exposes `GEMINI_PROXY_URL`. Fixed model name from `gemini-3-flash-preview` → `gemini-2.0-flash`.

### ~~1.3 Gemini API Key Exposed~~ (archived)

**Problem:** `GEMINI_API_KEY` is embedded in the compiled JS bundle via Vite `define`. Anyone with apktool can extract it and use it for free.
**Impact:** Unlimited API charges on your account. Potential account termination.

**Fix — Cloudflare Worker proxy (free tier sufficient for MVP):**
```javascript
// cloudflare-worker.js
export default {
  async fetch(request) {
    const body = await request.json();
    const response = await fetch('https://generativelanguage.googleapis.com/...', {
      method: 'POST',
      headers: { 'x-goog-api-key': GEMINI_API_KEY }, // env var, never in client
      body: JSON.stringify(body),
    });
    return response;
  }
}
```
- App calls `https://your-worker.workers.dev/analyze` instead of Gemini directly
- API key lives only in Cloudflare environment variables
- Free tier: 100,000 requests/day

---

### 1.4 Privacy Policy ✅
> **Implemented:** Created `pages/Privacy.tsx` — expandable in-app privacy policy with 7 sections covering data storage, AI usage, photos, permissions, and GDPR contact. Added `'PRIVACY'` to `ViewState`. Routed in `App.tsx`. Profile page now shows a "Privacy Policy" link (Shield icon) above the Reset section. No nav item needed — accessible from Profile footer.

### ~~1.4 Privacy Policy~~ (archived)

**Problem:** Both Google Play and Apple App Store require a privacy policy for any app that collects personal data. PetCalm stores: pet photos (base64), behavioral logs, mood data, reminders.
**Impact:** App store submission rejected without it.

**Fix:**
- Generate using [privacypolicygenerator.info](https://privacypolicygenerator.info) or [iubenda.com](https://iubenda.com)
- Host at `https://petcalm.app/privacy` (even a static page works)
- Add link in Profile page footer and app store listing
- Key disclosures needed: what data is stored, where (local only), Gemini API usage, photo storage

---

### 1.5 Crash Reporting / Error Boundary ✅
> **Implemented:** Created `components/ErrorBoundary.tsx` (class component wrapping entire app). Shows friendly "Restart App" screen with error message on unhandled React render errors. `index.tsx` wraps `<App />` in `<ErrorBoundary>` and adds a global `unhandledrejection` event listener. Sentry can be added on top later by initializing with DSN in index.tsx.

### ~~1.5 No Crash Reporting~~ (archived)

**Problem:** When something breaks for users in production, you have no visibility.
**Impact:** Cannot debug real-world issues. Silent failures in IndexedDB, Audio, Gemini API go undetected.

**Fix — Sentry (free tier: 5,000 errors/month):**
```bash
npm install @sentry/react
```
```typescript
// main.tsx
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: 'YOUR_DSN', environment: 'production' });
```
- Captures JS errors, promise rejections, component errors
- Shows device info, OS version, stack traces
- Free for indie developers

---

### 1.6 Splash Screen ✅
> **Implemented:** Installed `@capacitor/splash-screen@6`. Updated `capacitor.config.ts` with `SplashScreen` plugin config (1800ms duration, `#FAFCFB` background, immersive mode). Also configured `LocalNotifications` plugin defaults. Run `npm run build:android` to rebuild APK with splash support.

### ~~1.6 Missing Splash Screen~~ (archived)

**Problem:** Capacitor app shows blank white screen for 1–2 seconds while WebView loads.
**Impact:** Looks broken. Poor first impression.

**Fix:**
```bash
npm install @capacitor/splash-screen
npx cap sync android
```
- Configure in `capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#FAFCFB',
    androidSplashResourceName: 'splash',
    showSpinnerAnimation: false,
  }
}
```

---

## PHASE 2 — High Priority Fixes ✅ DONE

### 2.1 Multi-Pet Profile Support

**Problem:** Single pet only. Most households have 2+ pets. No way to switch.
**Impact:** Directly limits addressable user base by ~40%.

**Data model change needed in `types.ts`:**
```typescript
// All tables already have/need petId FK:
interface Incident { petId: string; ... }    // add this
interface MoodLog { petId: string; ... }     // add this
interface ScheduleItem { petId: string; ... } // add this
```

**UI changes needed:**
- Header pet avatar becomes a tap-to-switch dropdown
- Onboarding allows adding additional pets
- Profile page shows "Manage Pets" list

---

### 2.2 Audio Error Feedback

**Problem:** When audio playback fails (permissions denied, file not found, codec unsupported), user sees nothing. App appears frozen.

**Current broken code in `Sounds.tsx:120`:**
```typescript
audio.play().catch(err => console.error("Playback failed:", err));
```

**Fix:**
```typescript
const [audioError, setAudioError] = useState<string | null>(null);

audio.play().catch(err => {
  console.error("Playback failed:", err);
  setAudioError("Could not play audio. Check your volume settings.");
});

// Show toast notification when audioError is set
```

---

### 2.3 Duplicate Sound — Deep Sleep = Brown Noise

**Problem:** "Deep Sleep Frequencies" (id: '5') and "Brown Noise (Deep)" (id: '3') both use `generate:brown`. Users playing both hear identical sounds.

**Fix in `constants.ts`:**
```typescript
// Change Deep Sleep Frequencies to use a unique generator
{
  id: '5',
  title: 'Deep Sleep Frequencies',
  category: 'Specialized',
  url: 'generate:pink',  // was 'generate:brown' — now distinct
}
```
Or generate a proper delta wave (0.5–4Hz) oscillator for sleep.

---

### 2.4 Training — No "Continue" CTA on Home Screen

**Problem:** Users complete training step 1, navigate away, and forget where they were. No "Resume training" prompt on Home.

**Fix — Add to `Home.tsx`:**
```typescript
// Find the program with highest in-progress completedStepIndex
const inProgressProgram = programs.find(p => p.completedStepIndex > 0 && p.completedStepIndex < p.steps.length);

// Show resume card if exists
{inProgressProgram && (
  <section>
    <div className="bg-accent/10 p-4 rounded-2xl flex items-center gap-3">
      <BookOpen size={20} className="text-accent" />
      <div className="flex-1">
        <p className="text-xs text-neutral-subtext">Continue Training</p>
        <p className="font-bold text-sm">{inProgressProgram.title}</p>
        <p className="text-xs text-neutral-subtext">
          Step {inProgressProgram.completedStepIndex + 1} of {inProgressProgram.steps.length}
        </p>
      </div>
      <Button onClick={() => onNavigate('TRAINING')}>Resume</Button>
    </div>
  </section>
)}
```

---

### 2.5 Pet Photo Size — Base64 Storage Issue

**Problem:** Pet photos stored as raw base64 data URIs in IndexedDB. A 12MP phone photo becomes 8–12MB in the database. IndexedDB has a 50MB default limit on some devices.

**Fix — Compress before storing:**
```typescript
// In Profile.tsx, before saving:
const compressImage = (file: File, maxWidth: number = 400): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality JPEG
    };
    img.src = URL.createObjectURL(file);
  });
};
```
This reduces a 8MB photo to ~50KB before storage.

---

### 2.6 Navigation — 6 Items Exceeds Mobile Standard

**Problem:** Bottom nav has 6 items (Home, Sounds, Training, Log, Guide, Profile). Standard is max 5. On small screens some labels truncate.

**Fix options:**
- Merge Guide into Training (add "Reference" tab within Training page)
- Move Guide into Profile (as "Wellness Library")
- Or reduce label size and accept 6 items with smaller text

---

### 2.7 Sound Loading Indicator for Large Files

**Problem:** `creek-water.mp3` (2.1MB) takes 2–4 seconds to start on mobile. Users tap Play, nothing happens, they tap again.

**Fix in `Sounds.tsx`:**
```typescript
const [isBuffering, setIsBuffering] = useState(false);

// In audio setup:
audio.addEventListener('waiting', () => setIsBuffering(true));
audio.addEventListener('playing', () => setIsBuffering(false));
audio.addEventListener('canplaythrough', () => setIsBuffering(false));

// In card UI, replace Play icon with spinner when buffering:
{activeSoundId === sound.id && isBuffering ? (
  <div className="animate-spin w-5 h-5 border-2 border-secondary border-t-transparent rounded-full" />
) : isPlaying ? (
  <Pause size={20} />
) : (
  <Play size={20} />
)}
```

---

## PHASE 3 — Performance Optimizations ✅ DONE

### 3.1 Code Split Recharts (Cuts Bundle ~200KB)

**Problem:** Main bundle is 791KB. Recharts (~200KB minified) loads even on pages that don't use charts.

**Fix in `vite.config.ts`:**
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        recharts: ['recharts'],
        lucide: ['lucide-react'],
      }
    }
  }
}
```
Expected result: Initial bundle drops from 791KB → ~400KB. Charts load lazily only on BehaviorLog page.

---

### 3.2 Memoize Mood Chart Data

**Problem:** 7-day mood chart recalculates on every render, including unrelated state changes.

**Fix in `Home.tsx`:**
```typescript
const chartData = useMemo(() =>
  Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return { date: key, log: moodLogs.find(l => l.date === key) };
  }),
  [moodLogs] // only recalculate when moodLogs changes
);
```

---

### 3.3 Paginate Behavior Log

**Problem:** `useIncidents()` loads all incidents from IndexedDB at once. At 1,000+ incidents this causes lag.

**Fix in `db.ts`:**
```typescript
// Add paginated query
async getIncidentsPaginated(offset: number, limit: number = 20): Promise<Incident[]> {
  return db.incidents.orderBy('date').reverse().offset(offset).limit(limit).toArray();
}
```

---

### 3.4 BottomSheet Mouse Listener Cleanup

**Problem:** `BottomSheet.tsx` adds `mousemove` and `mouseup` listeners to `window` but if the component unmounts mid-drag, the listeners stay attached permanently (memory leak).

**Fix in `BottomSheet.tsx`:**
```typescript
// Store cleanup refs
const cleanupRef = useRef<(() => void) | null>(null);

useEffect(() => {
  return () => {
    // Cleanup any pending mouse listeners on unmount
    cleanupRef.current?.();
  };
}, []);

const onMouseDown = (e: React.MouseEvent) => {
  const onMouseMove = ...;
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    cleanupRef.current = null;
  };
  cleanupRef.current = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};
```

---

## PHASE 4 — New Features (Post-Launch Growth) ✅ DONE

### 4.1 Vet Report PDF Export ⭐ (Highest User Value)

Allow users to export a 1-page PDF summary of their pet's behavior data to share with their vet.

**Library:** `jsPDF` (80KB, MIT license)

**Content of report:**
- Pet name, breed, age, known triggers
- Last 30-day incident chart
- Average severity trend
- Training programs completed
- Notes from most severe incidents
- Generated on: [date]

**Implementation:**
```bash
npm install jspdf
```
```typescript
// In BehaviorLog.tsx — add "Export for Vet" button
import jsPDF from 'jspdf';

const exportVetReport = () => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text(`${petName}'s Anxiety Report`, 20, 20);
  // ... add data
  doc.save(`${petName}-behavior-report.pdf`);
};
```

---

### 4.2 Sound Mixing — Play 2 Sounds Simultaneously

Very common request in competitor apps (Calm, Relax Melodies). Allow layering rain + white noise, for example.

**UI change in `Sounds.tsx`:**
- Change from single `activeSoundId` to `activeSound1` and `activeSound2`
- Add a "Mix" toggle button on each sound card
- Show dual waveform in the mini player

---

### 4.3 Training Session Built-in Timer

Currently users need to use their phone's clock app during training steps (e.g., "Hold for 5 minutes"). This context-switches away from the app.

**Add to `Training.tsx` step view:**
```typescript
const [stepTimer, setStepTimer] = useState<number | null>(null);
const [timerRunning, setTimerRunning] = useState(false);

// Parse duration string from step (e.g., "5 mins" → 300 seconds)
const parseDuration = (str: string): number => {
  const mins = str.match(/(\d+)\s*min/)?.[1];
  const reps = str.match(/(\d+)\s*rep/)?.[1];
  return mins ? parseInt(mins) * 60 : reps ? parseInt(reps) * 10 : 60;
};
```
Show a countdown ring during the step. Vibrate on completion.

---

### 4.4 Weekly AI Progress Report

Every Sunday, generate and display a weekly summary using Gemini:

```typescript
// Auto-generate if last 7 days have 3+ mood logs and 1+ incident
const weeklyPrompt = `
Summarize this pet's anxiety week:
- Average mood: ${avgMood}/5
- Incidents: ${incidents.length} (avg severity: ${avgSeverity})
- Training sessions: ${sessionsThisWeek}
- Top trigger: ${topTrigger}

Write 3 sentences: 1 summary, 1 positive observation, 1 actionable recommendation.
`;
```
Show in a "Weekly Wrap" card on the Home screen every Monday morning.

---

### 4.5 Breed-Specific Tips

Map pet breed to known behavioral predispositions and personalize the Daily Tip.

```typescript
// Add to constants.ts
const BREED_TIPS: Record<string, string[]> = {
  'Border Collie': [
    'Border Collies are hypersensitive to movement — use visual barriers during noise exposure.',
    'Their herding instinct can amplify anxiety. Channel it with nose work instead.',
  ],
  'Chihuahua': [
    'Chihuahuas often have "small dog syndrome" anxiety. Avoid carrying them — let them walk.',
  ],
  'Siamese': [
    'Siamese cats are highly vocal when anxious. Responding to vocalizations increases the behavior.',
  ],
  // ...
};

// In Home.tsx, show breed tip before the generic daily tip rotation
const breedTip = BREED_TIPS[pet.breed]?.[Math.floor(Date.now() / 86400000) % (BREED_TIPS[pet.breed]?.length ?? 1)];
```

---

### 4.6 Community Tips (Read-Only Feed)

A curated, moderated list of owner-submitted tips organized by trigger. Read-only for MVP to avoid moderation burden.

**Data model:**
```typescript
interface CommunityTip {
  id: string;
  trigger: string;
  breedTag?: string;
  tip: string;
  upvotes: number;
  source: 'verified_owner' | 'vet_contributed';
}
```
Serve from a static JSON file hosted on GitHub or Cloudflare CDN. Update manually weekly. No backend needed for v1.

---

### 4.7 Accessibility Improvements

**Missing:**
- ARIA labels on all icon-only buttons
- `alt` text on pet images
- Focus trap inside BottomSheet when open
- Color-blind safe severity indicators (add icon + color, not color alone)
- Screen reader announcements for breathing exercise stage changes

**Quick win example:**
```tsx
// In Layout.tsx
<button aria-label="Emergency calm mode" onClick={onPanic}>
  <AlertCircle size={28} />
</button>
```

---

### 4.8 Offline Service Worker Fix

**Problem:** `sw.js` exists but is not registered in `index.html`. The PWA is not actually offline-capable for the app shell.

**Fix in `index.html`:**
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

---

### 4.9 Error Boundary Component

**Problem:** Any unhandled React render error crashes the entire app with a blank white screen.

**Fix — Create `components/ErrorBoundary.tsx`:**
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
          <span className="text-5xl mb-4">🐾</span>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-neutral-subtext mb-6">PetCalm had an unexpected error.</p>
          <button onClick={() => window.location.reload()}>Restart App</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```
Wrap `<App />` in `main.tsx` with `<ErrorBoundary>`.

---

### 4.10 Dark Mode

```typescript
// tailwind.config (in index.html CDN config)
darkMode: 'class'

// App.tsx — detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);
```

---

## Technical Debt

| File | Issue | Severity |
|---|---|---|
| `BehaviorLog.tsx:194` | `as any` cast for severity | Low |
| `Training.tsx` | Race condition between local state and Dexie save | Medium |
| `Sounds.tsx:120` | Silent audio playback failure | High |
| `BottomSheet.tsx` | Mouse listener memory leak | Medium |
| `geminiService.ts` | Hardcoded model name `'gemini-3-flash-preview'` | Medium |
| `constants.ts` | id '3' and '5' both use `generate:brown` | Low |
| `Home.tsx:180+` | Missing `useMemo` on mood chart calculation | Low |
| All pages | No ARIA labels on interactive elements | Medium |
| `App.tsx` | No error boundary | High |

---

## Implementation Priority Matrix

| Priority | Effort | Items |
|---|---|---|
| P0 (Do Now) | Low | App icons, fix duplicate sound, register service worker, error boundary |
| P0 (Do Now) | Medium | API key proxy, crash reporting, splash screen |
| P1 (Pre-Launch) | High | Push notifications, privacy policy |
| P2 (Week 2) | Medium | Multi-pet, audio error feedback, loading indicator |
| P2 (Week 2) | Medium | Code splitting, image compression, BottomSheet cleanup |
| P3 (Month 2) | High | Vet PDF export, sound mixing, weekly AI report |
| P4 (Month 3+) | Very High | Backend (auth + cloud sync), payments/subscriptions |

---

*Generated: Feb 2026 | Version: 1.0 | Next review: After Phase 1 completion*
