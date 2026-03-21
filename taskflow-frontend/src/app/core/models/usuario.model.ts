export interface Usuario{
    id: number;
    nome: string;
    email: string;
}

export interface AuthRequest{
    email: string;
    senha: string;
}

export interface RegisterRequest{
    nome: string;
    email: string;
    senha: string;
}

export interface AuthResponse{
    token: string;
    nome: string;
    email: string;
    id: number;
}