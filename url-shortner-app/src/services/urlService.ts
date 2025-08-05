import { UrlMapping } from '../types';
import { Log } from '@your-org/logging-middleware';

const generateRandomCode = (length = 6): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createShortUrl = (
  originalUrl: string,
  existingMappings: UrlMapping[],
  customShortCode?: string,
  validityInMinutes = 30 
): UrlMapping | { error: string } => {

  let shortCode = customShortCode || generateRandomCode();

  const isCodeTaken = (code: string) => existingMappings.some(m => m.shortCode === code);

  if (customShortCode) {
    if (isCodeTaken(customShortCode)) {
      const errorMsg = `Custom shortcode '${customShortCode}' is already taken.`;
      Log('frontend', 'error', 'service', errorMsg);
      return { error: errorMsg };
    }
  } else {
    while (isCodeTaken(shortCode)) {
      Log('frontend', 'warn', 'service', `Generated shortcode '${shortCode}' caused a collision. Regenerating.`);
      shortCode = generateRandomCode();
    }
  }

  const creationDate = Date.now();
  const expiryDate = creationDate + validityInMinutes * 60 * 1000;

  const newMapping: UrlMapping = {
    shortCode,
    originalUrl,
    creationDate,
    expiryDate,
    clickCount: 0,
    clicks: [],
  };

  Log('frontend', 'info', 'service', `Successfully prepared new URL mapping for ${originalUrl}.`);
  return newMapping;
};