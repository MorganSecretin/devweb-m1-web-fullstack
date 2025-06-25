package fr.ynov.devweb.configs.errors;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ErrorLoggingFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(ErrorLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        try {
            chain.doFilter(request, response);
        } finally {
            int status = httpResponse.getStatus();
            if (status >= 400) {
                logger.error("""
    ❗ FILTER DETECT ERROR
    [{}] {} => HTTP {}
    Content-Type: {}
    User-Agent: {}
    """,
    httpRequest.getMethod(),
    httpRequest.getRequestURI(),
    status,
    httpRequest.getContentType(),
    httpRequest.getHeader("User-Agent")
);
            }
        }
    }
}
