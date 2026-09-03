

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

  getListaLibri() {
    return this.http.get<Libro[]>('http://localhost:8080/findalllibro');
  }

  salvaLibroConAutore(dati: any){
    return this.http.post<Libro>('http://localhost:8080/createnewlibroconautore', dati);
  }
  
}
