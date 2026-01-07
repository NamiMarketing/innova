'use client';

import { PropertyFilters as PropertyFiltersComponent } from '@/components/PropertyFilters';
import { PropertySkeleton } from './PropertySkeleton';
import { PropertyFilters, PropertyType } from '@/types/property';

interface LoadingStateProps {
  initialFilters: PropertyFilters;
  filterOptions: {
    cities: string[];
    neighborhoodsByCity: Record<string, string[]>;
    types: Array<{ value: string; text: string }>;
  };
  lockedType?: PropertyType;
  basePath?: string;
}

export function LoadingState({
  initialFilters,
  filterOptions,
  lockedType,
}: LoadingStateProps) {
  return (
    <>
      <PropertyFiltersComponent
        initialFilters={initialFilters}
        onFiltersChange={() => {}}
        onReset={() => {}}
        loading={true}
        filterOptions={filterOptions}
        lockedType={lockedType}
      />
      <PropertySkeleton />
    </>
  );
}
