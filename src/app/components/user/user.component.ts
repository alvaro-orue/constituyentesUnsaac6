import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

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
    
    const dataToUpdate = {
      // generales
      name: this.userData.name,
      Celular:this.userData.Celular,
      Descripcion:this.userData.Descripcion,
      Direccion:this.userData.Direccion,
      //depende del rol
      career: this.userData.career,
      semester: this.userData.semester,
      college: this.userData.college,
      Fecha_Ingreso:this.userData.Fecha_Ingreso,
      Experiencia_laboral:this.userData.Experiencia_laboral
      
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
