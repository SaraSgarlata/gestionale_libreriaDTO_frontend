import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaLibri } from "./components/lista-libri/lista-libri";
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestionale_libreriaDTO_frontend');
}
