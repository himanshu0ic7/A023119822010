export interface ClickData {
  timestamp: number;
  source: string;
  location: string;
}

export interface UrlMapping {
  shortCode: string;
  originalUrl: string;
  creationDate: number;
  expiryDate: number;
  clickCount: number;
  clicks: ClickData[];
}