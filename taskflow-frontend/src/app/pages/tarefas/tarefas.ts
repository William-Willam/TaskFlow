import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { TarefaService } from '../../core/services/tarefa.service';
import { ProjetoService } from '../../core/services/projeto.service';
import { AuthService } from '../../core/services/auth.service';
import { Tarefa, TarefaRequest, StatusTarefa } from '../../core/models/tarefa.model';
import { Projeto } from '../../core/models/projeto.model';

@Component({
  selector: 'app-tarefas',
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
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css'
})
export class Tarefas {

  private reload$ = new BehaviorSubject<void>(undefined);

  tarefas$!: Observable<Tarefa[]>;
  projetos$!: Observable<Projeto[]>;

  mostrarForm = false;
  editando: Tarefa | null = null;

  form: FormGroup;

  statusOpcoes: { valor: StatusTarefa; label: string }[] = [
    { valor: 'PENDENTE',     label: 'Pendente'     },
    { valor: 'EM_ANDAMENTO', label: 'Em andamento' },
    { valor: 'CONCLUIDO',    label: 'Concluído'    }
  ];

  constructor(
    private tarefaService: TarefaService,
    private projetoService: ProjetoService,
    public authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.tarefas$ = this.reload$.pipe(
      switchMap(() => this.tarefaService.listarTodas())
    );

    this.projetos$ = this.projetoService.listar();

    this.form = this.fb.group({
      titulo:    ['', [Validators.required, Validators.minLength(2)]],
      descricao: [''],
      prazo:     [''],
      status:    ['PENDENTE', Validators.required],
      projetoId: [null, Validators.required]
    });
  }

  reload(): void {
    this.reload$.next();
  }

  abrirForm(tarefa?: Tarefa): void {
    this.editando = tarefa || null;
    this.mostrarForm = true;
    if (tarefa) {
      this.form.patchValue({
        titulo:    tarefa.titulo,
        descricao: tarefa.descricao,
        prazo:     tarefa.prazo,
        status:    tarefa.status,
        projetoId: tarefa.projetoId
      });
    } else {
      this.form.reset({ status: 'PENDENTE' });
    }
  }

  fecharForm(): void {
    this.mostrarForm = false;
    this.editando = null;
    this.form.reset({ status: 'PENDENTE' });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const request: TarefaRequest = this.form.value;

    if (this.editando) {
      this.tarefaService.atualizar(this.editando.id, request).subscribe({
        next: () => {
          this.snackBar.open('Tarefa atualizada!', 'OK', { duration: 3000 });
          this.fecharForm();
          this.reload();
        }
      });
    } else {
      this.tarefaService.criar(request).subscribe({
        next: () => {
          this.snackBar.open('Tarefa criada!', 'OK', { duration: 3000 });
          this.fecharForm();
          this.reload();
        }
      });
    }
  }

  deletar(id: number): void {
    this.tarefaService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Tarefa excluída!', 'OK', { duration: 3000 });
        this.reload();
      }
    });
  }

  getStatusLabel(status: string): string {
    const map: any = {
      'PENDENTE':     'Pendente',
      'EM_ANDAMENTO': 'Em andamento',
      'CONCLUIDO':    'Concluído'
    };
    return map[status] || status;
  }

  logout(): void {
    this.authService.logout();
  }
}