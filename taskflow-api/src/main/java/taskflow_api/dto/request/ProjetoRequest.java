package taskflow_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjetoRequest(

		@NotBlank(message = "O nome do projeto é obrigatório") 
		@Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres") String nome,

		@Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres") String descricao

) {

}
