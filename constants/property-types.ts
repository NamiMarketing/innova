// Properfy property types with Portuguese translations
export const PROPERTY_TYPES = [
  {
    value: 'APARTMENT',
    text: 'Apartamento',
  },
  {
    value: 'COMMERCIAL_AREA',
    text: 'Área Comercial',
  },
  {
    value: 'RESIDENTIAL_AREA',
    text: 'Área Residencial',
  },
  {
    value: 'WAREHOUSE',
    text: 'Barracão/Galpão',
  },
  {
    value: 'BOX',
    text: 'Box',
  },
  {
    value: 'BUILD_TO_SUIT',
    text: 'Build to Suit',
  },
  {
    value: 'COMMERCIAL_HOUSE',
    text: 'Casa Comercial',
  },
  {
    value: 'VILLAGE_HOUSE',
    text: 'Casa de Vila',
  },
  {
    value: 'CONDOMINIUM_HOUSE',
    text: 'Casa em Condomínio',
  },
  {
    value: 'RESIDENTIAL_HOUSE',
    text: 'Casa Residencial',
  },
  {
    value: 'RESIDENTIAL_SMALLHOLDING',
    text: 'Chácara',
  },
  {
    value: 'COMMERCIAL_SMALLHOLDING',
    text: 'Chácara Comercial',
  },
  {
    value: 'PENTHOUSE',
    text: 'Cobertura',
  },
  {
    value: 'INDUSTRIAL_CONDOMINIUM',
    text: 'Condomínio Industrial',
  },
  {
    value: 'CLINIC',
    text: 'Consultório',
  },
  {
    value: 'COWORKING',
    text: 'Coworking',
  },
  {
    value: 'DEPOSIT',
    text: 'Depósito',
  },
  {
    value: 'RESIDENTIAL_BUILDING',
    text: 'Edifício Residencial',
  },
  {
    value: 'COMMERCIAL_DEVELOPMENT',
    text: 'Empreendimento Comercial',
  },
  {
    value: 'SCHOOL',
    text: 'Escola',
  },
  {
    value: 'PARKING_LOT',
    text: 'Estacionamento',
  },
  {
    value: 'FARM',
    text: 'Fazenda',
  },
  {
    value: 'INDUSTRIAL_WAREHOUSE',
    text: 'Galpão Industrial',
  },
  {
    value: 'CONDOMINIUM_WAREHOUSE',
    text: 'Galpão para Condomínio',
  },
  {
    value: 'STUDIO_APARTMENT',
    text: 'Kitnet',
  },
  {
    value: 'LOFT',
    text: 'Loft',
  },
  {
    value: 'SHOP',
    text: 'Loja',
  },
  {
    value: 'INDUSTRIAL_SUBDIVISION',
    text: 'Loteamento Industrial',
  },
  {
    value: 'OTHERS_COMMERCIAL',
    text: 'Outros - Comercial',
  },
  {
    value: 'OTHERS_RESIDENTIAL',
    text: 'Outros - Residencial',
  },
  {
    value: 'PAVILION',
    text: 'Pavilhão',
  },
  {
    value: 'COMMERCIAL_POINT',
    text: 'Ponto Comercial',
  },
  {
    value: 'HOSTEL',
    text: 'Pousada',
  },
  {
    value: 'BUILDING',
    text: 'Prédio',
  },
  {
    value: 'COMMERCIAL_BUILDING',
    text: 'Prédio Comercial',
  },
  {
    value: 'OFFICES',
    text: 'Salas/Conjuntos',
  },
  {
    value: 'COMMERCIAL_FARM',
    text: 'Sítio Comercial',
  },
  {
    value: 'RESIDENTIAL_FARM',
    text: 'Sítio Residencial',
  },
  {
    value: 'TWO_STORY_HOUSE',
    text: 'Sobrado',
  },
  {
    value: 'TOWNHOUSE_IN_CONDOMINIUM',
    text: 'Sobrado em Condomínio',
  },
  {
    value: 'STUDIO',
    text: 'Studio',
  },
  {
    value: 'COMMERCIAL_PLOT',
    text: 'Terreno Comercial',
  },
  {
    value: 'LAND_IN_CONDOMINIUM',
    text: 'Terreno em Condomínio',
  },
  {
    value: 'INDUSTRIAL_PLOT',
    text: 'Terreno Industrial',
  },
  {
    value: 'RESIDENTIAL_PLOT',
    text: 'Terreno Residencial',
  },
];

// Map for quick lookup
export const PROPERTY_TYPE_MAP: Record<string, string> = PROPERTY_TYPES.reduce(
  (acc, type) => {
    acc[type.value] = type.text;
    return acc;
  },
  {} as Record<string, string>
);

// Helper function to get property type text
export function getPropertyTypeText(chrType: string): string {
  return PROPERTY_TYPE_MAP[chrType] || chrType;
}
