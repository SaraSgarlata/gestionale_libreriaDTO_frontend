# `src/app/services`

Classi `@Injectable({ providedIn: 'root' })` (singleton) che incapsulano la
**comunicazione HTTP con il backend**. I componenti non chiamano mai `HttpClient`
direttamente: passano sempre da un service.

```
Componente (UI) → Service → HttpClient (+ authInterceptor) → Spring Boot
```

---

## `auth.ts` — `AuthService`

Gestisce login e ciclo di vita del token.

| Membro | Cosa fa |
|---|---|
| `TOKEN_KEY = 'auth_token'` | chiave usata in `localStorage` |
| `login(credenziali: AuthRequest)` | `POST http://localhost:8080/auth/login` → `Observable<AuthResponse>` |
| `saveToken(token)` | `localStorage.setItem(TOKEN_KEY, token)` |
| `getToken()` | `localStorage.getItem(TOKEN_KEY)` → `string | null` |
| `removeToken()` | `localStorage.removeItem(TOKEN_KEY)` (logout) |
| `isAuthenticated()` | `true` se un token è presente |

Usato da: `Login` (login + salvataggio), `ListaLibri` (logout), `authGuard`
(`isAuthenticated`), `authInterceptor` (`getToken` / `removeToken`).

---

## `libroService.ts` — `LibroService`

Operazioni sul catalogo libri.

| Metodo | Chiamata | Ritorno |
|---|---|---|
| `getListaLibri(filtro?: string)` | `GET http://localhost:8080/findalllibro` (+ query param `?filtro=` se passato) | `Observable<Libro[]>` — è il **backend** a filtrare i libri nella query SQL |
| `salvaLibroConAutore(dati)` | `POST http://localhost:8080/createnewlibroconautore` (body = `{ libroRequest, autoreRequest }`) | `Observable<Libro>` |

Usato da: `ListaLibri` (`getListaLibri`), `FormInserimentoLibro` (`salvaLibroConAutore`).

---

## Note

- L'header `Authorization` **non** viene aggiunto qui: lo inserisce
  `authInterceptor` per ogni richiesta uscente.
- Base URL `http://localhost:8080` ripetuto e hardcoded in entrambi i file →
  candidato a essere spostato in `src/environments/`.
- `salvaLibroConAutore` accetta `dati: any`: nessuna tipizzazione forte del payload.
- `libro.spec.ts` è lo scheletro di test generato da Angular CLI (il service è in
  `libroService.ts`, non `libro.ts`).
