import { Absence } from "@app/employees/models/abscence.model";
import { Vacation } from "@app/employees/models/vacation.model";
import { Person } from "@app/shared/models/person.model";

export interface Employee {
    id: string; // Same as Person ID
    person: Person;
    job: string;
    salary: number;
    contractStart: string; // ISO date string (e.g., '2024-06-01')
    contractEnd: string | null; // ISO date string or null
    comment: string;
    vacations: Vacation[];
    absences: Absence[];
}
