package taskflow_api.repository;

import taskflow_api.model.Tarefa;
import taskflow_api.enums.StatusTarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    List<Tarefa> findByProjetoId(Long projetoId);

    List<Tarefa> findByProjetoUsuarioId(Long usuarioId);

    List<Tarefa> findByProjetoIdAndStatus(Long projetoId, StatusTarefa status);
}
