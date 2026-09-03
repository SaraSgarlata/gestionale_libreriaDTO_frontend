import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaLibri } from "./components/lista-libri/lista-libri";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListaLibri],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestionale_libreriaDTO_frontend');
}
