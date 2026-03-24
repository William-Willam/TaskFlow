import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, combineLatest, map, switchMap, startWith } from 'rxjs';
import { TarefaService } from '../../core/services/tarefa.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { AuthService } from '../../core/services/auth.service';
import { Tarefa, StatusTarefa, TarefaRequest } from '../../core/models/tarefa.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private filtro$ = new BehaviorSubject<number | null>(null);
  private reload$ = new BehaviorSubject<void>(undefined);

  projetos$ = this.projetoService.listar();

  tarefas$ = combineLatest([
    this.reload$.pipe(switchMap(() => this.tarefaService.listarTodas())),
    this.filtro$
  ]).pipe(
    map(([tarefas, filtro]) =>
      filtro ? tarefas.filter(t => t.projetoId === filtro) : tarefas
    )
  );

  get projetoFiltro() { return this.filtro$.value; }
  set projetoFiltro(val: number | null) { this.filtro$.next(val); }

  constructor(
    private tarefaService: TarefaService,
    private projetoService: ProjetoService,
    public authService: AuthService
  ) {}

  reload(): void {
    this.reload$.next();
  }

  tarefasPorStatus(tarefas: Tarefa[], status: StatusTarefa): Tarefa[] {
    return tarefas.filter(t => t.status === status);
  }

  alterarStatus(tarefa: Tarefa, novoStatus: StatusTarefa): void {
    const request: TarefaRequest = {
      titulo:    tarefa.titulo,
      descricao: tarefa.descricao,
      prazo:     tarefa.prazo,
      status:    novoStatus,
      projetoId: tarefa.projetoId
    };
    this.tarefaService.atualizar(tarefa.id, request).subscribe({
      next: () => this.reload()
    });
  }

  deletarTarefa(id: number): void {
    this.tarefaService.deletar(id).subscribe({
      next: () => this.reload()
    });
  }

  logout(): void {
    this.authService.logout();
  }
}