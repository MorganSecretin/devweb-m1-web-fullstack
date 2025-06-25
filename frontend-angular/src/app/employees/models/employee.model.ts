import { Absence } from "@app/employees/models/abscence.model";
import { Vacation } from "@app/employees/models/vacation.model";

export interface Employee {
    id: string; // Required
    name?: string;
    birth?: string; // ISO date string (e.g., '2023-12-31')
    address?: string;
    email: string; // Required
    phone?: string; // 0644043030 format
    job?: string;
    salary?: number;
    contractStart?: string; // ISO date string (e.g., '2024-06-01')
    contractEnd?: string | null; // ISO date string or null
    comment?: string;
    vacations: Vacation[];
    absences: Absence[];
}
