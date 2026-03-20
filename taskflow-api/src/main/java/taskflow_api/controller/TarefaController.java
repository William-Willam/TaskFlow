package taskflow_api.controller;

import taskflow_api.dto.request.TarefaRequest;
import taskflow_api.dto.response.TarefaResponse;
import taskflow_api.service.TarefaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/tarefas")
@RequiredArgsConstructor
public class TarefaController {

    private final TarefaService tarefaService;

    @GetMapping
    public ResponseEntity<List<TarefaResponse>> listar(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(tarefaService.listarTodasDoUsuario(usuarioId));
    }

    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<TarefaResponse>> listarPorProjeto(
            @PathVariable Long projetoId,
            @RequestParam Long usuarioId) {
        return ResponseEntity.ok(tarefaService.listarPorProjeto(projetoId, usuarioId));
    }

    @PostMapping
    public ResponseEntity<TarefaResponse> criar(
            @Valid @RequestBody TarefaRequest request,
            @RequestParam Long usuarioId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tarefaService.criar(request, usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarefaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TarefaRequest request,
            @RequestParam Long usuarioId) {
        return ResponseEntity.ok(tarefaService.atualizar(id, request, usuarioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        tarefaService.deletar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}