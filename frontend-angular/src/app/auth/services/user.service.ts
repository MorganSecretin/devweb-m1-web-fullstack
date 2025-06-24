import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserLoginDto } from '@app/auth/dtos/user-login.dto';
import { UserRegisterDto } from '@app/auth/dtos/user-register.dto';
import { TokenService } from '@app/auth/services/token.service';
import { ResultHandler } from '@app/utils/services/result-handler.type';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = environment.apiUrl + '/auth';

    constructor(
        private readonly http: HttpClient,
        private readonly tokenService: TokenService
    ) {}

    register(dto: UserRegisterDto, resultHandler?: ResultHandler<void>): void {
        this.http.post(`${this.apiUrl}/register`, dto).subscribe({
            next: () => {
                resultHandler?.next?.();
            },
            error: (error) => resultHandler?.error?.(error),
        });
    }

    login(dto: UserLoginDto, resultHandler?: ResultHandler<string> ): void {
        this.http.post(`${this.apiUrl}/login`, dto, { responseType: 'text' }).subscribe({
            next: (data) => {
                console.log('User log successfully:', data);
                if (!data) {
                    resultHandler?.error?.(new Error('Registration failed, no token received.') as any);
                    return;
                }
                this.tokenService.setToken(data);
                resultHandler?.next?.(data);
            },
            error: (error) => resultHandler?.error?.(error),
        });       
    }
}