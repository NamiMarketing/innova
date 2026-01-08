import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getPropertyById, getHighlightedProperties } from '@/services/properfy';
import { translateCharacteristic } from '@/utils/translations';
import { safeFetch } from '@/lib/safe-fetch';
import Gallery from './Gallery';
import ContactForm from './ContactForm';
import { PropertySwiper } from '@/components/PropertySwiper';
import styles from './page.module.css';

// ISR: Revalidate every hour
export const revalidate = 3600;

// Cache the property fetch to avoid duplicate calls
const getCachedPropertyById = cache(async (id: string) => {
  return getPropertyById(id);
});

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string; ref?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await searchParams;

  if (!id) {
    return {
      title: 'Imóvel não encontrado | Innova Imobiliária',
    };
  }

  const property = await getCachedPropertyById(id);

  if (!property) {
    return {
      title: 'Imóvel não encontrado | Innova Imobiliária',
    };
  }

  const typeLabel = property.type === 'sale' ? 'Venda' : 'Aluguel';

  return {
    title: `${property.title} | ${typeLabel} | Innova Imobiliária`,
    description:
      property.description?.slice(0, 160) ||
      `${property.title} - ${property.address?.city}`,
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 160),
      images: property.images?.[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyPage({
  searchParams,
}: PropertyPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  // Fetch property and highlighted properties in parallel
  const [property, { data: highlightedProperties }] = await Promise.all([
    getCachedPropertyById(id),
    safeFetch(getHighlightedProperties(10)),
  ]);

  if (!property) {
    notFound();
  }

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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const typeLabel = property.type === 'sale' ? 'Venda' : 'Alugar';
  const address = property.address
    ? `R. ${property.address.street || ''}, ${property.address.number || ''}, ${property.address.neighborhood || ''} - ${property.address.city || ''}/${property.address.state || ''}`
    : 'Endereço não disponível';

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no imóvel ${property.code} - ${property.title}`
  );
  // WhatsApp: Aluguel -> 41 8701-0407, Venda -> 41 8701-0071
  const whatsappNumber =
    property.type === 'rent' ? '5541987010407' : '5541987010071';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className={styles.container}>
      {/* Gallery Section - Outside content for full width */}
      <Gallery
        images={property.images || []}
        title={property.title}
        propertyId={property.id}
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
                  <p className={styles.typeLabel}>{typeLabel}</p>
                  <p className={styles.price}>{formatPrice(property.price)}</p>
                  {property.type === 'rent' && property.condoFee && (
                    <p className={styles.priceExtra}>
                      + Condomínio R$ {property.condoFee.toLocaleString('pt-BR')}
                      /mês
                    </p>
                  )}
                  {property.type === 'rent' && property.iptu && (
                    <p className={styles.priceExtra}>
                      + IPTU R$ {property.iptu.toLocaleString('pt-BR')}/mês
                    </p>
                  )}
                  {property.type === 'rent' && property.fci && (
                    <p className={styles.priceExtra}>
                      + FCI R$ {property.fci.toLocaleString('pt-BR')}/mês
                    </p>
                  )}
                  {property.type === 'rent' && property.fireInsurance && (
                    <p className={styles.priceExtra}>
                      + Seguro Incêndio R${' '}
                      {property.fireInsurance.toLocaleString('pt-BR')}/mês
                    </p>
                  )}
                </div>
              </div>

              {/* Features Row */}
              <div className={styles.featuresRow}>
                {property.features.area > 0 && (
                  <div className={styles.featureItem}>
                    <p>Área total</p>
                    <div>
                      <svg
                        className={styles.featureIcon}
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 12.4444C0 12.857 0.163888 13.2527 0.455612 13.5444C0.747335 13.8361 1.143 14 1.55556 14H12.4444C12.857 14 13.2527 13.8361 13.5444 13.5444C13.8361 13.2527 14 12.857 14 12.4444V1.55556C14 1.143 13.8361 0.747335 13.5444 0.455612C13.2527 0.163888 12.857 0 12.4444 0H1.55556C1.143 0 0.747335 0.163888 0.455612 0.455612C0.163888 0.747335 0 1.143 0 1.55556V12.4444ZM7 2.33333H11.6667V7H10.1111V3.88889H7V2.33333ZM2.33333 7H3.88889V10.1111H7V11.6667H2.33333V7Z"
                          fill="black"
                        />
                      </svg>
                      <p className={styles.featureValue}>
                        {property.features.area} m²
                      </p>
                    </div>
                  </div>
                )}
                {property.features.builtArea &&
                  property.features.builtArea > 0 && (
                    <div className={styles.featureItem}>
                      <p>Área útil</p>
                      <div>
                        <svg
                          className={styles.featureIcon}
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 1.55556V12.4444C0 13.3023 0.697667 14 1.55556 14H12.4444C13.3023 14 14 13.3023 14 12.4444V1.55556C14 0.697667 13.3023 0 12.4444 0H1.55556C0.697667 0 0 0.697667 0 1.55556ZM12.446 12.4444H1.55556V1.55556H12.4444L12.446 12.4444Z"
                            fill="black"
                          />
                          <path
                            d="M9.33355 7H10.8891V3.11111H7.00022V4.66667H9.33355V7ZM7.00022 9.33334H4.66688V7H3.11133V10.8889H7.00022V9.33334Z"
                            fill="black"
                          />
                        </svg>
                        <p className={styles.featureValue}>
                          {property.features.builtArea} m²
                        </p>
                      </div>
                    </div>
                  )}
                {(property.features.bedrooms || 0) +
                  (property.features.suites || 0) > 0 && (
                  <div className={styles.featureItem}>
                    <p>Quartos</p>
                    <div>
                      <svg
                        className={styles.featureIcon}
                        width="19"
                        height="15"
                        viewBox="0 0 19 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.375 14.5V13.1875M3.125 14.5V13.1875"
                          stroke="black"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17.125 7.5C17.125 4.20037 17.125 2.55012 16.0995 1.5255C15.074 0.500875 13.4246 0.5 10.125 0.5H8.375C5.07538 0.5 3.42512 0.5 2.4005 1.5255C1.37587 2.551 1.375 4.20037 1.375 7.5M0.5 10.125C0.5 9.3095 0.5 8.90175 0.633 8.58062C0.720949 8.36815 0.849909 8.1751 1.01251 8.0125C1.17511 7.84991 1.36816 7.72095 1.58062 7.633C1.90175 7.5 2.3095 7.5 3.125 7.5H15.375C16.1905 7.5 16.5982 7.5 16.9194 7.633C17.1318 7.72095 17.3249 7.84991 17.4875 8.0125C17.6501 8.1751 17.7791 8.36815 17.867 8.58062C18 8.90175 18 9.3095 18 10.125C18 10.9405 18 11.3482 17.867 11.6694C17.7791 11.8818 17.6501 12.0749 17.4875 12.2375C17.3249 12.4001 17.1318 12.529 16.9194 12.617C16.5982 12.75 16.1905 12.75 15.375 12.75H3.125C2.3095 12.75 1.90175 12.75 1.58062 12.617C1.36816 12.529 1.17511 12.4001 1.01251 12.2375C0.849909 12.0749 0.720949 11.8818 0.633 11.6694C0.5 11.3482 0.5 10.9405 0.5 10.125Z"
                          stroke="black"
                        />
                        <path
                          d="M14.9375 7.5V6.1875C14.9375 4.53725 14.9375 3.713 14.4247 3.20025C13.912 2.6875 13.0878 2.6875 11.4375 2.6875H7.0625C5.41225 2.6875 4.588 2.6875 4.07525 3.20025C3.5625 3.713 3.5625 4.53725 3.5625 6.1875V7.5M9.25 3.125V7.5"
                          stroke="black"
                        />
                      </svg>
                      <span className={styles.featureValue}>
                        {(property.features.bedrooms || 0) +
                          (property.features.suites || 0)}
                        {property.features.suites > 0 && (
                          <span>
                            ({property.features.suites} {property.features.suites > 1 ? 'suítes' : 'suíte'})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {(property.features.bathrooms || 0) +
                  (property.features.suites || 0) >
                  0 && (
                  <div className={styles.featureItem}>
                    <p>Banheiros</p>
                    <div>
                      <svg
                        className={styles.featureIcon}
                        width="13"
                        height="16"
                        viewBox="0 0 13 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.78571 13.3333C2.52262 13.3333 2.30224 13.248 2.12457 13.0773C1.94691 12.9067 1.85776 12.6957 1.85714 12.4444C1.85652 12.1932 1.94567 11.9822 2.12457 11.8115C2.30348 11.6409 2.52386 11.5555 2.78571 11.5555C3.04757 11.5555 3.26826 11.6409 3.44779 11.8115C3.62731 11.9822 3.71614 12.1932 3.71429 12.4444C3.71243 12.6957 3.62329 12.907 3.44686 13.0782C3.27043 13.2495 3.05005 13.3345 2.78571 13.3333ZM6.5 13.3333C6.23691 13.3333 6.01652 13.248 5.83886 13.0773C5.66119 12.9067 5.57205 12.6957 5.57143 12.4444C5.57081 12.1932 5.65995 11.9822 5.83886 11.8115C6.01776 11.6409 6.23814 11.5555 6.5 11.5555C6.76186 11.5555 6.98255 11.6409 7.16207 11.8115C7.3416 11.9822 7.43043 12.1932 7.42857 12.4444C7.42671 12.6957 7.33757 12.907 7.16114 13.0782C6.98471 13.2495 6.76433 13.3345 6.5 13.3333ZM10.2143 13.3333C9.95119 13.3333 9.73081 13.248 9.55314 13.0773C9.37548 12.9067 9.28633 12.6957 9.28571 12.4444C9.2851 12.1932 9.37424 11.9822 9.55314 11.8115C9.73205 11.6409 9.95243 11.5555 10.2143 11.5555C10.4761 11.5555 10.6968 11.6409 10.8764 11.8115C11.0559 11.9822 11.1447 12.1932 11.1429 12.4444C11.141 12.6957 11.0519 12.907 10.8754 13.0782C10.699 13.2495 10.4786 13.3345 10.2143 13.3333ZM0 9.77777V7.99999C0 6.42963 0.52619 5.06666 1.57857 3.91111C2.63095 2.75555 3.9619 2.07407 5.57143 1.86667V0H7.42857V1.86667C9.0381 2.07407 10.369 2.75555 11.4214 3.91111C12.4738 5.06666 13 6.42963 13 7.99999V9.77777H0ZM1.85714 7.99999H11.1429C11.1429 6.77037 10.69 5.72237 9.78436 4.856C8.87869 3.98963 7.78391 3.55615 6.5 3.55555C5.2161 3.55496 4.12131 3.98844 3.21564 4.856C2.30998 5.72355 1.85714 6.77155 1.85714 7.99999ZM2.78571 16C2.52262 16 2.30224 15.9147 2.12457 15.744C1.94691 15.5733 1.85776 15.3624 1.85714 15.1111C1.85652 14.8598 1.94567 14.6489 2.12457 14.4782C2.30348 14.3075 2.52386 14.2222 2.78571 14.2222C3.04757 14.2222 3.26826 14.3075 3.44779 14.4782C3.62731 14.6489 3.71614 14.8598 3.71429 15.1111C3.71243 15.3624 3.62329 15.5736 3.44686 15.7449C3.27043 15.9161 3.05005 16.0012 2.78571 16ZM6.5 16C6.23691 16 6.01652 15.9147 5.83886 15.744C5.66119 15.5733 5.57205 15.3624 5.57143 15.1111C5.57081 14.8598 5.65995 14.6489 5.83886 14.4782C6.01776 14.3075 6.23814 14.2222 6.5 14.2222C6.76186 14.2222 6.98255 14.3075 7.16207 14.4782C7.3416 14.6489 7.43043 14.8598 7.42857 15.1111C7.42671 15.3624 7.33757 15.5736 7.16114 15.7449C6.98471 15.9161 6.76433 16.0012 6.5 16ZM10.2143 16C9.95119 16 9.73081 15.9147 9.55314 15.744C9.37548 15.5733 9.28633 15.3624 9.28571 15.1111C9.2851 14.8598 9.37424 14.6489 9.55314 14.4782C9.73205 14.3075 9.95243 14.2222 10.2143 14.2222C10.4761 14.2222 10.6968 14.3075 10.8764 14.4782C11.0559 14.6489 11.1447 14.8598 11.1429 15.1111C11.141 15.3624 11.0519 15.5736 10.8754 15.7449C10.699 15.9161 10.4786 16.0012 10.2143 16Z"
                          fill="black"
                        />
                      </svg>
                      <p className={styles.featureValue}>
                        {(property.features.bathrooms || 0) +
                          (property.features.suites || 0) +
                          (property.features.restrooms || 0)}
                        {property.features.restrooms > 0 && (
                          <span>
                            ({property.features.restrooms} {property.features.restrooms > 1 ? 'lavabos' : 'lavabo'})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {property.features.parkingSpaces > -1 && (
                  <div className={styles.featureItem}>
                    <p>Vagas</p>
                    <div>
                      <svg
                        className={styles.featureIcon}
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.0111 0C11.4567 1.55878e-05 11.8935 0.127757 12.2726 0.368916C12.6517 0.610074 12.9581 0.955123 13.1574 1.36541L14.2638 3.64247C14.4589 3.56012 14.6533 3.47694 14.8421 3.38059C15.032 3.28296 15.2518 3.26698 15.4531 3.33617C15.6544 3.40536 15.8208 3.55405 15.9157 3.74953C16.0105 3.94501 16.026 4.17127 15.9588 4.37853C15.8916 4.58579 15.7472 4.75708 15.5573 4.85471C15.1621 5.05729 14.9813 5.11988 14.9813 5.11988L15.7461 6.69529C15.9133 7.03871 15.9997 7.41671 15.9997 7.80047V9.88235C15.9997 10.2299 15.9284 10.5736 15.7906 10.8909C15.6527 11.2082 15.4514 11.492 15.1997 11.7238V12.7647C15.1997 13.0923 15.0733 13.4065 14.8482 13.6382C14.6232 13.8699 14.318 14 13.9998 14C13.6815 14 13.3763 13.8699 13.1513 13.6382C12.9262 13.4065 12.7998 13.0923 12.7998 12.7647V12.3529H3.20029V12.7647C3.20029 13.0923 3.07387 13.4065 2.84884 13.6382C2.62381 13.8699 2.3186 14 2.00035 14C1.68211 14 1.3769 13.8699 1.15186 13.6382C0.926832 13.4065 0.80041 13.0923 0.80041 12.7647V11.7238C0.309234 11.2708 0.000449058 10.6136 0.000449058 9.88235V7.80047C0.000598554 7.41708 0.0874177 7.03899 0.254037 6.69612L1.0188 5.11988C0.824975 5.03732 0.633442 4.94917 0.444427 4.85553C0.350135 4.80737 0.266002 4.74053 0.196851 4.65883C0.1277 4.57714 0.0748895 4.48219 0.0414476 4.37945C0.00800567 4.2767 -0.00541053 4.16817 0.00196781 4.06008C0.00934614 3.95198 0.037374 3.84645 0.084445 3.74953C0.181221 3.55491 0.348541 3.40734 0.550201 3.33876C0.751861 3.27018 0.971643 3.28609 1.16199 3.38306C1.35078 3.47639 1.54224 3.56286 1.73636 3.64247L2.84271 1.36541C3.04205 0.955123 3.34842 0.610074 3.7275 0.368916C4.10657 0.127757 4.54339 1.55878e-05 4.98901 0H11.0111ZM13.467 5.68565C12.1071 6.12788 10.172 6.58824 8.00006 6.58824C5.82816 6.58824 3.89306 6.12706 2.53312 5.68565L1.68517 7.43153C1.62941 7.54605 1.60038 7.67238 1.60037 7.80047V9.88235C1.60037 10.1008 1.68465 10.3102 1.83467 10.4647C1.9847 10.6191 2.18817 10.7059 2.40033 10.7059H13.5998C13.8119 10.7059 14.0154 10.6191 14.1654 10.4647C14.3155 10.3102 14.3997 10.1008 14.3997 9.88235V7.80047C14.3996 7.67265 14.3706 7.54662 14.3149 7.43235L13.467 5.68565ZM4.40023 7.41176C4.71848 7.41176 5.02369 7.54191 5.24872 7.77357C5.47375 8.00524 5.60017 8.31944 5.60017 8.64706C5.60017 8.97468 5.47375 9.28888 5.24872 9.52054C5.02369 9.75221 4.71848 9.88235 4.40023 9.88235C4.08199 9.88235 3.77678 9.75221 3.55175 9.52054C3.32671 9.28888 3.20029 8.97468 3.20029 8.64706C3.20029 8.31944 3.32671 8.00524 3.55175 7.77357C3.77678 7.54191 4.08199 7.41176 4.40023 7.41176ZM11.5999 7.41176C11.9181 7.41176 12.2233 7.54191 12.4484 7.77357C12.6734 8.00524 12.7998 8.31944 12.7998 8.64706C12.7998 8.97468 12.6734 9.28888 12.4484 9.52054C12.2233 9.75221 11.9181 9.88235 11.5999 9.88235C11.2816 9.88235 10.9764 9.75221 10.7514 9.52054C10.5264 9.28888 10.3999 8.97468 10.3999 8.64706C10.3999 8.31944 10.5264 8.00524 10.7514 7.77357C10.9764 7.54191 11.2816 7.41176 11.5999 7.41176ZM11.0111 1.64706H4.98901C4.84048 1.64714 4.69491 1.68979 4.5686 1.77022C4.44229 1.85065 4.34023 1.9657 4.27384 2.10247L3.25789 4.19176C4.49623 4.57471 6.16495 4.94118 8.00006 4.94118C9.83517 4.94118 11.5039 4.57471 12.7414 4.19176L11.7263 2.10247C11.6599 1.9657 11.5578 1.85065 11.4315 1.77022C11.3052 1.68979 11.1596 1.64714 11.0111 1.64706Z"
                          fill="black"
                        />
                      </svg>
                      <p className={styles.featureValue}>
                        {property.features.parkingSpaces}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location Row */}
              <div className={styles.locationRow}>
                <svg
                  className={styles.locationIcon}
                  width="13"
                  height="17"
                  viewBox="0 0 13 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.5 16.499L7.131 15.7898C7.847 14.9726 8.49133 14.1949 9.064 13.4568L9.537 12.8344C11.5123 10.1805 12.5 8.07492 12.5 6.51758C12.5 3.1941 9.814 0.5 6.5 0.5C3.186 0.5 0.5 3.1941 0.5 6.51758C0.5 8.07492 1.48767 10.1809 3.463 12.8354L3.936 13.4578C4.75355 14.5024 5.60877 15.5162 6.5 16.499Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.5 8.97828C7.88071 8.97828 9 7.86185 9 6.48467C9 5.10749 7.88071 3.99106 6.5 3.99106C5.11929 3.99106 4 5.10749 4 6.48467C4 7.86185 5.11929 8.97828 6.5 8.97828Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
              <h1 className={styles.propertyTitle}>
                {formatTitleCase(property.title)}
              </h1>
              <p className={styles.propertyCode}>Cod. {property.code}</p>

              {/* Description */}
              {property.description && (
                <>
                  <h2 className={styles.sectionTitle}>Descrição</h2>
                  <p className={styles.description}>{property.description}</p>
                </>
              )}

              {/* Characteristics */}
              {property.characteristics.length > 0 && (
                <div className={styles.characteristicsSection}>
                  <h2 className={styles.sectionTitle}>Características</h2>
                  <div className={styles.characteristicsGrid}>
                    {property.characteristics.map((char, index) => (
                      <div key={index} className={styles.characteristicItem}>
                        <svg
                          className={styles.checkIcon}
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 23C13.4448 23.0018 14.8757 22.7181 16.2105 22.1651C17.5453 21.6122 18.7577 20.801 19.7781 19.7781C20.801 18.7577 21.6122 17.5453 22.1651 16.2105C22.7181 14.8757 23.0018 13.4448 23 12C23.0018 10.5552 22.7181 9.12429 22.1651 7.78947C21.6122 6.45466 20.801 5.24225 19.7781 4.22191C18.7577 3.199 17.5453 2.38778 16.2105 1.83486C14.8757 1.28194 13.4448 0.998227 12 1.00001C10.5552 0.998227 9.12429 1.28194 7.78947 1.83486C6.45466 2.38778 5.24225 3.199 4.22191 4.22191C3.199 5.24225 2.38778 6.45466 1.83486 7.78947C1.28194 9.12429 0.998227 10.5552 1.00001 12C0.998227 13.4448 1.28194 14.8757 1.83486 16.2105C2.38778 17.5453 3.199 18.7577 4.22191 19.7781C5.24225 20.801 6.45466 21.6122 7.78947 22.1651C9.12429 22.7181 10.5552 23.0018 12 23Z"
                            stroke="#EF8634"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.6001 11.9999L10.9001 15.2999L17.5001 8.69995"
                            stroke="#EF8634"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
            <ContactForm
              propertyCode={property.code}
              whatsappLink={whatsappLink}
            />
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
