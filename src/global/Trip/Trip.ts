import { Customer, UsedMaterials, WorkersTrip } from '../index';

export interface Trip {
  id: number;
  startDate: string;
  endDate: string;
  workersTrip: WorkersTrip[];
  usedMaterials: UsedMaterials[];
  customer: Customer;
  description: string;
}
