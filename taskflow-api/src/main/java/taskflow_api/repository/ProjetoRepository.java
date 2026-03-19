package taskflow_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import taskflow_api.model.Projeto;

@Repository
public interface ProjetoRepository extends JpaRepository<Projeto, Long>  {
	
	List<Projeto> findByUsuarioId(Long usuarioId);
	boolean existsByIdAndUsuarioId(Long id, Long usuarioId);

}
