export interface Usuario {
  uid: string;
  nombre: string;
  apellidos: string;
  dni: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
