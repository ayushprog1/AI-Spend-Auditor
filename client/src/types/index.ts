import type { UseCase } from '../data/pricingData';

export interface UserInput {
  teamSize: number;
  primaryUseCase: UseCase;
  currentStack: {
    toolId: string;
    planId: string;
    seats: number;
    monthlySpend: number; 
  }[];
}