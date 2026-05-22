export type AnimalStatus = 'disponible' | 'adoptado';

export interface Animal {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: 'Macho' | 'Hembra';
  edad: number;
  peso: number;
  descripcion: string;
  fotos: string[];
  videos?: string[];
  estado: AnimalStatus;
  tasaAdopcion: number;
}

export interface AnimalFilters {
  search: string;
  especie: string;
  edad: string;
}
