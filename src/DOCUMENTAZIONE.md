# `frontend/src`

Codice sorgente dell'applicazione Angular. Contiene il punto di bootstrap, la pagina
host e gli stili globali; tutta la logica applicativa è in [`app/`](app/DOCUMENTAZIONE.md).

| File | Ruolo |
|---|---|
| `main.ts` | Entry point. Chiama `bootstrapApplication(App, appConfig)` per avviare l'app standalone (nessun `AppModule`). |
| `index.html` | Pagina HTML servita al browser. Contiene `<app-root></app-root>`, il `<base href="/">`, i font **Roboto** e **Material Icons** da Google Fonts. |
| `styles.css` | Stili globali: reset dei margini, `height: 100%`, font di default `Roboto`. |
| `custom-theme.scss` | Tema **Angular Material 3** generato con `mat.theme(...)`: palette primaria `azure`, terziaria `blue`, tipografia `Roboto`, `color-scheme: light`. Registrato in `angular.json` tra gli `styles`. |

## Come si incastrano

```
browser → index.html → <app-root>
                          │
                    main.ts  bootstrapApplication(App, appConfig)
                          │
                    app/app.config.ts  (router + HttpClient + interceptor)
                          │
                    app/app.ts  →  app/app.html  →  <router-outlet/>
```

## Sottocartella

| Cartella | Contenuto | Documentazione |
|---|---|---|
| `app/` | Componenti, servizi, guardie, interceptor, modelli, configurazione e rotte. | `app/DOCUMENTAZIONE.md` |

## Nota

`angular.json` definisce `browser: "src/main.ts"`, `assets` da `public/`, e gli stili
`custom-theme.scss` + `styles.css`. Il dev server usa la configurazione `development`
(no ottimizzazioni, source map attive).
