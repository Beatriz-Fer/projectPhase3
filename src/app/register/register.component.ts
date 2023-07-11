import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    bio: 'Hello, this is a sample bio',
    photo: '/assets/images/profile-image-2.png'
  };
  emailError = false;
  passwordError = false;
  nameError = false;

  constructor(private router: Router) {}

  register() {
    // Validate name length // not more than 20 characters
    if (this.user.name.length > 20) {
      this.nameError = true;
      return;
    }

    // Perform email validation
    if (!this.validateEmail(this.user.email)) {
      this.emailError = true;
      return;
    }

   // Validate password length and complexity
   if (
    this.user.password.length < 8 ||
    this.user.password.length > 12 ||
    !this.validatePasswordComplexity(this.user.password)
    ) {
      this.passwordError = true;
      return;
    }

    localStorage.setItem('registeredUser', JSON.stringify(this.user));

    // Registration successful, redirect to login page
    console.log(this.user.name + this.user.email + this.user.password);
    this.router.navigate(['/login']);
  }

  private validateEmail(email: string): boolean {
    // Simple email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  private validatePasswordComplexity(password: string): boolean {
    // Password complexity regex: at least 1 special character, 1 letter, and 1 capital letter, 
    //cant have more than 12 or be less than 8 characters
    const passwordPattern = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;
    return passwordPattern.test(password);
  }
}