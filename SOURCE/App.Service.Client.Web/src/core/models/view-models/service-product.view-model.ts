/**
 * Service Product View Model
 */
export interface ServiceProductViewModel {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  currency: string;
  displayLabel: string;
  formattedPrice: string;
}
