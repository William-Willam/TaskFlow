import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
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
import { BehaviorSubject, switchMap } from 'rxjs';
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
    AsyncPipe,
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
export class Projetos {

  private reloadProjetos$ = new BehaviorSubject<void>(undefined);
  private reloadTarefas$ = new BehaviorSubject<number | null>(null);

  projetos$ = this.reloadProjetos$.pipe(
    switchMap(() => this.projetoService.listar())
  );

  tarefas$ = this.reloadTarefas$.pipe(
    switchMap(projetoId =>
      projetoId
        ? this.tarefaService.listarPorProjeto(projetoId)
        : []
    )
  );

  projetoSelecionado: Projeto | null = null;
  editandoProjeto: Projeto | null = null;
  mostrarFormProjeto = false;
  mostrarFormTarefa = false;

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
      nome:      ['', [Validators.required, Validators.minLength(2)]],
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

  reloadProjetos(): void {
    this.reloadProjetos$.next();
  }

  reloadTarefas(): void {
    this.reloadTarefas$.next(this.projetoSelecionado?.id ?? null);
  }

  selecionarProjeto(projeto: Projeto): void {
    this.projetoSelecionado = projeto;
    this.reloadTarefas$.next(projeto.id);
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
          this.reloadProjetos();
        }
      });
    } else {
      this.projetoService.criar(request).subscribe({
        next: () => {
          this.snackBar.open('Projeto criado!', 'OK', { duration: 3000 });
          this.fecharFormProjeto();
          this.reloadProjetos();
        }
      });
    }
  }

  deletarProjeto(id: number): void {
    this.projetoService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Projeto excluído!', 'OK', { duration: 3000 });
        if (this.projetoSelecionado?.id === id) {
          this.projetoSelecionado = null;
          this.reloadTarefas$.next(null);
        }
        this.reloadProjetos();
      }
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
        this.reloadTarefas();
      }
    });
  }

  deletarTarefa(id: number): void {
    this.tarefaService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Tarefa excluída!', 'OK', { duration: 3000 });
        this.reloadTarefas();
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