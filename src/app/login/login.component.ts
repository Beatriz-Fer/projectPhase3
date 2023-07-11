import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    name: '',
    email: '',
    password: '',
    bio: 'Hello, this is a sample bio',
    photo: '/assets/images/profile-image-2.png'
  };
  loginError = false;
  registrationSuccess = false;

  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['registered']) {
        this.registrationSuccess = true;
      }
    });
  }


  login() {
     // Retrieve the registered user details from local storage
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser') || '');

    
    // Check if the entered email and password match the registered user's credentials
    if (
      registeredUser &&
      this.user.email === registeredUser.email &&
      this.user.password === registeredUser.password
    ) {
       // Store the logged-in user's name in local storage
      localStorage.setItem('loggedInName', registeredUser.name);
      localStorage.setItem('loggedInEmail', registeredUser.email);
      localStorage.setItem('loggedInBio', registeredUser.bio);
      localStorage.setItem('loggedInPhoto', registeredUser.photo);

      // Login successful, redirect to the feed page
      console.log(registeredUser);
      this.router.navigate(['/feed']);
    } else {
      // Incorrect email or password
      console.log("no");
      this.loginError = true;
    }
  }

}