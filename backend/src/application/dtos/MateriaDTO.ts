export interface CreateMateriaDTO {
  nombreMateria: string;
  descripcion: string;
  precio: number;
  foto: string;
  tutor: string;
  categoria?: string;
  modalidad?: string;
}

export interface UpdateMateriaDTO {
  nombreMateria?: string;
  descripcion?: string;
  precio?: number;
  foto?: string;
  tutor?: string;
  categoria?: string;
  modalidad?: string;
}
