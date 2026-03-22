import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TarefaService } from '../../core/services/tarefa.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { AuthService } from '../../core/services/auth.service';
import { Tarefa, StatusTarefa } from '../../core/models/tarefa.model';
import { Projeto } from '../../core/models/projeto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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
export class Dashboard implements OnInit {

  tarefas: Tarefa[] = [];
  projetos: Projeto[] = [];
  projetoFiltro: number | null = null;
  loading = true;

  constructor(
    private tarefaService: TarefaService,
    private projetoService: ProjetoService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.projetoService.listar().subscribe({
      next: (projetos) => {
        this.projetos = projetos;
        this.carregarTarefas();
      }
    });
  }

  carregarTarefas(): void {
    this.tarefaService.listarTodas().subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas;
        this.loading = false;
      }
    });
  }

  get tarefasFiltradas(): Tarefa[] {
    if (!this.projetoFiltro) return this.tarefas;
    return this.tarefas.filter(t => t.projetoId === this.projetoFiltro);
  }

  tarefasPorStatus(status: StatusTarefa): Tarefa[] {
    return this.tarefasFiltradas.filter(t => t.status === status);
  }

  alterarStatus(tarefa: Tarefa, novoStatus: StatusTarefa): void {
    const request = {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      prazo: tarefa.prazo,
      status: novoStatus,
      projetoId: tarefa.projetoId
    };
    this.tarefaService.atualizar(tarefa.id, request).subscribe({
      next: () => this.carregarTarefas()
    });
  }

  deletarTarefa(id: number): void {
    this.tarefaService.deletar(id).subscribe({
      next: () => this.carregarTarefas()
    });
  }

  logout(): void {
    this.authService.logout();
  }
}