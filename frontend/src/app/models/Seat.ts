import { Theater } from "./Theaters";

export class Seat {
    id?: number;
    location?: string;
    reclining?: boolean;
    theaterId?: number;
    theaters?: Theater;
}