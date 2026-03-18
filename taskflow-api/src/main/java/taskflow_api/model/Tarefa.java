package taskflow_api.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
import taskflow_api.enums.StatusTarefa;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tarefas")
public class Tarefa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String titulo;

	private String descricao;

	@Column(name = "data_criacao")
	private LocalDateTime dataCriacao;

	private LocalDate prazo;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private StatusTarefa status;

	@ManyToOne
	@JoinColumn(name = "projeto_id", nullable = false)
	private Projeto projeto;

	@PrePersist
	public void prePersist() {
		this.dataCriacao = LocalDateTime.now();
		if (this.status == null) {
			this.status = StatusTarefa.PENDENTE;
		}
	}

}
