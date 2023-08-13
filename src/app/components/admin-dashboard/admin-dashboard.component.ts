import {Component} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {WorkExperience} from "../../interfaces/users";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  users: any[] = [];
  isDataLoaded = false; // Band
  itemsPerPage: number = 5;
  currentPage: number = 1;
  allExperienciasLaborales: any[] = [];
  constructor(public authService: FirebaseService) {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users;
      this.isDataLoaded = true; // Marcar los datos como cargados una vez que se obtienen
      // this.allExperienciasLaborales = users.reduce((experiencias, user) => {
      //   return experiencias.concat(user.Experiencia_laboral || []);
      // }, []);
    });
  }
  // Calcula la cantidad total de páginas
  getPagesArray(): number[] {
    const pageCount = Math.ceil(this.users.length / this.itemsPerPage);
    return new Array(pageCount).fill(0).map((_, index) => index + 1);
  }

  // Devuelve la lista de usuarios para la página actual
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }
  ngOnInit(): void {
  }

  updateUserRole(user: any) {
    this.authService.updateUserRole(user.uid, user.role)
      .then(() => {
          // alert('Rol de usuario actualizado correctamente');
          console.log('Rol de usuario actualizado correctamente');
        })
      .catch((error) => {
          // alert('Error al actualizar el rol de usuario');
          console.log('Error al actualizar el rol de usuario')
        })
  }

}
