package taskflow_api.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import taskflow_api.enums.StatusTarefa;

public record TarefaRequest(

	    @NotBlank(message = "O título é obrigatório")
	    @Size(min = 2, max = 150, message = "O título deve ter entre 2 e 150 caracteres")
	    String titulo,

	    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
	    String descricao,

	    @Future(message = "O prazo deve ser uma data futura")
	    LocalDate prazo,

	    StatusTarefa status,

	    @NotNull(message = "O projeto é obrigatório")
	    Long projetoId
	) {}
