import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WorkExperience} from "../../interfaces/users";

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.css']
})
export class WorkExperienceComponent implements OnInit{
  experienciasLaborales: WorkExperience[] = [];
  experienciaForm: FormGroup; // Formulario para agregar/editar experiencias
  isEditing = false; // Bandera para controlar si estamos editando
  experienciaSeleccionada: WorkExperience | null = null;
  userData: any;
  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder) {
    this.experienciaForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''] // La fechaFin no es requerida
    });
  }

  ngOnInit(): void {
    this.firebaseService.getUserData().subscribe(data => {
      this.userData = data;
      if (this.userData) {
        this.obtenerExperienciasUsuarioActual();
      }
    });
  }

  obtenerExperienciasUsuarioActual() {
    if (this.firebaseService.userData) { // Añade esta comprobación
      const uid = this.userData.uid;
      this.firebaseService.obtenerExperienciasLaborales(uid).subscribe(experiencias => {
        this.experienciasLaborales = experiencias;
      });
    }
  }

  agregarExperiencia() {
    if (this.experienciaForm.invalid) {
      return;
    }

    const nuevaExperiencia: WorkExperience = {
      nombre: this.experienciaForm.value.nombre,
      fechaInicio: this.experienciaForm.value.fechaInicio,
      fechaFin: this.experienciaForm.value.fechaFin
    };

    const uid = this.userData.uid;
    this.firebaseService.agregarExperienciaLaboral(uid, nuevaExperiencia).then(() => {
      this.experienciaForm.reset();
      this.obtenerExperienciasUsuarioActual();
    });
  }

  editarExperiencia(experiencia: WorkExperience) {
    this.isEditing = true;
    this.experienciaSeleccionada = experiencia; // Guarda la experiencia seleccionada
    this.experienciaForm.setValue({
      nombre: experiencia.nombre,
      fechaInicio: experiencia.fechaInicio,
      fechaFin: experiencia.fechaFin
    });
  }

  actualizarExperiencia() {
    if (this.experienciaForm.invalid || !this.experienciaSeleccionada) {
      return;
    }

    console.log("EXPERIENCIA ACTUALIZADA")

    const experienciaAnterior = this.experienciaSeleccionada; // Utiliza la experiencia seleccionada
    const experienciaActualizada: WorkExperience = {
      nombre: this.experienciaForm.value.nombre,
      fechaInicio: this.experienciaForm.value.fechaInicio,
      fechaFin: this.experienciaForm.value.fechaFin
    };


    const uid = this.userData.uid;
    this.firebaseService.actualizarExperienciaLaboral(uid, experienciaAnterior, experienciaActualizada).then(() => {
      this.experienciaForm.reset();
      this.isEditing = false;
      this.obtenerExperienciasUsuarioActual();
    });

  }
  // actualizarExperiencia() {
  //   if (this.experienciaForm.invalid) {
  //     return;
  //   }
  //   console.log("EXPERIENCIA ACTUALIZADA")
  //
  //   const experienciaActualizada: WorkExperience = {
  //     nombre: this.experienciaForm.value.nombre,
  //     fechaInicio: this.experienciaForm.value.fechaInicio,
  //     fechaFin: this.experienciaForm.value.fechaFin
  //   };
  //
  //   const uid = this.firebaseService.userData.uid;
  //   this.firebaseService.actualizarExperienciaLaboral(uid, experienciaActualizada).then(() => {
  //     this.experienciaForm.reset();
  //     this.isEditing = false;
  //     this.obtenerExperienciasUsuarioActual();
  //   });
  // }

  eliminarExperiencia(experiencia: WorkExperience) {
    const uid = this.userData.uid;
    this.firebaseService.eliminarExperienciaLaboral(uid, experiencia).then(() => {
      this.obtenerExperienciasUsuarioActual();
    });
  }
}
