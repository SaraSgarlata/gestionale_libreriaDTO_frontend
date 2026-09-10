# Frontend — `gestionale-libreria-dto-frontend`

Single Page Application in **Angular 20** (standalone components, senza NgModule) con
**Angular Material** per la UI. È il client dell'API REST del backend: gestisce login,
elenco libri e inserimento di un nuovo libro.

---

## Come si avvia

| | |
|---|---|
| Requisiti | Node.js (LTS), npm |
| Install | `npm install` |
| Dev server | `npm start` → `ng serve` su `http://localhost:4200` |
| Build | `npm run build` → output in `dist/` |
| Test | `npm test` → Karma + Jasmine |

Il backend deve essere in ascolto su `http://localhost:8080` (URL scritto nei service).

---

## Stack

- **Angular 20.3** — framework, routing, reactive forms, HttpClient
- **Angular Material 20** + **CDK** — componenti UI (tabella, paginator, dialog, toolbar, snackbar, form field)
- **RxJS** — gestione delle risposte HTTP (`Observable`, `subscribe`)
- **TypeScript ~5.9**
- Build system: `@angular/build` (esbuild)

---

## Struttura

```
frontend/
├── angular.json            → configurazione build/serve/test
├── package.json            → dipendenze e script
├── public/                 → asset statici copiati as-is (favicon)
└── src/
    ├── main.ts             → bootstrap dell'applicazione
    ├── index.html          → pagina host, <app-root>, font Roboto + Material Icons
    ├── styles.css          → stili globali
    ├── custom-theme.scss   → tema Material 3 (palette azure)
    └── app/
        ├── app.ts / app.html / app.config.ts / app.routes.ts   → shell, config, rotte
        ├── components/     → schermate: login, lista-libri, form-inserimento-libro
        ├── services/       → comunicazione HTTP con il backend (auth, libri)
        ├── guards/         → protezione delle rotte (authGuard)
        ├── interceptors/   → authInterceptor (allega il token, gestisce 401/403)
        └── models/         → interfacce TypeScript (Libro, AuthRequest, AuthResponse)
```

Ogni sottocartella ha il proprio `DOCUMENTAZIONE.md`. Punto di partenza:
[`src/DOCUMENTAZIONE.md`](src/DOCUMENTAZIONE.md) → [`src/app/DOCUMENTAZIONE.md`](src/app/DOCUMENTAZIONE.md).

---

## Architettura runtime

```
                       ┌───────────────────────────────┐
   index.html          │           app (shell)         │
   <app-root>  ───────▶│   <router-outlet/>            │
                       └───────────────┬───────────────┘
                                       │  Angular Router (app.routes.ts)
                    ┌──────────────────┼─────────────────────┐
                    ▼                  ▼                     ▼
              /  → redirect      /login → Login       /libri → ListaLibri
                                    │                  (canActivate: authGuard)
                                    │                        │
                                    ▼                        ▼
                              AuthService              LibroService
                                    │                        │
                                    └────────┬───────────────┘
                                             ▼
                        HttpClient  +  authInterceptor (aggiunge Bearer <token>)
                                             │
                                             ▼
                                  Backend  http://localhost:8080
```

---

## Autenticazione lato client

1. **Login** (`Login` → `AuthService.login`) → `POST /auth/login` → riceve `{ token }`.
2. Il token viene salvato in `localStorage` con chiave `auth_token` (`AuthService.saveToken`).
3. **`authInterceptor`** intercetta ogni richiesta HTTP successiva e aggiunge
   l'header `Authorization: Bearer <token>`.
4. **`authGuard`** protegge `/libri`: se non c'è token, reindirizza a `/login`.
5. Su risposta `401`/`403` l'interceptor rimuove il token e riporta al login.
6. **Logout** (`ListaLibri.logout`) → `AuthService.removeToken()` + navigazione a `/login`.

---

## Funzionalità delle schermate

| Rotta | Componente | Cosa fa |
|---|---|---|
| `/login` | `Login` | Form reattivo username/password; al successo salva il token e va a `/libri`. |
| `/libri` | `ListaLibri` | Carica i libri da `GET /findalllibro`, li mostra in `mat-table` con **paginazione e ordinamento lato client**. Casella di **ricerca** (titolo / anno / autore) con debounce che richiama `GET /findalllibro?filtro=...`: il **filtro è applicato lato server** nella query SQL. Toolbar con logout. Pulsante che apre il dialog di inserimento. |
| *(dialog)* | `FormInserimentoLibro` | Form reattivo (dati libro + autore); invia `POST /createnewlibroconautore`, mostra una snackbar, chiude il dialog e fa ricaricare la lista. |

---

## Note

- L'URL del backend (`http://localhost:8080`) è **hardcoded** in `services/auth.ts` e
  `services/libroService.ts`. Per più ambienti conviene spostarlo in
  `src/environments/`.
- La paginazione/ordinamento della lista è gestita da `MatTableDataSource` in memoria;
  gli endpoint di paginazione del backend non sono usati dal frontend. Il **filtro**
  della lista è invece lato server (`?filtro=` su `GET /findalllibro`).
- I file `*.spec.ts` sono gli scheletri di test generati da Angular CLI.
