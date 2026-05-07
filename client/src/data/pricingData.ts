// client/src/data/pricingData.ts

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface Plan {
  id: string;
  name: string;
  pricePerSeat: number; 
  minimumSeats?: number;
}

export interface Tool {
  id: string;
  name: string;
  category: 'chat' | 'coding' | 'api';
  plans: Plan[];
}

export const toolsData: Record<string, Tool> = {
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    plans: [
      { id: 'hobby', name: 'Hobby', pricePerSeat: 0 },
      { id: 'pro', name: 'Pro', pricePerSeat: 20 },
      { id: 'business', name: 'Business', pricePerSeat: 40 },
    ],
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'chat',
    plans: [
      { id: 'plus', name: 'Plus', pricePerSeat: 20 },
      { id: 'team', name: 'Team', pricePerSeat: 25, minimumSeats: 2 },
      { id: 'enterprise', name: 'Enterprise', pricePerSeat: 60 }, 
    ],
  },
  // You will add the rest of the tools here...
};