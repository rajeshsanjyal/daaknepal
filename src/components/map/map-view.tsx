"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const LocationMap = dynamic(() => import("@/components/map/location-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />,
});

export function MapView({
  className,
  ...props
}: {
  lat: number;
  lng: number;
  interactive?: boolean;
  recenterToken?: number;
  onMove?: (lat: number, lng: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("isolate overflow-hidden bg-slate-200", className)}>
      <LocationMap {...props} />
    </div>
  );
}
