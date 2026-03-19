package taskflow_api.dto.response;
import taskflow_api.enums.StatusTarefa;
import taskflow_api.model.Tarefa;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TarefaResponse(
        Long id,
        String titulo,
        String descricao,
        LocalDateTime dataCriacao,
        LocalDate prazo,
        StatusTarefa status,
        Long projetoId,
        String projetoNome
) {
    public static TarefaResponse fromEntity(Tarefa tarefa) {
        return new TarefaResponse(
                tarefa.getId(),
                tarefa.getTitulo(),
                tarefa.getDescricao(),
                tarefa.getDataCriacao(),
                tarefa.getPrazo(),
                tarefa.getStatus(),
                tarefa.getProjeto().getId(),
                tarefa.getProjeto().getNome()
        );
    }
}