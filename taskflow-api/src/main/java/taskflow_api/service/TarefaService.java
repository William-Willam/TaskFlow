package taskflow_api.service;

import taskflow_api.dto.request.TarefaRequest;
import taskflow_api.dto.response.TarefaResponse;
import taskflow_api.model.Projeto;
import taskflow_api.model.Tarefa;
import taskflow_api.repository.ProjetoRepository;
import taskflow_api.repository.TarefaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final ProjetoRepository projetoRepository;

    public List<TarefaResponse> listarPorProjeto(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado");
        }

        return tarefaRepository.findByProjetoId(projetoId)
                .stream()
                .map(TarefaResponse::fromEntity)
                .toList();
    }

    public List<TarefaResponse> listarTodasDoUsuario(Long usuarioId) {
        return tarefaRepository.findByProjetoUsuarioId(usuarioId)
                .stream()
                .map(TarefaResponse::fromEntity)
                .toList();
    }

    public TarefaResponse criar(TarefaRequest request, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(request.projetoId())
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado");
        }

        Tarefa tarefa = Tarefa.builder()
                .titulo(request.titulo())
                .descricao(request.descricao())
                .prazo(request.prazo())
                .status(request.status())
                .projeto(projeto)
                .build();

        return TarefaResponse.fromEntity(tarefaRepository.save(tarefa));
    }

    public TarefaResponse atualizar(Long id, TarefaRequest request, Long usuarioId) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!tarefa.getProjeto().getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado");
        }

        Projeto projeto = projetoRepository.findById(request.projetoId())
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setPrazo(request.prazo());
        tarefa.setStatus(request.status());
        tarefa.setProjeto(projeto);

        return TarefaResponse.fromEntity(tarefaRepository.save(tarefa));
    }

    public void deletar(Long id, Long usuarioId) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!tarefa.getProjeto().getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado");
        }

        tarefaRepository.delete(tarefa);
    }
}