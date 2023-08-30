import { Component } from '@angular/core';
import { ApiService } from '../apiService/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;  

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router:Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required],  
    });
   }

  ngOnInit() {
  
  }

  login() {
    const data = {password:this.loginForm.get('password')?.value, email:this.loginForm.get('email')?.value};
    this.apiService.login(this.loginForm.get('password')?.value, this.loginForm.get('email')?.value)
      .subscribe(
        (response:any) => {
          console.log(response)
          sessionStorage.setItem('access_token',response.access)
          this.router.navigate(['/home']);
        },
        error => {
        },
      );
  }
}
