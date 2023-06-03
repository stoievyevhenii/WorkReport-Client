import { Type } from 'typescript';

export interface ApiResponse {
  description: string;
  statusCode: number;
  totalRecords: number;
  values: Type[];
}
