import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { TokenService } from '@app/auth/services/token.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private readonly authService: TokenService,
        private readonly router: Router,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        // Vérifie si la requête est destinée à l'API
        let requestToHandle = req;
        if (req.url.startsWith(environment.apiUrl) && token) {
            requestToHandle = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(requestToHandle).pipe(
            tap({
                error: error => {
                    console.error('AuthInterceptor: request failed', error);
                    // Ici, vous pouvez gérer les erreurs spécifiques liées à l'authentification
                    if (error.status === 401) {
                        // Par exemple, rediriger vers la page de connexion ou afficher un message d'erreur
                        this.authService.removeToken();
                        this.router.navigate(['/login']);
                    }
                }
            })
        );
    }
}
