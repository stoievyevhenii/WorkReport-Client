import { Customer } from "../Customer/Customer";
import { Worker } from "../Worker/Worker";

export interface Trip {
    id: number;
    startDate: string;
    endDate: string;
    workers: Worker[];
    customer: Customer;
    description: string;
}