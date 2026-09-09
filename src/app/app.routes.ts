import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ListaLibri } from './components/lista-libri/lista-libri';
import { authGuard } from './guards/auth-guard';


//inserisco le rotte

export const routes: Routes = [
  { path: 'login', component: Login }, //quando l'URL è /login, mostra il componente Login
  { path: 'libri', component: ListaLibri, canActivate: [authGuard] }, // mostra ListaLibri prima di mostrare questa rotta, esegui authGuard — se ritorna true, procedi; se false, blocca"
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //quando l'utente apre l'app senza specificare nulla (localhost:4200 da solo), viene reindirizzato automaticamente a /login
];