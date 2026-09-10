# `src/app/components`

Le schermate dell'applicazione. Ogni componente è **standalone**: dichiara da sé i
propri `imports` (moduli Angular Material, `ReactiveFormsModule`, ecc.) ed è composto
da tre file — `*.ts` (logica), `*.html` (template), `*.css` (stile). I `*.spec.ts`
sono gli scheletri di test.

```
components/
├── login/                    → schermata di accesso
├── lista-libri/              → schermata principale: elenco libri
└── form-inserimento-libro/   → dialog di inserimento nuovo libro
```

---

## `login/` — `Login`

| Aspetto | Dettaglio |
|---|---|
| Selector | `app-login` |
| Rotta | `/login` |
| Form | `FormGroup` reattivo: `username`, `password` (entrambi `Validators.required`) |
| Import | `ReactiveFormsModule`, `MatFormFieldModule`, `MatInputModule`, `MatButtonModule` |
| `onSubmit()` | Costruisce un `AuthRequest` e chiama `AuthService.login(...)`. Alla risposta: `AuthService.saveToken(token)` e `router.navigate(['/libri'])`. |
| Template | Card centrata con titolo "Gestionale Libreria", due `mat-form-field` e il bottone "Accedi". |

---

## `lista-libri/` — `ListaLibri` (`implements OnInit`)

| Aspetto | Dettaglio |
|---|---|
| Selector | `app-lista-libri` |
| Rotta | `/libri` (protetta da `authGuard`) |
| Import | `MatTableModule`, `MatPaginatorModule`, `MatSortModule`, `MatDialogModule`, `MatButtonModule`, `MatToolbarModule`, `MatIconModule`, `MatFormFieldModule`, `MatInputModule`, `FormInserimentoLibro` |
| Stato | `arrayLibriPaginati: MatTableDataSource<Libro>`; `filtroCorrente: string`; `filtroInput$: Subject<string>`; colonne `['titolo', 'annoPubblicazione', 'nomiAutori']`; `@ViewChild` su `MatPaginator` e `MatSort` |
| `ngOnInit()` | chiama `caricaLibri()` e imposta la pipeline RxJS del filtro: `debounceTime(300)` → `distinctUntilChanged()` → `switchMap` verso `LibroService.getListaLibri(filtro)` → aggiorna il `dataSource` e torna a pagina 1. `takeUntilDestroyed(destroyRef)` per la pulizia. |
| `caricaLibri()` | `LibroService.getListaLibri(filtroCorrente).subscribe(...)` → assegna i dati al `dataSource` e collega `paginator` e `sort`. **Ordinamento e paginazione in memoria; il filtro invece è lato server.** |
| `applicaFiltro(event)` | legge il testo digitato e lo spinge in `filtroInput$` (poi gestito dalla pipeline con debounce) |
| `apriFormInserimento()` | apre `FormInserimentoLibro` con `MatDialog`; su `afterClosed()` ricarica la lista (mantenendo il filtro corrente) |
| `logout()` | `AuthService.removeToken()` + `router.navigate(['/login'])` |
| Template | `mat-toolbar` (titolo + logout), bottone "Inserisci nuovo libro", **casella di ricerca `mat-form-field` con icona `search`**, `mat-table` con `matSort`, riga `*matNoDataRow` ("Nessun libro corrisponde a …") e `mat-paginator` (`pageSizeOptions [5,10,20]`) |

---

## `form-inserimento-libro/` — `FormInserimentoLibro`

| Aspetto | Dettaglio |
|---|---|
| Selector | `app-form-inserimento-libro` |
| Contesto | Contenuto di un `MatDialog` (aperto da `ListaLibri`) |
| Import | `ReactiveFormsModule`, `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`, `MatDialogModule` |
| Dipendenze iniettate | `LibroService`, `MatDialogRef`, `MatSnackBar` |
| Form | `titolo*`, `annoPubblic`, `edizione*`, `lingua*`, `casaEditrice`, `nome*`, `cognome*` (`*` = `Validators.required`) |
| `onSubmit()` | se il form è invalido esce; altrimenti costruisce `{ libroRequest: {...}, autoreRequest: { nome, cognome } }` e chiama `LibroService.salvaLibroConAutore(...)`. Poi apre una snackbar "Libro inserito con successo" e chiude il dialog (`dialogRef.close()`). |
| `onAnnulla()` | chiude il dialog senza salvare |
| Template | `mat-dialog-title` + form a griglia (2 colonne) con sezione "Autore" separata, azioni "Annulla" / "Salva" |

> Il payload inviato corrisponde a `LibroRequestData` del backend
> (`POST /createnewlibroconautore`).

---

## Flusso tra i componenti

```
Login  ──(token ok)──▶  Router  ──▶  ListaLibri
                                        │  click "Inserisci nuovo libro"
                                        ▼
                                 MatDialog(FormInserimentoLibro)
                                        │  salva → POST /createnewlibroconautore
                                        ▼
                                 afterClosed() → ListaLibri.caricaLibri()
```
