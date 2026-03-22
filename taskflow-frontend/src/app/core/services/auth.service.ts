import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthRequest, AuthResponse, RegisterRequest } from "../models/usuario.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

// define o serviço como singleton global
@Injectable({
    providedIn: "root"
})

export class AuthService{
    // Constantes 
    private readonly API = "http://localhost:8080/auth";
    private readonly TOKEN_KEY = "taskflow_token";
    private readonly USER_KEY = "taskflow_user";

    // estado reativo do usuario(emite o ultimo valor)
    private usuarioLogado = new BehaviorSubject<AuthResponse | null>(
        this.getUsuarioStorage()
    );
    
    // estado reativo do usuario
    usuario$ = this.usuarioLogado.asObservable();

    //Dependencias = faz as requisições
    constructor(private http:HttpClient, private router: Router) {}

    // Envia o post e recebe Authreponse
    register(request: RegisterRequest) : Observable <AuthResponse>{
        return this.http.post<AuthResponse>(`${this.API}/register`, request).pipe(
            tap(response => this.salvarSessao(response))
        );
    }

    //Login = autentica no backend
    login(request: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API}/login`, request).pipe(
        tap(response => this.salvarSessao(response))
        );
    }
        
    // Logout = remove dados do navegador
    logout(): void{
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.usuarioLogado.next(null);
        this.router.navigate(["/login"]);
    }

    // métdos utilitários

    // token 
    getToken(): string | null{
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // usuario = acesso sincrono
    getUsuario(): AuthResponse | null {
        return this.usuarioLogado.value;
    }

    //verificar o login
    isLogado(): boolean{
        return !! this.getToken();
    }

    // persistencia de dados = salva token, usuario e atualiza estado global
    private salvarSessao(response: AuthResponse): void{
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response));
        this.usuarioLogado.next(response);
    }

    // recuperar sessao
    private getUsuarioStorage(): AuthResponse | null {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }
}