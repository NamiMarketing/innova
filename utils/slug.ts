/**
 * Utility functions for generating SEO-friendly property slugs
 */

import { Property } from '@/types/property';

/**
 * Normalizes a string to be URL-friendly
 * - Converts to lowercase
 * - Removes accents
 * - Replaces spaces and special chars with hyphens
 * - Removes consecutive hyphens
 */
function normalizeForUrl(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

/**
 * Maps chrType to a readable Portuguese type name for the slug
 */
function getTypeNameForSlug(chrType: string): string {
  const typeMap: Record<string, string> = {
    RESIDENTIAL_HOUSE: 'casa',
    TWO_STORY_HOUSE: 'sobrado',
    TOWNHOUSE_IN_CONDOMINIUM: 'sobrado-condominio',
    CONDOMINIUM_HOUSE: 'casa-condominio',
    APARTMENT: 'apartamento',
    PENTHOUSE: 'cobertura',
    STUDIO: 'studio',
    SHOP: 'loja',
    OFFICES: 'sala-comercial',
    COMMERCIAL_HOUSE: 'casa-comercial',
    RESIDENTIAL_PLOT: 'terreno',
    FARM: 'chacara',
    RURAL_PROPERTY: 'sitio',
  };
  return typeMap[chrType] || normalizeForUrl(chrType);
}

/**
 * Formats price for slug (removes decimals, uses full number)
 */
function formatPriceForSlug(price: number): string {
  return Math.round(price).toString();
}

/**
 * Generates a SEO-friendly slug from a property
 * Format: [tipo]-[bairro]-[cidade]-[area]m2-[transacao]-rs-[preco]-[codigo]
 * Example: loja-bigorrilho-curitiba-392m2-venda-rs-2010810-90884-004
 */
export function generatePropertySlug(property: Property): string {
  const parts: string[] = [];

  // Type (chrType mapped to Portuguese)
  parts.push(getTypeNameForSlug(property.chrType));

  // Neighborhood
  if (property.address?.neighborhood) {
    parts.push(normalizeForUrl(property.address.neighborhood));
  }

  // City
  if (property.address?.city) {
    parts.push(normalizeForUrl(property.address.city));
  }

  // Area
  if (property.features?.area && property.features.area > 0) {
    parts.push(`${Math.round(property.features.area)}m2`);
  }

  // Transaction type
  parts.push(property.type === 'sale' ? 'venda' : 'aluguel');

  // Price
  if (property.price && property.price > 0) {
    parts.push(`rs-${formatPriceForSlug(property.price)}`);
  }

  // Code is now only in query param (ref)
  // if (property.code) {
  //   parts.push(normalizeForUrl(property.code));
  // }

  return parts.join('-');
}

/**
 * Generates the full property URL with slug, id and ref
 */
export function generatePropertyUrl(property: Property): string {
  const slug = generatePropertySlug(property);
  return `/imovel/${slug}?id=${property.id}&ref=${encodeURIComponent(property.code)}`;
}
