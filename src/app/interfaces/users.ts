export default interface User {
  uid: string;
  Descripcion?:string;
  dni?:number;
  name?: string;
  Direccion?: string;
  Celular?: number;
  email?: string;
  // ----------
  Fecha_Ingreso?:Date;
  semester?: string;
  Fecha_Egreso?:Date;
  Titulo?:string;
  Especialidad_Docente?:string;
  college?: string;//univercidad 
  career?: string;
  Departamento?:string;
  Maestria?:string;
  Doctorado?:string;
  Experiencia_laboral?:string;
  role?: string;
  emailVerified: boolean;
}
