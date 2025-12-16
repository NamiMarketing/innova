'use client';

export function PropertySkeleton() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 0',
      }}
    >
      {/* Header skeleton */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            height: '24px',
            width: '200px',
            background:
              'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        />
        <div
          style={{
            height: '20px',
            width: '150px',
            background:
              'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Property cards skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                height: '12rem',
                background:
                  'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
            <div style={{ padding: '1rem' }}>
              <div
                style={{
                  height: '1rem',
                  background:
                    'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '0.25rem',
                  marginBottom: '0.5rem',
                }}
              />
              <div
                style={{
                  height: '1rem',
                  width: '60%',
                  background:
                    'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '0.25rem',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
