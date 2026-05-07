import { UserInput } from '../types';
import { toolsData } from '../data/pricingData';

export interface ToolAudit {
  toolId: string;
  currentSpend: number;
  recommendedAction: 'keep' | 'downgrade' | 'switch';
  recommendedToolId?: string;
  recommendedPlanId?: string;
  newSpend: number;
  savings: number;
  reason: string;
}

export interface AuditResult {
  totalCurrentMonthly: number;
  totalNewMonthly: number;
  monthlySavings: number;
  annualSavings: number;
  toolAudits: ToolAudit[];
  isHighSavings: boolean; // Triggers the Credex pitch
}

export function runAudit(input: UserInput): AuditResult {
  let totalCurrent = 0;
  let totalNew = 0;
  const toolAudits: ToolAudit[] = [];

  input.currentStack.forEach((item) => {
    const tool = toolsData[item.toolId];
    const currentMonthly = item.monthlySpend; // What they inputted
    totalCurrent += currentMonthly;

    let audit: ToolAudit = {
      toolId: item.toolId,
      currentSpend: currentMonthly,
      recommendedAction: 'keep',
      newSpend: currentMonthly,
      savings: 0,
      reason: 'Optimal setup for your current usage.',
    };

    // RULE 1: Seat Mismatch (e.g., Team plan for 1 person)
    if (item.toolId === 'chatgpt' && item.planId === 'team' && item.seats < 2) {
      audit.recommendedAction = 'downgrade';
      audit.recommendedPlanId = 'plus';
      audit.newSpend = 20; // Plus price
      audit.savings = currentMonthly - 20;
      audit.reason = 'ChatGPT Team requires 2 users minimum. Downgrading to Plus saves money for solo users without losing access to GPT-4.';
    }

    // RULE 2: Overpaying retail for APIs
    else if ((item.toolId === 'anthropic_api' || item.toolId === 'openai_api') && currentMonthly > 200) {
      audit.recommendedAction = 'switch';
      audit.savings = currentMonthly * 0.20; // Assuming Credex offers roughly 20% off
      audit.newSpend = currentMonthly - audit.savings;
      audit.reason = `At $${currentMonthly}/mo on retail APIs, you are leaving money on the table. Switching to aggregated credits can instantly reduce this bill by ~20%.`;
    }

    // RULE 3: Use Case Misalignment (General chat for coding)
    else if (
      input.primaryUseCase === 'coding' &&
      item.toolId === 'chatgpt' &&
      !input.currentStack.some(t => toolsData[t.toolId].category === 'coding')
    ) {
      audit.recommendedAction = 'switch';
      audit.recommendedToolId = 'cursor';
      audit.recommendedPlanId = 'pro';
      audit.newSpend = item.seats * 20; // Cursor Pro is $20/seat
      audit.savings = currentMonthly - audit.newSpend;
      audit.reason = 'For coding teams, a dedicated AI IDE like Cursor Pro provides vastly more ROI than a general-purpose ChatGPT subscription for the same price per seat.';
      
      // Prevent negative savings if they entered a weird current spend
      if (audit.savings < 0) {
         audit.savings = 0;
         audit.newSpend = currentMonthly;
         audit.recommendedAction = 'keep';
         audit.reason = 'Switching to Cursor Pro would benefit your coding workflow, but your current spend is heavily discounted.';
      }
    }

    // Default: Check if they inputted a spend higher than retail
    else if (currentMonthly > (tool.plans.find(p => p.id === item.planId)?.pricePerSeat || 0) * item.seats) {
       const retailCost = (tool.plans.find(p => p.id === item.planId)?.pricePerSeat || 0) * item.seats;
       audit.savings = currentMonthly - retailCost;
       audit.newSpend = retailCost;
       audit.reason = 'You are currently paying above standard retail pricing for this tier. Audit your billing page immediately.';
    }

    toolAudits.push(audit);
    totalNew += audit.newSpend;
  });

  const monthlySavings = totalCurrent - totalNew;

  return {
    totalCurrentMonthly: totalCurrent,
    totalNewMonthly: totalNew,
    monthlySavings: monthlySavings > 0 ? monthlySavings : 0,
    annualSavings: (monthlySavings > 0 ? monthlySavings : 0) * 12,
    toolAudits,
    // The requirement states audits showing >$500/mo savings trigger the Credex pitch
    isHighSavings: monthlySavings > 500, 
  };
}