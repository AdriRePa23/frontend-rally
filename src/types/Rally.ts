export interface Rally {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    categorias: string;
    estado: string;
    creador_id: number;
    cantidad_fotos_max: number;
    created_at: string;
    updated_at: string;
    imagen?: string; // Propiedad opcional
}

