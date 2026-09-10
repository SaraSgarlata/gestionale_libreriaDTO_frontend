# `frontend/src/app`

Applicazione vera e propria: shell, configurazione, routing e le cartelle funzionali.

---

## File di configurazione e shell

| File | Ruolo |
|---|---|
| `app.ts` | Componente radice `App` (`selector: app-root`). Importa `RouterOutlet`, espone un `title` come `signal`. Fa da contenitore. |
| `app.html` | Template della shell: solo `<router-outlet />` (più commenti placeholder). La schermata visibile dipende dalla rotta. |
| `app.css` | Vuoto (nessuno stile di shell). |
| `app.config.ts` | `appConfig: ApplicationConfig` con i provider globali: `provideRouter(routes)`, `provideHttpClient(withInterceptors([authInterceptor]))`, error listeners, zone change detection con event coalescing. |
| `app.routes.ts` | Tabella delle rotte (vedi sotto). |

### Rotte (`app.routes.ts`)

| Path | Componente | Note |
|---|---|---|
| `login` | `Login` | Pagina di accesso. |
| `libri` | `ListaLibri` | Protetta da `canActivate: [authGuard]`. |
| `''` (vuoto) | — | `redirectTo: '/login'`, `pathMatch: 'full'`. |

Non esiste una rotta wildcard `**`: un URL sconosciuto non viene gestito.

---

## Cartelle funzionali

| Cartella | Responsabilità | Documentazione |
|---|---|---|
| `components/` | Le schermate/He UI: `login`, `lista-libri`, `form-inserimento-libro`. Ogni componente è standalone (`.ts` + `.html` + `.css`). | `components/DOCUMENTAZIONE.md` |
| `services/` | Classi `@Injectable` che parlano col backend via `HttpClient`: `AuthService`, `LibroService`. | `services/DOCUMENTAZIONE.md` |
| `guards/` | `authGuard`: consente l'accesso a `/libri` solo se c'è un token. | `guards/DOCUMENTAZIONE.md` |
| `interceptors/` | `authInterceptor`: allega `Authorization: Bearer <token>` e gestisce `401/403`. | `interceptors/DOCUMENTAZIONE.md` |
| `models/` | Interfacce TypeScript che rispecchiano i DTO/Request del backend. | `models/DOCUMENTAZIONE.md` |

---

## Dipendenze tra le parti

```
components/login            → services/auth              → POST /auth/login
components/lista-libri       → services/libroService      → GET  /findalllibro
components/lista-libri       → services/auth (logout)
components/lista-libri       → components/form-inserimento-libro (MatDialog)
components/form-inserimento-libro → services/libroService → POST /createnewlibroconautore

guards/auth-guard           → services/auth (isAuthenticated)
interceptors/auth-interceptor → services/auth (getToken/removeToken)
tutti i services            → models/* (tipizzazione di richieste e risposte)
```
