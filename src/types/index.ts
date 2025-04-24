export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol_id: number;
}

export interface Rally {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    categorias: string;
    cantidad_fotos_max: number;
    creador_id: number;
}

export interface LoginResponse {
    token: string;
}