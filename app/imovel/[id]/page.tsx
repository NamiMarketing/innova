import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/services/properfy';
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const typeLabel = property.type === 'sale' ? 'Venda' : 'Aluguel';
  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg';
  const address = property.address
    ? `${property.address.street || ''}, ${property.address.number || ''} - ${property.address.neighborhood || ''}, ${property.address.city || ''} - ${property.address.state || ''}`
    : 'Endereco nao disponivel';

  const whatsappMessage = encodeURIComponent(
    `Ola! Tenho interesse no imovel ${property.code} - ${property.title}`
  );
  const whatsappLink = `https://wa.me/5541999999999?text=${whatsappMessage}`;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/imoveis" className={styles.breadcrumbLink}>Imoveis</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{property.code}</span>
        </nav>

        <div className={styles.grid}>
          {/* Main Column */}
          <div className={styles.mainColumn}>
            {/* Gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <Image
                  src={mainImage}
                  alt={property.title}
                  fill
                  className={styles.image}
                  priority
                />
                <div className={styles.badges}>
                  <span className={styles.badgeType}>{typeLabel}</span>
                  {property.highlighted && (
                    <span className={styles.badgeHighlight}>Destaque</span>
                  )}
                </div>
              </div>
              {property.images && property.images.length > 1 && (
                <div className={styles.thumbnails}>
                  {property.images.map((img, index) => (
                    <div key={img.id || index} className={styles.thumbnail}>
                      <Image
                        src={img.url}
                        alt={`${property.title} - Foto ${index + 1}`}
                        fill
                        className={styles.image}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className={styles.card}>
              <h1 className={styles.title}>{property.title}</h1>
              <div className={styles.location}>
                <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </div>
              <p className={styles.code}>Codigo: {property.code}</p>

              {/* Features */}
              <div className={styles.features}>
                {property.features.bedrooms > 0 && (
                  <div className={styles.feature}>
                    <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className={styles.featureValue}>{property.features.bedrooms}</span>
                    <span className={styles.featureLabel}>Quartos</span>
                  </div>
                )}
                {property.features.bathrooms > 0 && (
                  <div className={styles.feature}>
                    <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <span className={styles.featureValue}>{property.features.bathrooms}</span>
                    <span className={styles.featureLabel}>Banheiros</span>
                  </div>
                )}
                {property.features.parkingSpaces > 0 && (
                  <div className={styles.feature}>
                    <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    <span className={styles.featureValue}>{property.features.parkingSpaces}</span>
                    <span className={styles.featureLabel}>Vagas</span>
                  </div>
                )}
                {property.features.area > 0 && (
                  <div className={styles.feature}>
                    <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className={styles.featureValue}>{property.features.area}m2</span>
                    <span className={styles.featureLabel}>Area Total</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <>
                  <h2 className={styles.sectionTitle}>Descricao</h2>
                  <p className={styles.description}>{property.description}</p>
                </>
              )}
            </div>
          </div>

          {/* Side Column */}
          <div className={styles.sideColumn}>
            <div className={styles.priceCard}>
              <p className={styles.priceLabel}>{typeLabel}</p>
              <p className={styles.price}>{formatPrice(property.price)}</p>
              {property.type === 'rent' && (property.condoFee || property.iptu) && (
                <p className={styles.priceExtra}>
                  {property.condoFee && `+ Condominio: ${formatPrice(property.condoFee)}`}
                  {property.condoFee && property.iptu && ' | '}
                  {property.iptu && `IPTU: ${formatPrice(property.iptu)}`}
                </p>
              )}

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaButtonSecondary}>
                <svg className={styles.ctaIcon} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar no WhatsApp
              </a>

              <a href="/contato" className={styles.ctaButton}>
                <svg className={styles.ctaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Enviar Mensagem
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
