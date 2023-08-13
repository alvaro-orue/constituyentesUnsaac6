import {Component, OnInit,ViewChild} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import { MatSidenav } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider'; // Importa MatDividerModule
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav; // Agrega esta línea para declarar la propiedad
  userData: any;
  isDataLoaded = false; // Bandera para verifier si los datos del usuario están disponibles
  constructor(public authService: FirebaseService) {}
  ngOnInit() {
    // Llamamos a la función getUserData del servicio para obtener los datos del usuario actualmente logueado
    this.authService.getUserData().subscribe((data) => {
      this.userData = data;
      this.isDataLoaded = true; // Marcar los datos como cargados una vez que se obtienen
    });
  }
  updatedUser: any = {};
  

}
