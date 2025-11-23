export type TransactionType = "location" | "achat";
export type RentalPeriod = "day" | "week" | "month" | "year";

export interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  images: string[];
  category: string;
  transaction_type?: TransactionType;
  rental_period?: RentalPeriod;
  created_at?: string;
  status?: string;
}

export interface Filters {
  category: string;
  cityId: string;
  minPrice: string;
  maxPrice: string;
  transactionType: string;
}

export interface City {
  id: string;
  name: string;
}

export interface CarouselItem {
  image: string;
  title: string;
  description: string;
  sponsoredText?: string;
  visitButtonText?: string;
  visitUrl?: string;
}
