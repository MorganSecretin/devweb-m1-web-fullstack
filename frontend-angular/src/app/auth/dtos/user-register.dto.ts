import { Role } from "@app/auth/enums/role.enum";

export interface UserRegisterDto {
    name: string;
    email: string;
    password: string;
    roles: Role;
}
