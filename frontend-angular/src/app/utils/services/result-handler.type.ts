import { HttpErrorResponse } from "@angular/common/http";

export type ResultHandler<T> = {
    next?: (data: T extends (infer U)[] ? U[] : T) => void;
    error?: (error?: HttpErrorResponse) => void;
};