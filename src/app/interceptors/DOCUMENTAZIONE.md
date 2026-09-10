# `src/app/interceptors`

Interceptor HTTP: intercettano **ogni** richiesta/risposta che passa da `HttpClient`.
Registrato in `app.config.ts` con
`provideHttpClient(withInterceptors([authInterceptor]))`.

## `auth-interceptor.ts` — `authInterceptor`

`HttpInterceptorFn` funzionale. Usa `inject()` per `AuthService` e `Router`.

### In uscita (request)
```
token = AuthService.getToken()
se token presente:
  clona la richiesta aggiungendo header  Authorization: Bearer <token>
inoltra la richiesta
```
È il motivo per cui i `services/` non devono gestire l'header a mano.

### In entrata (gestione errori)
Con `catchError` sulla risposta:

| Condizione | Azione |
|---|---|
| `status 401` o `403` **e** nessun token | `router.navigate(['/login'])` |
| `status 401` | `AuthService.removeToken()` + `router.navigate(['/login'])` (token verosimilmente scaduto/non valido) |
| altro | l'errore viene ri-lanciato (`throwError`) al chiamante |

## Test

`auth-interceptor.spec.ts` — scheletro generato da Angular CLI.

## Nota

La condizione sui `403` è parzialmente coperta: un `403` con token presente non
esegue né logout né redirect, l'errore torna al componente.
