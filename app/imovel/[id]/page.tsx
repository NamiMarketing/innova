import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyById, getHighlightedProperties } from '@/services/properfy';
import { translateCharacteristic } from '@/utils/translations';
import { safeFetch } from '@/lib/safe-fetch';
import Gallery from './Gallery';
import ContactForm from './ContactForm';
import { PropertySwiper } from '@/components/PropertySwiper';
import styles from './page.module.css';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: 'Imovel nao encontrado | Innova Imobiliaria',
    };
  }

  const typeLabel = property.type === 'sale' ? 'Venda' : 'Aluguel';

  return {
    title: `${property.title} | ${typeLabel} | Innova Imobiliaria`,
    description: property.description?.slice(0, 160) || `${property.title} - ${property.address?.city}`,
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 160),
      images: property.images?.[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  // Fetch highlighted properties for the swiper
  const { data: highlightedProperties } = await safeFetch(getHighlightedProperties(10));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatTitleCase = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const typeLabel = property.type === 'sale' ? 'Venda' : 'Alugar';
  const address = property.address
    ? `R. ${property.address.street || ''}, ${property.address.number || ''}, ${property.address.neighborhood || ''} - ${property.address.city || ''}/${property.address.state || ''}`
    : 'Endereco nao disponivel';

  const whatsappMessage = encodeURIComponent(
    `Ola! Tenho interesse no imovel ${property.code} - ${property.title}`
  );
  const whatsappLink = `https://wa.me/5541999999999?text=${whatsappMessage}`;

  return (
    <div className={styles.container}>
      {/* Gallery Section - Outside content for full width */}
      <Gallery
        images={property.images || []}
        title={property.title}
        virtualTourUrl={property.virtualTourUrl}
      />

      <div className={styles.content}>
        <div className={styles.grid}>
          {/* Main Column */}
          <div className={styles.mainColumn}>
            {/* Price and Features Header */}
            <div className={styles.priceHeader}>
              <div className={styles.priceRow}>
                <div className={styles.priceInfo}>
                  <span className={styles.typeLabel}>{typeLabel}</span>
                  <span className={styles.price}>{formatPrice(property.price)}</span>
                  {property.type === 'rent' && property.condoFee && (
                    <span className={styles.priceExtra}>
                      Condominio R$ {property.condoFee.toLocaleString('pt-BR')}/mês
                    </span>
                  )}
                </div>
              </div>

              {/* Features Row */}
              <div className={styles.featuresRow}>
                {property.features.area > 0 && (
                  <div className={styles.featureItem}>
                    <p>Área total</p>
                    
                    <div>
                      <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <p className={styles.featureValue}>{property.features.area} m²</p>
                    </div>
                  </div>
                )}
                {property.features.area > 0 && (
                  <div className={styles.featureItem}>
                    <p>Área útil</p>

                    <div>
                      <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <p className={styles.featureValue}>{property.features.area} m²</p>
                    </div>
                    
                  </div>
                )}
                {property.features.bedrooms > 0 && (
                  <div className={styles.featureItem}>
                    <p>Quartos</p>

                    <div>
                      <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className={styles.featureValue}>{property.features.bedrooms}</span>
                    </div>
                  </div>
                )}
                {property.features.suites > -1 && (
                  <div className={styles.featureItem}>
                    <p>Suítes</p>

                    <div>
                      <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <p className={styles.featureValue}>{property.features.suites}</p>
                    </div>                
                  </div>
                )}
                {property.features.bathrooms > 0 && (
                  <div className={styles.featureItem}>
                    <p>Banheiros</p>

                    <div>
                      <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <p className={styles.featureValue}>{property.features.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.features.parkingSpaces > 0 && (
                  <div className={styles.featureItem}>
                    <p>Vagas</p>

                    <div>
                      <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      <p className={styles.featureValue}>{property.features.parkingSpaces}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location Row */}
              <div className={styles.locationRow}>
                <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={styles.locationText}>{address}</span>
              </div>

              {/* Google Maps */}
              {property.address && (
                <div className={styles.mapContainer}>
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa - ${property.title}`}
                  />
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className={styles.detailsCard}>
              <h1 className={styles.propertyTitle}>{formatTitleCase(property.title)}</h1>
              <p className={styles.propertyCode}>Cod. {property.code}</p>

              {/* Description */}
              {property.description && (
                <>
                  <h2 className={styles.sectionTitle}>Descricao</h2>
                  <p className={styles.description}>{property.description}</p>
                </>
              )}

              {/* Characteristics */}
              {property.characteristics.length > 0 && (
                <div className={styles.characteristicsSection}>
                  <h2 className={styles.sectionTitle}>Caracteristicas</h2>
                  <div className={styles.characteristicsGrid}>
                    {property.characteristics.map((char, index) => (
                      <div key={index} className={styles.characteristicItem}>
                        <svg className={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{translateCharacteristic(char)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Column - Contact Form */}
          <div className={styles.sideColumn}>
            <ContactForm propertyCode={property.code} whatsappLink={whatsappLink} />
          </div>
        </div>

                {/* Separator */}
        <div className={styles.separator} />
      </div>

              
      {/* Property Swiper Section - Full Width */}
      <PropertySwiper
        title="Encontre imóveis similares"
        properties={highlightedProperties ?? []}
      />
    </div>
  );
}
