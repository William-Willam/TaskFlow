package taskflow_api.dto.response;

import java.time.LocalDateTime;

import taskflow_api.model.Projeto;

public record ProjetoResponse(
	    Long id,
	    String nome,
	    String descricao,
	    LocalDateTime dataCriacao,
	    Long usuarioId
	) {
	    public static ProjetoResponse fromEntity(Projeto projeto) {
	        return new ProjetoResponse(
	            projeto.getId(),
	            projeto.getNome(),
	            projeto.getDescricao(),
	            projeto.getDataCriacao(),
	            projeto.getUsuario().getId()
	        );
	    }
	}