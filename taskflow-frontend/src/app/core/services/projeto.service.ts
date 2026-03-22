import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projeto, ProjetoRequest } from '../models/projeto.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  private readonly API = 'http://localhost:8080/projetos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get usuarioId(): number {
    return this.authService.getUsuario()!.id;
  }

  listar(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(
      `${this.API}?usuarioId=${this.usuarioId}`
    );
  }

  criar(request: ProjetoRequest): Observable<Projeto> {
    return this.http.post<Projeto>(
      `${this.API}?usuarioId=${this.usuarioId}`, request
    );
  }

  atualizar(id: number, request: ProjetoRequest): Observable<Projeto> {
    return this.http.put<Projeto>(
      `${this.API}/${id}?usuarioId=${this.usuarioId}`, request
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/${id}?usuarioId=${this.usuarioId}`
    );
  }
}