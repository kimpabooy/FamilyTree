# FamilyTree — Frontend

Kort om projektet

- Ett React + TypeScript-projekt byggt med Vite.
- UI använder `@xyflow/react` för graf-visualisering (React Flow-liknande komponenter) tillsammans med `dagre` för automatisk layout.
- Syftet är att skapa, visa och redigera släktträd med personer, förälder-barn-relationer och partner-relationer.

# Installation

1. Installera beroenden:

```bash
npm install
```

2. Starta dev-servern:

```bash
npm run dev
```

3. Bygg för produktion:

```bash
npm run build
```

# Projektstruktur (viktigaste filer och mappar)

Root:

- `package.json` - skript och beroenden
- `vite.config.ts`, `index.html` - Vite-setup
  src/ (källkod)

- `main.tsx` - app-root och `BrowserRouter`
- `App.tsx` - routes och layout (Header, Footer, SidePanel)
- `App.css` - globala stilar.
- `.env` - miljövariabler.

- `components/`
  - `Flow/`
    - `canvas/FamilyTreeCanvas.tsx` — ren wrapper runt `@xyflow/react`; renderar canvas, Controls, MiniMap och bakgrund. Ingen domänlogik här.
    - `views/FamilyTreeView.tsx` — komponent för att visa ett befintligt träd (hämtar data via hook och hanterar edit-events).
    - `workflows/`
      - `CreateFamilyTreeEditor.tsx` — UI och flöde för att skapa nytt träd (formulär + canvas + spara mot backend).
      - `PartnerRelationDialog.tsx` — bekräftelsedialog för att skapa partner-relation.
      - `RelationTypeDialog.tsx` — dialog som dyker upp när användaren drar en linje mellan två noder och ska välja relationstyp.
    - `nodes/` — custom node-komponenter (t.ex. `PersonNode.tsx`, `DeceasedPersonNode.tsx`).
    - `edges/FamilyRelationEdge.tsx` — custom renderer för kanter (visar delete-knapp på kanten).

- `components/layout/` — `Header`, `Footer`, `sidepanel` (app-layout)
- `components/Ui/` — generella UI-komponenter (t.ex. `Button.tsx`) och eventuella återanvändbara dialoger om du vill hålla dem separata.

- `hooks/`
  - `useCreateFamilyTreeEditor.ts` — lokal editor-logik (skapar lokala noder/kanter och sparar allt till backend)
  - `useFamilyTreeView.ts` — logik för att ladda ett träd från backend och exponera funktioner för att lägga till/ta bort relationer

- `pages/`
  - `Home.tsx`, `CreateFamily.tsx`, `Familytree.tsx`, `About.tsx`, `Contact.tsx`, `AuthPage.tsx` — app-routes

- `services/` — wrapper runt nätverkskall (`Api.ts`) och domänspecifika service-funktioner (`FamilytreeService.ts`, `PersonService.ts`, `RelationService.ts`, `AuthService.ts`)

- `types/` — gemensamma TypeScript-typer (`Enums.ts`, `Models.ts`, `Requests.ts`)

# Design- och arkitektur

- Separation av ansvar:
  - rendering (`canvas`)
  - vy/visning (`views`)
  - arbetsflöden/editors (`workflows`)
  - affärslogik i hooks (`hooks`)
  - API-access i services (`services`)

# Hur projektet kör API-anrop

- `src/services/Api.ts` innehåller `apiFetch` som läser bas-URL från `VITE_API_URL` och bifogar JWT-token från `localStorage`.
- Övriga services implementerar endpoints för träd, personer och relationer.

---

# Filstruktur

```text
src/
├─ App.css
├─ App.tsx
├─ main.tsx
├─ assets/
│  ├─ background-tree.Webp
│  ├─ heart.png
│  ├─ logo.png
│  ├─ picture.jpg
│  ├─ qr-github-icon.png
│  ├─ qr-instagram-icon.png
│  └─ qr-linkedin-icon.png
├─ components/
│  ├─ Flow/
│  │  ├─ canvas/
│  │  │  ├─ FamilyRootCanvas.tsx
│  │  │  └─ FamilyTreeCanvas.tsx
│  │  ├─ edges/
│  │  │  └─ FamilyRelationEdge.tsx
│  │  ├─ nodes/
│  │  │  ├─ DeceasedPersonNode.tsx
│  │  │  └─ PersonNode.tsx
│  │  ├─ views/
│  │  │  └─ FamilyTreeView.tsx
│  │  └─ workflows/
│  │     ├─ CreateFamilyTreeEditor.tsx
│  │     ├─ PartnerRelationDialog.tsx
│  │     └─ RelationTypeDialog.tsx
│  ├─ layout/
│  │  ├─ Footer.tsx
│  │  ├─ Header.tsx
│  │  └─ sidepanel.tsx
│  └─ Ui/
│     └─ Button.tsx
├─ hooks/
│  ├─ useCreateFamilyTreeEditor.ts
│  └─ useFamilyTreeView.ts
├─ pages/
│  ├─ About.tsx
│  ├─ AuthPage.tsx
│  ├─ Contact.tsx
│  ├─ CreateFamily.tsx
│  ├─ Familytree.tsx
│  └─ Home.tsx
├─ services/
│  ├─ Api.ts
│  ├─ AuthService.ts
│  ├─ FamilytreeService.ts
│  ├─ PersonService.ts
│  └─ RelationService.ts
└─ types/
  ├─ Enums.ts
  ├─ Models.ts
  └─ Requests.ts

Other root files...
```
