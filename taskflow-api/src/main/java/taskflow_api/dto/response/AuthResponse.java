package taskflow_api.dto.response;

public record AuthResponse(
        String token,
        String nome,
        String email,
        Long id
) {}
