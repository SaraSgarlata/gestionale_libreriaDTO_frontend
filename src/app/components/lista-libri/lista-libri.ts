import { Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { LibroService } from '../../services/libroService';
import { Libro } from '../../models/libro';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormInserimentoLibro } from '../form-inserimento-libro/form-inserimento-libro';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-lista-libri',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, FormInserimentoLibro, MatDialogModule, MatButtonModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './lista-libri.html',
  styleUrl: './lista-libri.css',
})
export class ListaLibri implements OnInit {

  constructor(private libroService: LibroService,
              private dialog: MatDialog,
              private authService: AuthService,
              private router: Router,
              private destroyRef: DestroyRef
            ) {}

  arrayLibri: Libro[] = [];
  colonneVisualizzate: string[] = ['titolo', 'annoPubblicazione', 'nomiAutori'];

  //MatTableDataSource, @ViewChild per catturare il riferimento al paginatore,
  arrayLibriPaginati: MatTableDataSource<Libro> = new MatTableDataSource();

  // Testo di filtro attualmente applicato: lo teniamo per poter ricaricare
  // la lista (es. dopo un inserimento) mantenendo lo stesso filtro.
  filtroCorrente = '';

  // Ogni battitura nella casella di ricerca viene spinta qui.
  private filtroInput$ = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Recupera il riferimento a MatSort dall'HTML
  @ViewChild(MatSort) sort!: MatSort;

   caricaLibri(): void {
    // Il filtro viene passato al backend come query param: è il database a filtrare.
      this.libroService.getListaLibri(this.filtroCorrente || undefined).subscribe(dati =>{
      this.arrayLibriPaginati.data = dati;
      this.arrayLibriPaginati.paginator = this.paginator;
      this.arrayLibriPaginati.sort = this.sort;
    })
  }

    ngOnInit(): void {
    this.caricaLibri();

    // Debounce sulla digitazione: attende 300ms, salta i valori ripetuti,
    // annulla la richiesta precedente ancora in volo (switchMap) e chiede al backend
    // la lista già filtrata.
    this.filtroInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(filtro => {
          this.filtroCorrente = filtro;
          return this.libroService.getListaLibri(filtro || undefined);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(dati => {
        this.arrayLibriPaginati.data = dati;
        this.arrayLibriPaginati.paginator?.firstPage();
      });
    }

  applicaFiltro(event: Event): void {
    this.filtroInput$.next((event.target as HTMLInputElement).value.trim());
  }


    apriFormInserimento(): void {
    const dialogRef = this.dialog.open(FormInserimentoLibro);

    dialogRef.afterClosed().subscribe(() => {
      this.caricaLibri();
    });
  }

  logout(): void {
  this.authService.removeToken();
  this.router.navigate(['/login']);
  }

}
