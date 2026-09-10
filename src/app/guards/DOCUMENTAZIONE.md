# `src/app/guards`

Guardie di rotta: funzioni che il Router esegue **prima** di attivare una rotta per
decidere se consentirne l'accesso.

## `auth-guard.ts` — `authGuard`

`CanActivateFn` funzionale. Usa `inject()` per ottenere `AuthService` e `Router`.

```
authGuard:
  se AuthService.isAuthenticated()  → return true   (accesso consentito)
  altrimenti                        → router.navigate(['/login']); return false
```

- Registrata in `app.routes.ts` sulla rotta `libri`:
  `{ path: 'libri', component: ListaLibri, canActivate: [authGuard] }`.
- "Autenticato" qui significa semplicemente **token presente in `localStorage`**
  (non verifica scadenza o validità della firma: quella la controlla il backend).

## Test

`auth-guard.spec.ts` — scheletro generato da Angular CLI.
