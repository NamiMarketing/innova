const characteristicTranslations: Record<string, string> = {
  'BUILT_IN_CLOSET': 'Armário Embutido',
  'PANTRY': 'Despensa',
  'LAUNDRY': 'Lavanderia',
  'SERVICE_AREA': 'Área de Serviço',
  'SEMI_FURNISHED': 'Semi Mobiliado',
  'FURNISHED': 'Mobiliado',
  'AIR_CONDITIONING': 'Ar Condicionado',
  'BALCONY': 'Sacada',
  'BARBECUE': 'Churrasqueira',
  'POOL': 'Piscina',
  'GYM': 'Academia',
  'PLAYGROUND': 'Playground',
  'PARTY_HALL': 'Salão de Festas',
  'GARDEN': 'Jardim',
  'ELEVATOR': 'Elevador',
  'SECURITY_24H': 'Segurança 24h',
  'GATED_COMMUNITY': 'Condomínio Fechado',
  'INTERCOM': 'Interfone',
  'ELECTRIC_FENCE': 'Cerca Elétrica',
  'CAMERAS': 'Câmeras',
  'ALARM': 'Alarme',
  'SPORTS_COURT': 'Quadra Esportiva',
  'SAUNA': 'Sauna',
  'GOURMET_AREA': 'Área Gourmet',
  'HOME_OFFICE': 'Home Office',
  'FIREPLACE': 'Lareira',
  'WATER_HEATER': 'Aquecedor',
  'SOLAR_ENERGY': 'Energia Solar',
  'GARAGE': 'Garagem',
  'COVERED_GARAGE': 'Garagem Coberta',
  'STAIRS': 'Escada',
  'OFFICE': 'Escritório',
  'MASTER_SUITE': 'Suíte Master',
  'ROOF': 'Telhado',
  'KITCHEN': 'Cozinha',
  'KITCHEN_CABINET': 'Armário de Cozinha',
  'DINING_ROOM': 'Sala de Jantar',
  'RECREATION_AREA': 'Área de Lazer',
  'PAVED_STREET': 'Rua Pavimentada',
  'CLOSE_TO_PUBLIC_TRANSPORTATION': 'Próximo ao Transporte Público',
  'CLOSE_TO_ACCESS_ROADS': 'Próximo a Vias de Acesso',
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
