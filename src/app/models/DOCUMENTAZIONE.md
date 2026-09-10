# `src/app/models`

Interfacce TypeScript che descrivono la forma dei dati scambiati con il backend.
Servono solo a **tipizzare** richieste e risposte (nessuna logica). Corrispondono ai
`record`/classi lato Java.

| File | Interfaccia | Campi | Corrisponde a (backend) |
|---|---|---|---|
| `libro.ts` | `Libro` | `titolo: string`, `annoPubblicazione: number`, `nomiAutori: string[]` | `entityDTO/LibroDTO` |
| `auth-request.ts` | `AuthRequest` | `username: string`, `password: string` | `request/AuthRequest` |
| `auth-response.ts` | `AuthResponse` | `token: string` | `request/AuthResponse` |

## Dove sono usate

```
AuthService.login(credenziali: AuthRequest) : Observable<AuthResponse>
LibroService.getListaLibri() : Observable<Libro[]>
ListaLibri.arrayLibri / dataSource : Libro[]
Login.onSubmit() costruisce un AuthRequest
```

## Nota

Non esiste un'interfaccia per il payload di `salvaLibroConAutore` (inviato come
`any`): un `LibroRequestData` lato TS renderebbe il contratto esplicito.
