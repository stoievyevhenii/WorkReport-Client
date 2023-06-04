import { Customer, UsedMaterials, WorkersTrip } from '../index';

export interface Trip {
  id: number;
  startDate: string;
  endDate: string;
  dateOfCreation: string;
  workersTrip: WorkersTrip[];
  usedMaterials: UsedMaterials[];
  customer: Customer;
  description: string;
}
