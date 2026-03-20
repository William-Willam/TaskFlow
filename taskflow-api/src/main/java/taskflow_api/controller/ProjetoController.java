package taskflow_api.controller;

import taskflow_api.dto.request.ProjetoRequest;
import taskflow_api.dto.response.ProjetoResponse;
import taskflow_api.service.ProjetoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/projetos")
@RequiredArgsConstructor
public class ProjetoController {

    private final ProjetoService projetoService;

    @GetMapping
    public ResponseEntity<List<ProjetoResponse>> listar(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(projetoService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<ProjetoResponse> criar(
            @Valid @RequestBody ProjetoRequest request,
            @RequestParam Long usuarioId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projetoService.criar(request, usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProjetoRequest request,
            @RequestParam Long usuarioId) {
        return ResponseEntity.ok(projetoService.atualizar(id, request, usuarioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        projetoService.deletar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}