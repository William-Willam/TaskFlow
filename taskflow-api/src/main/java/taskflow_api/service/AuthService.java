package taskflow_api.service;

import taskflow_api.dto.request.LoginRequest;
import taskflow_api.dto.request.UsuarioRequest;
import taskflow_api.dto.response.AuthResponse;
import taskflow_api.model.Usuario;
import taskflow_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse registrar(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .build();

        usuarioRepository.save(usuario);
        String token = jwtService.gerarToken(usuario);

        return new AuthResponse(token, usuario.getNome(), usuario.getEmail(), usuario.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String token = jwtService.gerarToken(usuario);

        return new AuthResponse(token, usuario.getNome(), usuario.getEmail(), usuario.getId());
    }
}