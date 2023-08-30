import { Component } from '@angular/core';
import { ApiService } from '../apiService/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      re_password: ['', Validators.required]
    });
  }

  register() {
    const data = { email:this.registrationForm.get('email')?.value, username:this.registrationForm.get('username')?.value, 
    password:this.registrationForm.get('password')?.value,re_password:this.registrationForm.get('re_password')?.value };
    this.apiService.register(JSON.stringify(data))
      .subscribe(
        response => {
          this.router.navigate(['/login']);
        },
        error => {
        },
      );
  }
}
