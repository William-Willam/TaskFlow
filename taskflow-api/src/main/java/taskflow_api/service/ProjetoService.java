package taskflow_api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import taskflow_api.dto.request.ProjetoRequest;
import taskflow_api.dto.response.ProjetoResponse;
import taskflow_api.model.Projeto;
import taskflow_api.model.Usuario;
import taskflow_api.repository.ProjetoRepository;
import taskflow_api.repository.UsuarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<ProjetoResponse> listarPorUsuario (Long usuarioId){
        return projetoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(ProjetoResponse::fromEntity)
                .toList();
    }

    public ProjetoResponse criar (ProjetoRequest request, Long usuarioId){
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Projeto projeto = Projeto.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .usuario(usuario)
                .build();

        return ProjetoResponse.fromEntity(projetoRepository.save(projeto));
    }

    public ProjetoResponse atualizar(Long id, ProjetoRequest request, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado");
        }

        projeto.setNome(request.nome());
        projeto.setDescricao(request.descricao());

        return ProjetoResponse.fromEntity(projetoRepository.save(projeto));
    }

    public void deletar(Long id, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (!projeto.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Acesso negado");
        }

        projetoRepository.delete(projeto);
    }

}
