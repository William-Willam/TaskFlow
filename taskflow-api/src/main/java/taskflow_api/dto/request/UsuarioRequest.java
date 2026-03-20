package taskflow_api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "O nome é obrigatório !")
        @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres !")
        String nome,

        @NotBlank( message = "O email é obrigatório !")
        @Email( message = "Formato de email inválido !")
        String email,

        @NotBlank (message = "A senha é obrigatória !")
        @Size (min = 6, max = 100, message = "A senha deve ter no mínimo 6 caracteres")
        String senha
) {
}
