import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ProjetoService } from '../../core/services/projeto.service';
import { TarefaService } from '../../core/services/tarefa.service';
import { AuthService } from '../../core/services/auth.service';
import { Projeto } from '../../core/models/projeto.model';
import { Tarefa, TarefaRequest } from '../../core/models/tarefa.model';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css'
})
export class Projetos implements OnInit {

  projetos: Projeto[] = [];
  tarefas: Tarefa[] = [];
  loading = true;

  mostrarFormProjeto = false;
  mostrarFormTarefa = false;
  projetoSelecionado: Projeto | null = null;
  editandoProjeto: Projeto | null = null;

  formProjeto: FormGroup;
  formTarefa: FormGroup;

  constructor(
    private projetoService: ProjetoService,
    private tarefaService: TarefaService,
    public authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formProjeto = this.fb.group({
      nome:     ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['']
    });

    this.formTarefa = this.fb.group({
      titulo:    ['', [Validators.required]],
      descricao: [''],
      prazo:     [''],
      status:    ['PENDENTE'],
      projetoId: [null]
    });
  }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.loading = true;
    this.projetoService.listar().subscribe({
      next: (projetos) => {
        this.projetos = projetos;
        this.loading = false;
      }
    });
  }

  abrirFormProjeto(projeto?: Projeto): void {
    this.editandoProjeto = projeto || null;
    this.mostrarFormProjeto = true;
    if (projeto) {
      this.formProjeto.patchValue(projeto);
    } else {
      this.formProjeto.reset();
    }
  }

  fecharFormProjeto(): void {
    this.mostrarFormProjeto = false;
    this.editandoProjeto = null;
    this.formProjeto.reset();
  }

  salvarProjeto(): void {
    if (this.formProjeto.invalid) return;

    const request = this.formProjeto.value;

    if (this.editandoProjeto) {
      this.projetoService.atualizar(this.editandoProjeto.id, request).subscribe({
        next: () => {
          this.snackBar.open('Projeto atualizado!', 'OK', { duration: 3000 });
          this.fecharFormProjeto();
          this.carregarProjetos();
        }
      });
    } else {
      this.projetoService.criar(request).subscribe({
        next: () => {
          this.snackBar.open('Projeto criado!', 'OK', { duration: 3000 });
          this.fecharFormProjeto();
          this.carregarProjetos();
        }
      });
    }
  }

  deletarProjeto(id: number): void {
    this.projetoService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Projeto excluído!', 'OK', { duration: 3000 });
        this.carregarProjetos();
        if (this.projetoSelecionado?.id === id) {
          this.projetoSelecionado = null;
          this.tarefas = [];
        }
      }
    });
  }

  selecionarProjeto(projeto: Projeto): void {
    this.projetoSelecionado = projeto;
    this.carregarTarefas(projeto.id);
  }

  carregarTarefas(projetoId: number): void {
    this.tarefaService.listarPorProjeto(projetoId).subscribe({
      next: (tarefas) => this.tarefas = tarefas
    });
  }

  abrirFormTarefa(): void {
    this.mostrarFormTarefa = true;
    this.formTarefa.patchValue({ projetoId: this.projetoSelecionado?.id });
  }

  fecharFormTarefa(): void {
    this.mostrarFormTarefa = false;
    this.formTarefa.reset();
  }

  salvarTarefa(): void {
    if (this.formTarefa.invalid) return;

    const request: TarefaRequest = this.formTarefa.value;
    this.tarefaService.criar(request).subscribe({
      next: () => {
        this.snackBar.open('Tarefa criada!', 'OK', { duration: 3000 });
        this.fecharFormTarefa();
        this.carregarTarefas(this.projetoSelecionado!.id);
      }
    });
  }

  deletarTarefa(id: number): void {
    this.tarefaService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Tarefa excluída!', 'OK', { duration: 3000 });
        this.carregarTarefas(this.projetoSelecionado!.id);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getStatusLabel(status: string): string {
    const map: any = {
      'PENDENTE':     'Pendente',
      'EM_ANDAMENTO': 'Em andamento',
      'CONCLUIDO':    'Concluído'
    };
    return map[status] || status;
  }
}