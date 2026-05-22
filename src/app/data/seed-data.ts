import { Animal } from '../models/animal.model';
import { Resena } from '../models/resena.model';

export const SEED_ANIMALS: Animal[] = [
  {
    id: 'animal_id_1',
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Mestiza',
    sexo: 'Hembra',
    edad: 2,
    peso: 14,
    descripcion:
      'Luna es activa, carinosa y muy sociable. Disfruta los paseos largos y convive bien con otros perros.',
    fotos: [
      'assets/img/animal_id_1/Foto1.png',
      'assets/img/animal_id_1/Foto2.png',
      'assets/img/animal_id_1/Foto3.png',
      'assets/img/animal_id_1/Foto4.png',
    ],
    estado: 'disponible',
    tasaAdopcion: 65,
  },
  {
    id: 'animal_id_2',
    nombre: 'Milo',
    especie: 'Gato',
    raza: 'Europeo comun',
    sexo: 'Macho',
    edad: 1,
    peso: 4,
    descripcion:
      'Milo es curioso, tranquilo y perfecto para un hogar que quiera un companero independiente pero cercano.',
    fotos: [
      'assets/img/animal_id_2/Foto1.png',
      'assets/img/animal_id_2/Foto2.png',
      'assets/img/animal_id_2/Foto3.png',
      'assets/img/animal_id_2/Foto4.png',
    ],
    estado: 'disponible',
    tasaAdopcion: 45,
  },
  {
    id: 'animal_id_3',
    nombre: 'Nala',
    especie: 'Perro',
    raza: 'Podenco',
    sexo: 'Hembra',
    edad: 5,
    peso: 12,
    descripcion:
      'Nala es dulce y algo timida al principio. Necesita una familia paciente que le de seguridad.',
    fotos: [
      'assets/img/animal_id_3/Foto1.png',
      'assets/img/animal_id_3/Foto2.png',
      'assets/img/animal_id_3/Foto3.png',
      'assets/img/animal_id_3/Foto4.png',
    ],
    estado: 'disponible',
    tasaAdopcion: 55,
  },
  {
    id: 'animal_id_4',
    nombre: 'Simba',
    especie: 'Gato',
    raza: 'Naranja',
    sexo: 'Macho',
    edad: 3,
    peso: 5,
    descripcion:
      'Simba es jugueton y muy expresivo. Le encantan los rascadores, las ventanas soleadas y las rutinas.',
    fotos: [
      'assets/img/animal_id_4/Foto1.png',
      'assets/img/animal_id_4/Foto2.png',
      'assets/img/animal_id_4/Foto3.png',
      'assets/img/animal_id_4/Foto4.png',
    ],
    estado: 'disponible',
    tasaAdopcion: 50,
  },
  {
    id: 'animal_id_5',
    nombre: 'Kira',
    especie: 'Perro',
    raza: 'Pastor aleman',
    sexo: 'Hembra',
    edad: 7,
    peso: 28,
    descripcion:
      'Kira es obediente, noble y protectora. Busca una familia con experiencia y espacio para pasear.',
    fotos: [
      'assets/img/animal_id_5/Foto1.png',
      'assets/img/animal_id_5/Foto2.png',
      'assets/img/animal_id_5/Foto3.png',
      'assets/img/animal_id_5/Foto4.png',
    ],
    estado: 'adoptado',
    tasaAdopcion: 80,
  },
  {
    id: 'animal_id_6',
    nombre: 'Coco',
    especie: 'Conejo',
    raza: 'Belier',
    sexo: 'Macho',
    edad: 1,
    peso: 2,
    descripcion:
      'Coco es sociable, limpio y se adapta bien a interiores. Necesita enriquecimiento y compania diaria.',
    fotos: [
      'assets/img/animal_id_6/Foto1.png',
      'assets/img/animal_id_6/Foto2.png',
      'assets/img/animal_id_6/Foto3.png',
      'assets/img/animal_id_6/Foto4.png',
    ],
    estado: 'disponible',
    tasaAdopcion: 35,
  },
  {
    id: 'animal_id_7',
    nombre: 'Toby',
    especie: 'Perro',
    raza: 'Labrador',
    sexo: 'Macho',
    edad: 4,
    peso: 26,
    descripcion:
      'Toby es equilibrado, alegre y muy bueno con ninos. Disfruta del agua y de aprender ordenes nuevas.',
    fotos: [
      'assets/img/animal_id_7/Foto1.png',
      'assets/img/animal_id_7/Foto2.png',
      'assets/img/animal_id_7/Foto3.png',
      'assets/img/animal_id_7/Foto4.png',
    ],
    estado: 'disponible',
    tasaAdopcion: 70,
  },
];

export const SEED_REVIEWS: Resena[] = [
  {
    id: 'resena_1',
    usuario: 'Laura Medina',
    comentario: 'El equipo nos acompano durante todo el proceso y resolvio cada duda con muchisima claridad.',
    valoracion: 5,
    fecha: '2026-04-10',
  },
  {
    id: 'resena_2',
    usuario: 'Adrian Perez',
    comentario: 'La ficha de los animales era muy completa y la entrevista previa fue cercana y responsable.',
    valoracion: 4,
    fecha: '2026-04-22',
  },
  {
    id: 'resena_3',
    usuario: 'Marta Santana',
    comentario: 'Adoptamos a Nala y la adaptacion fue preciosa. Se nota el cuidado del refugio.',
    valoracion: 5,
    fecha: '2026-05-02',
  },
];
