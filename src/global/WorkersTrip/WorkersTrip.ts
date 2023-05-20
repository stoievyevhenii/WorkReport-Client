import { Worker } from "../index";

export interface WorkersTrip {
    id: number;
    worker: Worker;
    spentDays: number;
}