import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { LibroService } from '../../services/libroService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-form-inserimento-libro',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  templateUrl: './form-inserimento-libro.html',
  styleUrl: './form-inserimento-libro.css',
})
export class FormInserimentoLibro {

  constructor(private libroService: LibroService,
              private dialogRef: MatDialogRef<FormInserimentoLibro>,
              private snackBar: MatSnackBar){}

  libroForm = new FormGroup({
    titolo: new FormControl ('', Validators.required),
    annoPubblic: new FormControl (''),
    edizione: new FormControl ('', Validators.required),
    lingua: new FormControl ('', Validators.required),
    casaEditrice: new FormControl (''),
    nome: new FormControl ('', Validators.required),
    cognome:  new FormControl ('', Validators.required)
  })
  
  onSubmit(): void{
    
    if (this.libroForm.invalid) {
    console.log('Form non valido, inserisci i campi obbligatori');
    return;
    }

    const valori = this.libroForm.value;
    const datiDaInviare = {
      libroRequest: {
      titolo: valori.titolo,
      annoPubblic: valori.annoPubblic,
      edizione: valori.edizione,
      lingua: valori.lingua,
      casaEditrice: valori.casaEditrice
      },

      autoreRequest:{
        nome: valori.nome,
        cognome: valori.cognome
      }      
    };
    
    //comunicazione con back per salvataggio
    this.libroService.salvaLibroConAutore(datiDaInviare).subscribe(dati => {
      console.log ('Libro salvato con successo')
    });
    
    //snackbar per il salvataggio
    this.snackBar.open('Libro inserito con successo', 'Chiudi', {
    duration: 3000
    });
    //chiusura del popup inserimento libro
    this.dialogRef.close();

    
    
    
  }


  onAnnulla(): void {
  this.dialogRef.close();
}
}
