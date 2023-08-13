import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import Users, {WorkExperience} from "../interfaces/users";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {BehaviorSubject, catchError, filter, from, map, Observable, of, switchMap, take} from "rxjs";
import {Router} from "@angular/router";
import User from "../interfaces/users";
import firebase from "firebase/compat/app"; // Importa firebase/app
import "firebase/compat/firestore"; //

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserDataLogin(result.user);
        this.afs.collection<User>('users').doc(result.user?.uid).valueChanges().subscribe((userData) => {
          if (userData && userData?.role === 'admin') {
            // Usuario con rol de administrador, redirigir a adminDashboard
            this.router.navigate(['admin-dashboard']);
          } else {
            // Usuario no es administrador, redirigir a dashboard
            this.router.navigate(['dashboard']);
          }
        });
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string,role :string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user,role);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['dashboard']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Devuelve verdadero cuando el usuario inicia sesión y se verifica el correo electrónico
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  /** Configuración de datos de usuario al iniciar sesión con nombre de usuario/contraseña,
  regístrese con nombre de usuario/contraseña e inicie sesión con autenticación social
  proveedor en la base de datos de Firestore usando AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any,role:string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,

      role: role,

      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  SetUserDataLogin(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      // semester: user.semester,
      // career: user.career,
      // college: user.college,

      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  UpdateUser(data: any){
    // Obtener el ID del usuario actual
    const uid = this.userData.uid;
    console.log(uid)
    if (uid) {
      // Actualizar los datos del usuario en la colección "users"
      return this.afs.collection('users').doc(uid).update(data);
    } else {
      throw new Error('User not authenticated');
    }

  }

  getUserData(): Observable<any> {
    return from(this.afAuth.authState).pipe(
      filter((user) => user !== null),
      switchMap((user) => {
        const userId = user?.uid;
        const userRef = this.afs.collection('users').doc(userId);
        return userRef.valueChanges().pipe(
          catchError((error) => {
            console.error('Error al obtener los datos del usuario:', error);
            return of(null); // Puedes manejar el error aquí si es necesario
          })
        );
      })
    );
  }
  getAllUsers(): Observable<any[]> {
    const usersRef: AngularFirestoreCollection<any> = this.afs.collection('users');
    return usersRef.valueChanges();
  }

  updateUserRole(uid: string, role: string) {
    return this.afs.collection('users').doc(uid).update({ role });
  }

  obtenerExperienciasLaborales(uid: string): Observable<WorkExperience[]> {
    return this.getUserData().pipe(
      map(userData => userData.Experiencia_laboral || [])
    );
  }

  // Agregar una nueva experiencia laboral a un usuario
  agregarExperienciaLaboral(uid: string, experiencia: WorkExperience): Promise<void> {
    return this.afs.collection('users').doc(uid).update({
      Experiencia_laboral: firebase.firestore.FieldValue.arrayUnion(experiencia)
    });
  }

  // actualizarExperienciaLaboral(uid: string, experienciaAnterior: WorkExperience, experienciaActualizada: WorkExperience): Promise<void> {
  //   const experienciaRef = this.afs.collection('users').doc(uid);
  //
  //   // Primero, elimina la experiencia anterior si existe
  //   return experienciaRef.update({
  //     "Experiencia_laboral": firebase.firestore.FieldValue.arrayRemove(experienciaAnterior)
  //   }).then(() => {
  //     // Luego, agrega la experiencia actualizada
  //     return experienciaRef.update({
  //       "Experiencia_laboral": firebase.firestore.FieldValue.arrayUnion(experienciaActualizada)
  //     });
  //   });
  // }

  actualizarExperienciaLaboral(uid: string, experienciaAnterior: WorkExperience, experienciaActualizada: WorkExperience): Promise<void> {
    const experienciaRef = this.afs.collection('users').doc(uid);

    // Obtén los datos del usuario a través del Observable
    return this.getUserData().pipe(
      take(1), // Toma solo un valor y luego completa el Observable
      switchMap(userData => {
        // Primero, busca la experiencia anterior en la lista de experiencias laborales
        const experienciasLaborales: WorkExperience[] = userData?.Experiencia_laboral || [];
        const experienciaIndexs = experienciasLaborales.findIndex(exp => {
          // Utiliza algún identificador único para comparar experiencias, por ejemplo, el nombre
          return exp.nombre === experienciaAnterior.nombre;
        });

        if (experienciaIndexs !== -1) {
          // Actualiza la experiencia en la lista
          experienciasLaborales[experienciaIndexs] = experienciaActualizada;

          // Actualiza las experiencias laborales en el usuario
          return experienciaRef.update({
            Experiencia_laboral: experienciasLaborales
          });
        } else {
          // La experiencia anterior no fue encontrada, maneja el caso según tu necesidad
          console.log('Experiencia anterior no encontrada en la lista.');
          return Promise.reject('Experiencia anterior no encontrada en la lista.');
        }
      })
    ).toPromise(); // Convierte el Observable en una Promise
  }



  // Eliminar una experiencia laboral de un usuario
  eliminarExperienciaLaboral(uid: string, experiencia: WorkExperience): Promise<void> {
    return this.afs.collection('users').doc(uid).update({
      "Experiencia_laboral": firebase.firestore.FieldValue.arrayRemove(experiencia),
    });
  }


}

