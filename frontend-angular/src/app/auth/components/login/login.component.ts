import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserService } from '@app/auth/services/user.service';
import { UserLoginDto } from '@app/auth/dtos/user-login.dto';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
    template: `
        <div class="max-w-md mx-auto mt-10">
            <p-card header="Connexion" class="rounded-2xl p-6">
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-sm font-medium">Email</label>
                        <input id="email" type="email" pInputText formControlName="email" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-sm font-medium">Mot de passe</label>
                        <input id="password" type="password" pPassword formControlName="password" class="w-full" appendTo="body" />
                    </div>
                    <div class="pt-4">
                        <button pButton type="submit" label="Se connecter" class="w-full" [disabled]="loginForm.invalid" (load)="submitted"></button>
                    </div>
                </form>
            </p-card>
        </div>
    `
})
export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
    });

    submitted = false;

    constructor(
        private readonly userService: UserService,
        private readonly router: Router
    ) {}

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.valid) {
            const dto: UserLoginDto = this.loginForm.value as UserLoginDto;
            this.userService.login(dto, {
                next: () => {
                    this.submitted = false;
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.submitted = false;
                    console.log('Login failed. Please check your credentials : ', error);
                }
            });
        } else {
            this.submitted = false;
        }
    }
}