import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { UserService } from '@app/auth/services/user.service';
import { UserRegisterDto } from '@app/auth/dtos/user-register.dto';
import { Role, roleList } from '@app/auth/enums/role.enum';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, SelectModule, CardModule],
    template: `
        <div class="max-w-md mx-auto mt-10">
            <p-card header="Créer un compte" class="rounded-2xl p-6">
                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
                    <div class="flex flex-col gap-1">
                        <label for="name" class="text-sm font-medium">Nom d'utilisateur</label>
                        <input id="name" type="text" pInputText formControlName="name" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="name" class="text-sm font-medium">Email</label>
                        <input id="name" type="email" pInputText formControlName="email" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-sm font-medium">Mot de passe</label>
                        <input id="password" type="password" pPassword formControlName="password" class="w-full" appendTo="body" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="roles" class="text-sm font-medium">Rôle</label>
                        <p-select id="roles" formControlName="roles" [options]="roles" optionLabel="label" optionValue="value" placeholder="Sélectionner un rôle" class="w-full"></p-select>
                    </div>

                    <div class="pt-4">
                        <button pButton type="submit" label="S'inscrire" class="w-full" [disabled]="registerForm.invalid" (load)="submitted"></button>
                    </div>
                </form>
            </p-card>
        </div>
    `
})
export class RegisterComponent {
    roles = roleList;

    registerForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        roles: new FormControl(Role.ROLE_USER, Validators.required)
    });

    submitted = false;

    constructor(
        private readonly userService: UserService,
        private readonly router: Router,
    ) {}

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.valid) {
            const dto: UserRegisterDto = this.registerForm.value as UserRegisterDto;
            this.userService.register(dto, {
                next: () => {
                    this.submitted = false;
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.submitted = false;
                    console.error('Registration failed:', err);
                }
            });
        }
    }
}
