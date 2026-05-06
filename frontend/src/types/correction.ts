export interface Correction {
  id: string;
  field: string;
  currentValue: string | number;
  suggestedValue: string | number;
  reason: string;
  confidence: number;
  category: 'amount' | 'vendor' | 'date' | 'description' | 'other';
  impact: 'low' | 'medium' | 'high';
}

export interface CorrectionBatch {
  transactionId: string;
  corrections: Correction[];
  totalCorrections: number;
  appliedCount?: number;
}
