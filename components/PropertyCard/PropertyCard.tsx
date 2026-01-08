'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/contexts/FavoritesContext';
import { generatePropertyUrl } from '@/utils/slug';
import styles from './PropertyCard.module.css';
import parking from '@/img/parking.svg';
import bathroom from '@/img/bathroom.svg';
import bedroom from '@/img/bedroom.svg';
import area from '@/img/area.svg';
import toilet from '@/img/toilet.png';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(property.id);
  const [showCopied, setShowCopied] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const propertyUrl = `${window.location.origin}${generatePropertyUrl(property)}`;
    const shareData = {
      title: property.title,
      text: `Confira este imóvel: ${property.title}`,
      url: propertyUrl,
    };

    // Tenta usar Web Share API (funciona bem em mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Usuário cancelou ou erro - ignora
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: copia o link para a área de transferência
      try {
        await navigator.clipboard.writeText(propertyUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    return type === 'sale' ? 'Venda' : 'Aluguel';
  };

  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg';
  const addressLineOne = property.address
    ? `${property.address.street || ''}, ${property.address.number || ''}`
        .replace(/^, |, - $/, '')
        .trim()
    : 'Endereco nao disponivel';
  const addressLineTwo = property.address
    ? `${property.address.neighborhood || ''} - ${property.address.city || ''}/${property.address.state || ''}`
        .replace(/^, |, - $/, '')
        .trim()
    : 'Endereco nao disponivel';

  return (
    <Link
      href={generatePropertyUrl(property)}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.card}>
        {/* Imagem */}
        <div className={styles.imageContainer}>
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badge de tipo */}
          <div className={styles.typeBadge}>{getTypeLabel(property.type)}</div>
        </div>

        {/* Conteudo */}
        <div className={styles.content}>
          {/* Header com código e favorito */}
          <div className={styles.contentHeader}>
            <div className={styles.codeBadge}>{property.code}</div>
            <div className={styles.actionButtons}>
              {/* Botão de compartilhar */}
              <button
                type="button"
                className={styles.shareButton}
                onClick={handleShareClick}
                aria-label="Compartilhar imóvel"
              >
                {showCopied && (
                  <span className={styles.copiedTooltip}>Link copiado!</span>
                )}
                <svg
                  width="14"
                  height="17"
                  viewBox="0 0 14 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.95 5.04329H10.5V4.00358H13.1259C13.6071 4.00358 14 4.39001 14 4.86654V16.137C13.9991 16.3656 13.907 16.5846 13.7437 16.7462C13.5805 16.9079 13.3594 16.9991 13.1285 17H0.8715C0.640647 16.9991 0.419513 16.9079 0.256275 16.7462C0.093036 16.5846 0.000921578 16.3656 0 16.137V4.86654C0.000925117 4.6375 0.0934004 4.41814 0.257205 4.25643C0.421011 4.09472 0.642817 4.00381 0.874125 4.00358H3.5V5.04329H1.05V15.9603H12.95V5.04329ZM7.525 1.6313V9.63536H6.475V1.6313L4.64887 3.43953L3.906 2.70394L6.38138 0.253678C6.54546 0.0912481 6.76798 0 7 0C7.23202 0 7.45454 0.0912481 7.61862 0.253678L10.094 2.70394L9.35113 3.43953L7.525 1.6313Z"
                    fill="black"
                  />
                </svg>
              </button>
              {/* Botão de favorito */}
              <button
                type="button"
                className={`${styles.favoriteButton} ${isFav ? styles.favoriteButtonActive : ''}`}
                onClick={handleFavoriteClick}
                aria-label={
                  isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
                }
              >
                <svg
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2.69391L9.49767 3.16624C9.56276 3.23217 9.64078 3.28461 9.72709 3.32043C9.8134 3.35625 9.90622 3.37472 10 3.37472C10.0938 3.37472 10.1866 3.35625 10.2729 3.32043C10.3592 3.28461 10.4372 3.23217 10.5023 3.16624L10 2.69391ZM5.34977 12.6128C5.20667 12.4979 5.02269 12.4432 4.8383 12.4607C4.6539 12.4783 4.48419 12.5666 4.36651 12.7064C4.24883 12.8461 4.19281 13.0257 4.21078 13.2058C4.22875 13.3858 4.31923 13.5515 4.46233 13.6665L5.34977 12.6128ZM1.01581 9.87965C1.05979 9.95814 1.11917 10.0274 1.19056 10.0835C1.26195 10.1396 1.34396 10.1814 1.43189 10.2065C1.51983 10.2316 1.61197 10.2396 1.70306 10.23C1.79415 10.2203 1.88241 10.1933 1.96279 10.1503C2.04317 10.1074 2.1141 10.0494 2.17154 9.9797C2.22897 9.90999 2.27178 9.82992 2.29752 9.74406C2.32326 9.65819 2.33143 9.56822 2.32156 9.47927C2.31169 9.39033 2.28398 9.30415 2.24 9.22566L1.01581 9.87965ZM1.39535 5.99748C1.39535 4.04459 2.52558 2.40597 4.06884 1.71655C5.56837 1.04712 7.58326 1.22424 9.49767 3.16624L10.5023 2.22249C8.23256 -0.0819248 5.59442 -0.462512 3.48837 0.477602C1.42884 1.39773 0 3.53411 0 5.99748H1.39535ZM6.7414 15.4104C7.2186 15.7774 7.73023 16.168 8.24837 16.4641C8.76651 16.7602 9.35814 17 10 17V15.6375C9.71163 15.6375 9.37302 15.5285 8.95256 15.2878C8.53116 15.048 8.09488 14.7174 7.60558 14.3404L6.7414 15.4104ZM13.2586 15.4104C14.5851 14.3886 16.2819 13.2186 17.6121 11.7553C18.9674 10.2657 20 8.41907 20 5.99748H18.6047C18.6047 7.99398 17.7674 9.53177 16.5693 10.8507C15.346 12.195 13.8047 13.255 12.3944 14.3404L13.2586 15.4104ZM20 5.99748C20 3.53411 18.5721 1.39773 16.5116 0.477602C14.4056 -0.462512 11.7693 -0.0819248 9.49767 2.22158L10.5023 3.16624C12.4167 1.22515 14.4316 1.04712 15.9312 1.71655C17.4744 2.40597 18.6047 4.04368 18.6047 5.99748H20ZM12.3944 14.3404C11.9051 14.7174 11.4688 15.048 11.0474 15.2878C10.626 15.5276 10.2884 15.6375 10 15.6375V17C10.6419 17 11.2335 16.7593 11.7516 16.4641C12.2707 16.168 12.7814 15.7774 13.2586 15.4104L12.3944 14.3404ZM7.60558 14.3404C6.86512 13.7709 6.11256 13.2259 5.34977 12.6128L4.46233 13.6665C5.23442 14.2868 6.05116 14.8791 6.7414 15.4104L7.60558 14.3404ZM2.24 9.22657C1.67956 8.23873 1.38869 7.12676 1.39535 5.99748H0C0 7.48531 0.390698 8.76333 1.01581 9.87965L2.24 9.22657Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* <div className={styles.category}>
            {getCategoryLabel(property.category)}
          </div> */}

          {/* Titulo */}
          <h3 className={styles.title}>{property.title}</h3>

          {/* Endereco */}
          <p className={styles.address}>
            <span className={styles.addressText}>{addressLineOne}</span>
            <span className={styles.addressText}>{addressLineTwo}</span>
          </p>

          {/* Caracteristicas */}
          <div className={styles.features}>
            {(property.features.bedrooms || 0) +
              (property.features.suites || 0) >
              0 && (
              <div className={styles.feature}>
                <Image
                  src={bedroom}
                  alt="icone de quarto"
                  width={15}
                  height={12}
                />
                <span className={styles.featureValue}>
                  {(property.features.bedrooms || 0) +
                    (property.features.suites || 0)}
                </span>
              </div>
            )}
            {(property.features.bathrooms || 0) +
              (property.features.suites || 0) >
              0 && (
              <div className={styles.feature}>
                <Image
                  src={bathroom}
                  alt="icone de banheiro"
                  width={12}
                  height={15}
                />
                <span className={styles.featureValue}>
                  {(property.features.bathrooms || 0) +
                    (property.features.suites || 0)}
                </span>
              </div>
            )}
            {property.features.totalBaths > 0 && (
              <div className={styles.feature}>
                <Image
                  src={toilet}
                  alt="icone de banheiro"
                  width={12}
                  height={12}
                />
                <span className={styles.featureValue}>
                  {property.features.totalBaths}
                </span>
              </div>
            )}
            {property.features.parkingSpaces > 0 && (
              <div className={styles.feature}>
                <Image
                  src={parking}
                  alt="icone de carro"
                  width={12}
                  height={12}
                />
                <span className={styles.featureValue}>
                  {property.features.parkingSpaces}
                </span>
              </div>
            )}
            {property.features.area > 0 && (
              <div className={styles.feature}>
                <Image src={area} alt="icone de area" width={12} height={12} />
                <span className={styles.featureValue}>
                  {property.features.area}m2
                </span>
              </div>
            )}
          </div>

          {/* Preco */}
          <div className={styles.priceContainer}>
            <div className={styles.leftPrice}>
              <div className={styles.price}>{formatPrice(property.price)}</div>
              {property.type === 'rent' &&
                (property.condoFee ||
                  property.iptu ||
                  property.fci ||
                  property.fireInsurance) && (
                  <div className={styles.extraCosts}>
                    {property.condoFee && (
                      <div className={styles.extraCost}>
                        <span className={styles.extraCostPlus}>+</span>
                        <span>Cond: {formatPrice(property.condoFee)}/mês</span>
                      </div>
                    )}
                    {property.iptu && (
                      <div className={styles.extraCost}>
                        <span className={styles.extraCostPlus}>+</span>
                        <span>IPTU: {formatPrice(property.iptu)}/mês</span>
                      </div>
                    )}
                    {property.fci && (
                      <div className={styles.extraCost}>
                        <span className={styles.extraCostPlus}>+</span>
                        <span>FCI: {formatPrice(property.fci)}/mês</span>
                      </div>
                    )}
                    {property.fireInsurance && (
                      <div className={styles.extraCost}>
                        <span className={styles.extraCostPlus}>+</span>
                        <span>
                          Seguro: {formatPrice(property.fireInsurance)}/mês
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>
            <button className={styles.rightPrice}>Contatar</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
