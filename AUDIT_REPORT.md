# PetCalm App Audit Report

## Real-World Use Case

PetCalm occupies a genuinely underserved niche. The global pet anxiety market is growing — an estimated 70% of dogs and 40% of cats show anxiety-related behaviors, and vet behaviorist waitlists are 6-12 months long in most cities.

### Target Users

| Priority | User Segment | Use Case |
|----------|--------------|----------|
| **Primary** | Dog/cat owners | Noise phobia (fireworks, thunder), separation anxiety, or vet visit fear |
| **Secondary** | New pet owners | Unaware evidence-based protocols exist |
| **Tertiary** | Multi-pet households | Managing inter-animal stress |

### Clinical Validation

The content is genuinely clinically sound:
- **Karen Overall's Relaxation Protocol**
- **BAT 2.0**
- **Fear Free methodology**
- **TTouch**

These are real, respected frameworks used by certified veterinary behaviorists — a significant differentiator over generic pet apps.

---

## App Store Readiness: NOT YET

### Blockers (Must Fix Before Submission)

| Issue | Why It's Blocking |
|-------|-------------------|
| **No app icons** | `public/icons/icon-192.png` and `icon-512.png` referenced in manifest but don't exist. App Store requires all icon sizes |
| **No push notifications** | Reminders exist in UI but fire nothing when app is closed. Users will feel the app is broken |
| **API key exposed** | Gemini key is compiled into the JS bundle via Vite define. Anyone can extract it from the APK |
| **No privacy policy** | Both Google Play and Apple App Store legally require one for apps that collect any personal data (pet photos, behavioral logs) |
| **Single pet only** | Most households have 2+ pets; no way to switch between profiles |
| **No error recovery UI** | If IndexedDB fails or audio fails, user sees nothing |
| **No splash screen** | Capacitor builds show a blank white screen on launch |

### Nice-to-Have Before Submission

- [ ] App rating/review prompt after 5 sessions
- [ ] Onboarding screenshots for store listing
- [ ] Localization (Spanish, French, German are top pet app markets)
- [ ] Tablet layout (iPad support required for iOS universal)

---

## Revenue Generation

### Recommended Model: Freemium + One-Time Purchase

#### Free Tier (Keep As-Is)
- 1 pet profile
- 3 nature sounds (rain, birds, one noise)
- 3 training programs (basic desensitization)
- Behavior logging (up to 10 incidents)
- Daily tips
- Panic Mode

#### PetCalm Pro (~$4.99/month or $29.99/year)
- Unlimited pets
- All 14 sounds + sound mixing (play rain + white noise simultaneously)
- All 10 training programs + downloadable session worksheets (PDF export)
- Unlimited behavior log + AI pattern analysis (unlimited Gemini calls)
- Cloud backup & multi-device sync
- Weekly AI-generated progress reports emailed to owner + vet
- Push notification reminders that actually fire

#### One-Time Purchases ($1.99 each)
- **Species Packs** — add rabbit, bird, horse profiles with species-specific protocols
- **Sound Packs** — 10 additional sounds (thunderstorm simulator, dog park ambience for desensitization)

### B2B / Vet Clinic Licensing (~$49/month per clinic)

This is the highest-potential revenue stream. Vet clinics could:
- White-label the app for their clients
- Receive behavior logs directly (owner shares report PDF)
- Recommend specific training programs post-consultation

&gt; The Guide page already has the DACVB referral content — this bridges the gap perfectly.

### Affiliate Revenue (Passive)
- Link to Adaptil/Feliway/Zylkene products in the Guide page (Amazon Associates or Chewy affiliate program)
- ThunderShirt affiliate link in the safe space section

---

## Current Cons

### Critical

| Issue | Impact |
|-------|--------|
| **Reminders do nothing** | The most dangerous UX lie in the app. Users set reminders expecting notifications. Nothing fires. This will drive 1-star reviews immediately. |
| **Data can be wiped** | localStorage/IndexedDB is cleared when Android clears app data or browser clears cache. No cloud backup = permanent data loss. Users tracking months of behavior logs will be devastated. |
| **Single pet** | The majority of households this targets have multiple pets. There's no way to switch profiles. |
| **Gemini API key in bundle** | Any user with apktool can extract your API key and rack up unlimited charges on your account. This is a real security and financial risk. |

### UX/Product

| Issue | Details |
|-------|---------|
| **No onboarding education** | The app assumes users know what "DSCC" or "TTouch" means. First-time users will be confused by jargon. |
| **Training progress resets** | `completedStepIndex` is stored but the UI doesn't resume from where you left off visually in a compelling way. No "Continue training" CTA on the home screen. |
| **Sounds play silently on Android if phone is muted** | No warning. Users think the app is broken. |
| **Creek Water (2.1MB) loads slowly** | The largest sound file takes 3-5 seconds to start on mobile. No loading state shown. |
| **No search** | 10 training programs is manageable, but with 20+ it becomes hard to find the right one. |
| **Bottom nav has 6 items** | Standard mobile UX guidelines recommend max 5. The Guide nav item pushes it over. Consider merging Guide into Profile or Training. |

### Technical

| Issue | Details |
|-------|---------|
| **No crash reporting** | When something breaks in production, you have no way to know. No Sentry, no Firebase Crashlytics. |
| **Bundle is 791KB (uncompressed)** | Large for a mobile app. Main culprit is likely recharts. Could be halved with code splitting. |
| **No image optimization** | Pet photos stored as raw base64 data URIs in IndexedDB. A 4K photo stored this way can be 3-5MB in the database. |
| **Deep Sleep Frequencies and Brown Noise are the same sound** | Both use `generate:brown`. Users will notice. |

---

## How to Optimize It

### Quick Wins (1-2 days each)

#### 1. Fix the duplicate sound
```typescript
// constants.ts — change Deep Sleep Frequencies to generate:pink or a different frequency
url: 'generate:pink'  // currently same as Brown Noise