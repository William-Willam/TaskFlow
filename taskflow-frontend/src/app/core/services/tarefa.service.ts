import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa, TarefaRequest } from '../models/tarefa.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private readonly API = 'http://localhost:8080/tarefas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get usuarioId(): number {
    return this.authService.getUsuario()!.id;
  }

  listarTodas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(
      `${this.API}?usuarioId=${this.usuarioId}`
    );
  }

  listarPorProjeto(projetoId: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(
      `${this.API}/projeto/${projetoId}?usuarioId=${this.usuarioId}`
    );
  }

  criar(request: TarefaRequest): Observable<Tarefa> {
    return this.http.post<Tarefa>(
      `${this.API}?usuarioId=${this.usuarioId}`, request
    );
  }

  atualizar(id: number, request: TarefaRequest): Observable<Tarefa> {
    return this.http.put<Tarefa>(
      `${this.API}/${id}?usuarioId=${this.usuarioId}`, request
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/${id}?usuarioId=${this.usuarioId}`
    );
  }
}