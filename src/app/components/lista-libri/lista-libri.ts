import { Component, OnInit, ViewChild } from '@angular/core';
import { LibroService } from '../../services/libroService';
import { Libro } from '../../models/libro';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormInserimentoLibro } from '../form-inserimento-libro/form-inserimento-libro';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lista-libri',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, FormInserimentoLibro, MatDialogModule, MatButtonModule],
  templateUrl: './lista-libri.html',
  styleUrl: './lista-libri.css',
})
export class ListaLibri implements OnInit {

  constructor(private libroService: LibroService, private dialog: MatDialog) {}

  arrayLibri: Libro[] = [];
  colonneVisualizzate: string[] = ['titolo', 'annoPubblicazione', 'nomiAutori'];

  //MatTableDataSource, @ViewChild per catturare il riferimento al paginatore,
  arrayLibriPaginati: MatTableDataSource<Libro> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Recupera il riferimento a MatSort dall'HTML
  @ViewChild(MatSort) sort!: MatSort;

   caricaLibri(): void {
    //parte una richiesta HTTP verso il backend  
    //subscribe(dati =>{ }"callback": è una funzione che Angular esegue automaticamente più tardi, nel momento esatto in cui la risposta arriva dal server
    //prendi dati (l'array di libri appena arrivato) e lo metti dentro arrayLibriPaginati.data — che è la proprietà che la tabella HTML sta osservando per sapere cosa disegnare.
      this.libroService.getListaLibri().subscribe(dati =>{ 
      this.arrayLibriPaginati.data = dati; 
      this.arrayLibriPaginati.paginator = this.paginator;
      this.arrayLibriPaginati.sort = this.sort;
    })
  }

  ngOnInit(): void {
  this.caricaLibri();
  }

  
  apriFormInserimento(): void {
  const dialogRef = this.dialog.open(FormInserimentoLibro);
  
  dialogRef.afterClosed().subscribe(() => {
    this.caricaLibri();
  });
}
}
