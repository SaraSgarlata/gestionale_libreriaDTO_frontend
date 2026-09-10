import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AuthRequest } from '../../models/auth-request';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) {}

  //chiama AuthService che parla con java
  onSubmit(): void {
  const credenziali: AuthRequest = {
    username: this.loginForm.value.username!, //punto esclamativo != questo valore non sarà mai null
    password: this.loginForm.value.password!
  };
  
  this.authService.login(credenziali).subscribe(risposta => {
    this.authService.saveToken(risposta.token);
    this.router.navigate(['/libri']);
  });
  }
}