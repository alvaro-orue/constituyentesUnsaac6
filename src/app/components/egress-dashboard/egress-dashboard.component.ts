import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-egress-dashboard',
  templateUrl: './egress-dashboard.component.html',
  styleUrls: ['./egress-dashboard.component.css']
})
export class EgressDashboardComponent implements OnInit {
  form:FormGroup;
  userData: any;
  isDataLoaded = false;
  constructor(public authService:FirebaseService,public router:Router) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })

  }

  ngOnInit() {
    this.authService.getUserData().subscribe((data) => {
      this.userData = data;
      this.isDataLoaded = true; // Marcar los datos como cargados una vez que se obtienen
    });
  }

  updateUserProfile() {
    //const userData = this.authService.userData; // Obtenemos los datos del usuario actualmente logueado
    const dataToUpdate = {
      // generales
      name: this.userData.name,
      Celular:this.userData.Celular,
      Descripcion:this.userData.Descripcion,
      Direccion:this.userData.Direccion,
      career: this.userData.career,
      college: this.userData.college,
      Experiencia_laboral:this.userData.Experiencia_laboral,
      //depende del rol
      Fecha_Egreso:this.userData.Fecha_Egreso,
      Titulo:this.userData.Titulo,
      Fecha_Ingreso:this.userData.Fecha_Ingreso,
      Maestria:this.userData.Maestria,
    };

    // Llamamos a la función UpdateUser del servicio para actualizar los datos del usuario
    this.authService.UpdateUser(dataToUpdate)
      .then((response) => {

        console.log('Perfil actualizado exitosamente');
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {

        console.error('Error al actualizar el perfil:', error);
      });
  }

  // async onSubmit() {
  //   const response = await this.userService.postUser(this.form.value);
  //   console.log(response);
  // }

}
