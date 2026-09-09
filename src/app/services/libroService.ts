

//classe ponte  tra angular e springboot
//Componente Angular (UI) → chiama → LibroService → fa una richiesta HTTP → Spring Boot Controller → Service Java → Database

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro } from '../models/libro';

@Injectable({
  providedIn: 'root',
})
export class LibroService {

  constructor(private http: HttpClient) {}

  // filtro opzionale: viene passato al backend come query param ?filtro=...
  // ed è il backend a filtrare i libri direttamente nella query sul database.
  getListaLibri(filtro?: string) {
    const url = 'http://localhost:8080/findalllibro';
    const options = filtro ? { params: { filtro } } : {};
    return this.http.get<Libro[]>(url, options);
  }

  salvaLibroConAutore(dati: any){
    return this.http.post<Libro>('http://localhost:8080/createnewlibroconautore', dati);
  }
  
}
