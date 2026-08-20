# NYN CN System

Private web app for creating, printing, and archiving NYN Services Enterprise
container Consignment Notes (CN). Replaces the manual "edit the PDF in
Firefox" workflow with a form -> auto CN number -> Firebase -> print flow.

See `FIELD_MAPPING.md` for how every field in the original PDF maps to the
data model, and the priority note below before changing the print layout.

## 1. Setup (local dev)

```bash
npm install
# .env is already filled in with your nyn-services-enterprise Firebase config
npm run dev
```

## 2. Firebase project (already created: `nyn-services-enterprise`)

1. Authentication -> Sign-in method -> **Email/Password** must be enabled.
2. Authentication -> Users -> Add user — this is your login. This app has no
   public sign-up screen on purpose, since it's private.
3. Realtime Database (asia-southeast1) is already provisioned and the URL is
   already in `.env`.

## 3. Realtime Database security rules

Your current rules (`{"read": false, "write": false}`) block everyone,
including the app. Replace them in Realtime Database -> Rules with the
rules below. These lock every path to **only your account**
(`eaP7jvVUL5U4iuQCQB5WaFMUQo72`) rather than "any logged-in user" — tighter,
since this is a single-user private app. If you ever add a second staff
login, add their UID to the same `||` list.

```json
{
  "rules": {
    "consignments": {
      ".read": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'",
      ".write": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'",
      ".indexOn": ["createdAt", "date", "cnNumber", "bkgRef", "collectionFrom"]
    },
    "consignments_by_cn": {
      ".read": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'",
      ".write": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'"
    },
    "counters": {
      ".read": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'",
      ".write": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'"
    },
    "depots": {
      ".read": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'",
      ".write": "auth != null && auth.uid === 'eaP7jvVUL5U4iuQCQB5WaFMUQo72'"
    },
    "$other": {
      ".read": false,
      ".write": false
    }
  }
}
```

## 3b. Deploying on Netlify (free tier, no server needed)

1. Push this project to a GitHub/GitLab repo (or drag-and-drop the folder
   into Netlify's manual deploy).
2. In Netlify: **Add new site -> Import from Git** (or drag-and-drop the
   built `dist` folder for a one-off deploy).
3. Build settings (already set in `netlify.toml`, Netlify will pick these
   up automatically):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment variables: in Netlify -> Site settings -> Environment
   variables, add the same 7 `VITE_FIREBASE_*` keys that are in your local
   `.env` (Netlify doesn't read your local `.env` file — it needs its own
   copy for the build). `.env` is git-ignored on purpose so it never ends
   up in a public repo.
5. `netlify.toml` / `public/_redirects` are already set up to send every
   route to `index.html`, which React Router needs — without this,
   refreshing on `/history` or `/consignment/abc123` would 404.
6. In Firebase Console -> Authentication -> Settings -> **Authorized
   domains**, add your Netlify URL (e.g. `your-site-name.netlify.app`) once
   you have it, or Firebase Auth will reject logins from that domain.

## 4. Data model

```
consignments/{id}
  cnNumber, shipmentType, portType, collectionFrom, deliverTo, remarks,
  shippingAgent, etaDate, operatorCode, openingDate,
  containerNumber1, containerNumber2, closingDate, mtPortRef, bkgRef,
  dischargeTerminal, sizeType, vesselName,
  driverName, icNo, primeMoverNo, trailerNo, date,
  createdAt, updatedAt, createdBy

consignments_by_cn/{cnNumber} -> consignment id   (fast exact-match lookup)
counters/{year} -> integer                        (atomic CN numbering)
depots/{id} -> { name, code, status }
```

## 5. Search strategy

Realtime Database only indexes one field per query. The app handles this by:
- **Exact CN number** -> direct lookup via `consignments_by_cn` (instant, no scan).
- **Date / date range** -> indexed query on `date`, then filters further in memory.
- **Everything else** -> pulls the most recent records (bounded, not the whole
  database) and filters in memory — fine at this scale (thousands of records).

If the archive grows past ~10-20k records, add more denormalized index nodes
(e.g. `consignments_by_booking/{bkgRef} -> id`) the same way `consignments_by_cn`
works, rather than switching databases.

## 6. Printing

- `src/styles/print.css` fixes the CN to an exact A4 canvas (`@page { size: A4;
  margin: 0; }`) and hides everything else (`.no-print`) when printing.
- `ConsignmentNote.jsx` renders the SAME data object twice (top + bottom
  copy) so a design change only has to happen in one place.
- Test at 100% scale, portrait, in both Chrome and Firefox print preview,
  and via "Save as PDF" before relying on this for real jobs.
- If your printed spacing drifts from the original PDF (fonts/margins can
  render a millimeter or two differently across browsers), the values to
  tweak first are the `mm` sizes in `.cn-page`, `.cn-copy`, `.cn-logo`, and
  `.cn-table` in `print.css` — they were set from the original PDF's visible
  proportions and may need a small nudge once you print-test on your printer.

## 7. What's intentionally NOT built yet (v1 scope, per project brief)

Multiple user roles, customer/driver databases, Excel export, reports,
duplicate-CN, email/WhatsApp sharing, audit log — all listed as "future
possibilities" in the brief, not v1.

## 8. Priority reminder

Per the brief: CN/PDF accuracy > correct A4 printing > data storage > fast
data entry > search/history > auth > UI polish > extras. If something has to
give, protect the print output first.
