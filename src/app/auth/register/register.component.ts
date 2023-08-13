import { Component } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(public authService: FirebaseService,private router:Router) {}

  ngOnInit() {}
  goToSignIn() {
    this.router.navigate(['/login']);
  }
}
