const characteristicTranslations: Record<string, string> = {
  'BUILT_IN_CLOSET': 'Armario Embutido',
  'PANTRY': 'Despensa',
  'LAUNDRY': 'Lavanderia',
  'SERVICE_AREA': 'Area de Servico',
  'SEMI_FURNISHED': 'Semi Mobiliado',
  'FURNISHED': 'Mobiliado',
  'AIR_CONDITIONING': 'Ar Condicionado',
  'BALCONY': 'Sacada',
  'BARBECUE': 'Churrasqueira',
  'POOL': 'Piscina',
  'GYM': 'Academia',
  'PLAYGROUND': 'Playground',
  'PARTY_HALL': 'Salao de Festas',
  'GARDEN': 'Jardim',
  'ELEVATOR': 'Elevador',
  'SECURITY_24H': 'Segurança 24h',
  'GATED_COMMUNITY': 'Condominio Fechado',
  'INTERCOM': 'Interfone',
  'ELECTRIC_FENCE': 'Cerca Eletrica',
  'CAMERAS': 'Cameras',
  'ALARM': 'Alarme',
  'SPORTS_COURT': 'Quadra Esportiva',
  'SAUNA': 'Sauna',
  'GOURMET_AREA': 'Area Gourmet',
  'HOME_OFFICE': 'Home Office',
  'FIREPLACE': 'Lareira',
  'WATER_HEATER': 'Aquecedor',
  'SOLAR_ENERGY': 'Energia Solar',
  'GARAGE': 'Garagem',
  'COVERED_GARAGE': 'Garagem Coberta',
};

export function translateCharacteristic(characteristic: string): string {
  return (
    characteristicTranslations[characteristic] ||
    characteristic
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
