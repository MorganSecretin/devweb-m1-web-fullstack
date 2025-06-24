import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { TokenService } from '@app/auth/services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
    constructor(private readonly authService: TokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.authService.isAuthenticated()) {
            // Si l'utilisateur n'est pas authentifié, ne pas ajouter de token et on gère plus tard
            return next.handle(req);
        }

        const token = this.authService.getToken();

        // Vérifie si la requête est destinée à l'API
        if (req.url.startsWith(environment.apiUrl) && token) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(cloned);
        }

        return next.handle(req);
    }
}