import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';

/**
 * Opens Google Maps directions to the shuttle parking location. A plain
 * external link: on mobile it hands over to the Maps app, on desktop it opens
 * Google Maps in a new tab.
 */
export function RouteButton({
  variant = 'outline',
  className,
}: {
  variant?: 'primary' | 'outline' | 'secondary';
  className?: string;
}) {
  return (
    <Button
      href={siteConfig.shuttleParking.mapsUrl}
      variant={variant}
      className={className}
      aria-label={`Route naar parkeerlocatie, ${siteConfig.shuttleParking.display} (opent Google Maps)`}
    >
      <MapPin className="size-4 shrink-0" aria-hidden />
      Route naar parkeerlocatie
    </Button>
  );
}
