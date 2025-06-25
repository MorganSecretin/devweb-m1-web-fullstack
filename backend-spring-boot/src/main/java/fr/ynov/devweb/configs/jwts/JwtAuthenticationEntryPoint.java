package fr.ynov.devweb.configs.jwts;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // Vérifier si la réponse a déjà été traitée par le GlobalExceptionHandler
        if (response.isCommitted()) {
            return;
        }
        
        // Log pour débuggage
        System.out.println("Accès non autorisé à l'URL: " + request.getRequestURI() + " - " + authException.getMessage());
        
        // Définir le statut 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Retourner une réponse JSON avec le message d'erreur
        String jsonResponse = String.format(
            "{\"error\": \"Unauthorized\", \"message\": \"%s\", \"path\": \"%s\", \"timestamp\": \"%s\"}",
            "Accès non autorisé. Veuillez vous connecter.",
            request.getRequestURI(),
            java.time.Instant.now().toString()
        );
        
        response.getWriter().write(jsonResponse);
    }
}
