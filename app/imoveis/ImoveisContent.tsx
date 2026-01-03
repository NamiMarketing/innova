'use client';

import { useState, useCallback } from 'react';
import { Property, PropertyFilters, PropertyResponse } from '@/types/property';
import { PropertyFilters as PropertyFiltersComponent } from '@/components/PropertyFilters';
import { PropertyResults } from '@/components/PropertyResults';

interface ImoveisContentProps {
  initialData: PropertyResponse;
  initialFilters?: PropertyFilters;
  filterOptions: {
    cities: string[];
    neighborhoodsByCity: Record<string, string[]>;
    types: string[];
  };
}

export function ImoveisContent({
  initialData,
  initialFilters = {},
  filterOptions,
}: ImoveisContentProps) {
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
        if (newFilters.type) params.set('type', newFilters.type);
        if (newFilters.category) params.set('category', newFilters.category);
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
        setAppliedFilters(newFilters);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setCurrentPage(1);
    fetchProperties(newFilters, 1, false);
  };

  const handleReset = () => {
    const resetFilters: PropertyFilters = {};
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
        initialFilters={initialFilters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
        loading={loading}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
        filterOptions={filterOptions}
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
