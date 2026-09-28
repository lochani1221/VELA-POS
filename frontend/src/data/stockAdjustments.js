export const ADJUSTMENT_TYPES = ['Stock In', 'Stock Out', 'Stock Transfer', 'Damaged', 'Expired', 'Correction'];

export const BRANCHES = ['Colombo', 'Kandy', 'Galle'];

export function blankAdjustment() {
  return {
    productId: '',
    type: ADJUSTMENT_TYPES[0],
    quantity: 1,
    branch: BRANCHES[0],
    toBranch: BRANCHES[1],
    reason: '',
  };
}