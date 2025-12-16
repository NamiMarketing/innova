'use client';

import { PropertyFilters as PropertyFiltersComponent } from '@/components/PropertyFilters';
import { PropertySkeleton } from './PropertySkeleton';
import { PropertyFilters } from '@/types/property';

interface LoadingStateProps {
  initialFilters: PropertyFilters;
}

export function LoadingState({ initialFilters }: LoadingStateProps) {
  return (
    <>
      <PropertyFiltersComponent
        initialFilters={initialFilters}
        onFiltersChange={() => {}}
        onReset={() => {}}
        loading={true}
      />
      <PropertySkeleton />
    </>
  );
}
