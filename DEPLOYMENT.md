# PetCalm — Google Play Store Deployment Guide

## Prerequisites
- Android SDK at `~/android-sdk`
- Java 17 at `/usr/lib/jvm/java-17-openjdk-amd64`
- Release keystore (see Step 1)
- Google Play Console account ($25 one-time fee)

---

## Step 1 — Create Release Keystore (one-time)

```bash
keytool -genkey -v \
  -keystore ~/petcalm-release.keystore \
  -alias petcalm \
  -keyalg RSA -keysize 2048 -validity 10000
```

> **CRITICAL**: Back up `~/petcalm-release.keystore` to a safe location (cloud storage, USB drive).
> Losing this file means you can never update your app on the Play Store.

---

## Step 2 — Configure Signing in `android/app/build.gradle`

Add inside the `android { }` block:

```groovy
signingConfigs {
  release {
    storeFile file(System.getenv("KEYSTORE_PATH") ?: "${System.getProperty('user.home')}/petcalm-release.keystore")
    storePassword System.getenv("KEYSTORE_PASS") ?: "your_store_pass"
    keyAlias "petcalm"
    keyPassword System.getenv("KEY_PASS") ?: "your_key_pass"
  }
}
buildTypes {
  release {
    signingConfig signingConfigs.release
    minifyEnabled false
  }
}
```

---

## Step 3 — Build Signed Release AAB

Play Store requires AAB (Android App Bundle), not APK.

```bash
npm run build && \
cp -r dist/* android/app/src/main/assets/public/ && \
cd android && \
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 \
ANDROID_HOME=$HOME/android-sdk \
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Copy to Windows Downloads (WSL):
```bash
cp android/app/build/outputs/bundle/release/app-release.aab \
  /mnt/c/Users/ayaz.ali/Downloads/PetCalm-release.aab
```

---

## Step 4 — Host Privacy Policy at a Public URL

Google Play requires a **live public URL** for your privacy policy (the in-app page alone is not sufficient).

**Free options:**
- GitHub Pages: push `privacy.html` to `gh-pages` branch → `yourusername.github.io/petcalm/privacy`
- Notion: paste policy into a Notion page → Share → Publish to web
- Netlify: drag-and-drop a single HTML file → free subdomain

---

## Step 5 — Google Play Console Setup

1. Go to [play.google.com/console](https://play.google.com/console)
2. Pay $25 one-time developer registration fee
3. Create new app:
   - Name: `PetCalm – Pet Anxiety Relief`
   - Application ID: `com.petcalm.app`
   - Default language: English (United States)
4. Upload `.aab` to **Internal Testing** track first — test on 1 real device before production

---

## Step 6 — Store Listing Assets

| Asset | Size | Notes |
|-------|------|-------|
| App icon | 512×512 PNG | Transparent background not allowed |
| Feature graphic | 1024×500 PNG | Hero banner shown at top of listing |
| Phone screenshots | Min 2, max 8 | 16:9 or 9:16 ratio |
| Short description | ≤80 chars | `"Calm your anxious pet with sounds, training & behavior tracking"` |
| Full description | ≤4000 chars | Lead with top keywords (see REVENUE.md ASO section) |

**Suggested screenshot order** (from REVENUE.md):
1. "Calm Your Anxious Pet in Minutes" — Home screen
2. "25+ Scientifically-Chosen Sounds" — Sounds grid
3. "Vet-Approved Training Programs" — Program detail view
4. "Track Triggers & See Progress" — BehaviorLog charts
5. "Evidence-Based Medical Guide" — Guide cards

---

## Step 7 — Data Safety Form

In Play Console → Data Safety, declare:

| Data type | Collected? | Notes |
|-----------|-----------|-------|
| Personal info | No | No accounts, no email |
| Location | No | Not used |
| Pet data (name, breed, logs) | No (stays on device) | Stored in IndexedDB/Dexie locally |
| AI prompts | Yes — not sold | Sent to Cloudflare Worker (user-initiated only), not stored |
| Analytics | No | No analytics SDK installed |

- **Data sold to third parties**: No
- **Data shared for third-party advertising**: No

---

## Step 8 — Content Rating

Complete the IARC questionnaire in Play Console.
Expected rating: **Everyone** (no violence, no mature content, no user interaction/social features).

---

## Step 9 — Version Management

Increment `versionCode` (integer, must increase) and `versionName` (display string) in `android/app/build.gradle` before every upload:

```groovy
versionCode 2        // must be higher than previous upload
versionName "1.1"    // shown to users
```

---

## Step 10 — Pre-Submission Checklist

- [ ] Test debug APK on a **real Android device** (not just emulator)
- [ ] Verify Gemini AI weekly report works (Cloudflare Worker URL in `.env`)
- [ ] Test in-app review triggers (graceful silent-fail in browser, native dialog on device)
- [ ] Verify PDF export produces a readable vet report
- [ ] Check all sounds play: Nature MP3s, noise generators, purr generator, binaural beats
- [ ] Check sound mix feature (secondary audio channel)
- [ ] Test training timer countdown + vibration on completion
- [ ] Confirm push notification permission prompt appears on first launch
- [ ] Verify privacy policy URL is live and accessible
- [ ] `versionCode` incremented from last build

---

## Build Commands Reference

### Debug APK (for sideload testing)
```bash
npm run build && \
cp -r dist/* android/app/src/main/assets/public/ && \
cd android && \
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 \
ANDROID_HOME=$HOME/android-sdk \
./gradlew assembleDebug && \
cp app/build/outputs/apk/debug/app-debug.apk \
  /mnt/c/Users/ayaz.ali/Downloads/PetCalm.apk
```

### Release AAB (for Play Store upload)
```bash
npm run build && \
cp -r dist/* android/app/src/main/assets/public/ && \
cd android && \
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 \
ANDROID_HOME=$HOME/android-sdk \
./gradlew bundleRelease && \
cp app/build/outputs/bundle/release/app-release.aab \
  /mnt/c/Users/ayaz.ali/Downloads/PetCalm-release.aab
```

---

## Timeline Estimate

| Task | Time |
|------|------|
| Keystore + signing config | 15 min |
| Build release AAB | 5 min |
| Host privacy policy | 30 min |
| Play Console setup + store listing | 2–3 hours |
| Screenshots creation | 1–2 hours |
| Data safety + content rating forms | 30 min |
| Google review after submission | 3–7 days |
