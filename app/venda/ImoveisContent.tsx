'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Property,
  PropertyFilters,
  PropertyResponse,
  PropertyType,
} from '@/types/property';
import { PropertyFilters as PropertyFiltersComponent } from '@/components/PropertyFilters';
import { PropertyResults } from '@/components/PropertyResults';

interface ImoveisContentProps {
  initialData: PropertyResponse;
  initialFilters?: PropertyFilters;
  filterOptions: {
    cities: string[];
    neighborhoodsByCity: Record<string, string[]>;
    types: Array<{ value: string; text: string }>;
  };
  lockedType?: PropertyType;
  basePath?: string;
}

export function ImoveisContent({
  initialData,
  initialFilters = {},
  filterOptions,
  lockedType,
  basePath = '/imoveis',
}: ImoveisContentProps) {
  const router = useRouter();
  const [appliedFilters, setAppliedFilters] =
    useState<PropertyFilters>(initialFilters);
  const [properties, setProperties] = useState<Property[]>(
    initialData.data || []
  );
  const [total, setTotal] = useState(initialData.total ?? 0);
  const [currentPage, setCurrentPage] = useState(initialData.page ?? 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages ?? 1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchProperties = useCallback(
    async (newFilters: PropertyFilters, page = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams();
        // Always use locked type if provided
        const effectiveType = lockedType || newFilters.type;
        if (effectiveType) params.set('type', effectiveType);
        if (newFilters.chrTypes) params.set('chrTypes', newFilters.chrTypes);
        if (newFilters.city) params.set('city', newFilters.city);
        if (newFilters.neighborhood)
          params.set('neighborhood', newFilters.neighborhood);
        if (newFilters.minPrice)
          params.set('minPrice', newFilters.minPrice.toString());
        if (newFilters.maxPrice)
          params.set('maxPrice', newFilters.maxPrice.toString());
        if (newFilters.minBedrooms)
          params.set('minBedrooms', newFilters.minBedrooms.toString());
        if (newFilters.minBathrooms)
          params.set('minBathrooms', newFilters.minBathrooms.toString());
        if (newFilters.minSuites)
          params.set('minSuites', newFilters.minSuites.toString());
        if (newFilters.minParkingSpaces)
          params.set(
            'minParkingSpaces',
            newFilters.minParkingSpaces.toString()
          );
        if (newFilters.code) params.set('code', newFilters.code);
        if (newFilters.amenities && newFilters.amenities.length > 0) {
          params.set('amenities', newFilters.amenities.join(','));
        }
        if (newFilters.minArea)
          params.set('minArea', newFilters.minArea.toString());
        if (newFilters.maxArea)
          params.set('maxArea', newFilters.maxArea.toString());
        params.set('page', page.toString());

        const response = await fetch(`/api/properties?${params.toString()}`);
        const data: PropertyResponse = await response.json();

        if (append) {
          setProperties((prev) => [...prev, ...(data.data || [])]);
        } else {
          setProperties(data.data || []);
        }

        setTotal(data.total ?? 0);
        setCurrentPage(data.page ?? page);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [lockedType]
  );

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    // Ensure locked type is always applied
    const filtersWithLockedType = lockedType
      ? { ...newFilters, type: lockedType }
      : newFilters;

    // Update applied filters immediately for UI responsiveness
    setAppliedFilters(filtersWithLockedType);

    // Update URL with new filters (excluding locked type from URL since it's implicit)
    const params = new URLSearchParams();
    // Don't include type in URL if it's locked (the path already defines it)
    if (!lockedType && filtersWithLockedType.type)
      params.set('type', filtersWithLockedType.type);
    if (filtersWithLockedType.chrTypes)
      params.set('chrTypes', filtersWithLockedType.chrTypes);
    if (filtersWithLockedType.city)
      params.set('city', filtersWithLockedType.city);
    if (filtersWithLockedType.neighborhood)
      params.set('neighborhood', filtersWithLockedType.neighborhood);
    if (filtersWithLockedType.minPrice)
      params.set('minPrice', filtersWithLockedType.minPrice.toString());
    if (filtersWithLockedType.maxPrice)
      params.set('maxPrice', filtersWithLockedType.maxPrice.toString());
    if (filtersWithLockedType.minBedrooms)
      params.set('minBedrooms', filtersWithLockedType.minBedrooms.toString());
    if (filtersWithLockedType.minBathrooms)
      params.set('minBathrooms', filtersWithLockedType.minBathrooms.toString());
    if (filtersWithLockedType.minSuites)
      params.set('minSuites', filtersWithLockedType.minSuites.toString());
    if (filtersWithLockedType.minParkingSpaces)
      params.set(
        'minParkingSpaces',
        filtersWithLockedType.minParkingSpaces.toString()
      );
    if (filtersWithLockedType.code)
      params.set('code', filtersWithLockedType.code);
    if (
      filtersWithLockedType.amenities &&
      filtersWithLockedType.amenities.length > 0
    ) {
      params.set('amenities', filtersWithLockedType.amenities.join(','));
    }
    if (filtersWithLockedType.minArea)
      params.set('minArea', filtersWithLockedType.minArea.toString());
    if (filtersWithLockedType.maxArea)
      params.set('maxArea', filtersWithLockedType.maxArea.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `${basePath}?${queryString}` : basePath;
    router.push(newUrl, { scroll: false });

    setCurrentPage(1);
    fetchProperties(filtersWithLockedType, 1, false);
  };

  const handleReset = () => {
    // Keep locked type when resetting
    const resetFilters: PropertyFilters = lockedType
      ? { type: lockedType }
      : {};
    setAppliedFilters(resetFilters);
    router.push(basePath, { scroll: false });
    setCurrentPage(1);
    fetchProperties(resetFilters, 1, false);
  };

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages && !loadingMore) {
      fetchProperties(appliedFilters, currentPage + 1, true);
    }
  }, [currentPage, totalPages, loadingMore, appliedFilters, fetchProperties]);

  const hasMore = currentPage < totalPages;

  return (
    <>
      <PropertyFiltersComponent
        initialFilters={appliedFilters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
        loading={loading}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
        filterOptions={filterOptions}
        lockedType={lockedType}
      />
      <PropertyResults
        properties={properties}
        appliedFilters={appliedFilters}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onReset={handleReset}
        total={total}
        onOpenFilters={() => setMobileFiltersOpen(true)}
      />
    </>
  );
}
