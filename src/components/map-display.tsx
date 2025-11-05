
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { ViewState } from 'react-map-gl';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Map = dynamic(() => import('react-map-gl'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

const Marker = dynamic(() => import('react-map-gl').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-map-gl').then(mod => mod.Popup), { ssr: false });

import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

type MapMarker = {
  latitude: number;
  longitude: number;
  color: string;
  label: string;
};

type Props = {
  markers: MapMarker[];
};

export default function MapDisplay({ markers }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [popupInfo, setPopupInfo] = useState<MapMarker | null>(null);

  const initialViewState: Partial<ViewState> = {
    longitude: markers[0]?.longitude ?? -20,
    latitude: markers[0]?.latitude ?? 30,
    zoom: markers.length > 0 ? 4 : 1,
  };
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!mapboxToken) {
    return (
       <Alert variant="destructive" className="w-full h-full flex items-center justify-center">
        <div>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Map Error</AlertTitle>
          <AlertDescription>Mapbox token is not configured.</AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <Map
      initialViewState={initialViewState}
      style={{ width: '100%', height: '100%'}}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={mapboxToken}
      scrollZoom={false}
    >
      {markers.map((marker, index) => (
        <Marker key={`marker-${index}`} longitude={marker.longitude} latitude={marker.latitude}>
          <MapPin
            style={{ color: marker.color }}
            className="w-8 h-8 cursor-pointer transform -translate-x-1/2 -translate-y-full drop-shadow-lg"
            onMouseEnter={() => setPopupInfo(marker)}
            onMouseLeave={() => setPopupInfo(null)}
          />
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
          closeButton={false}
          offset={-40}
          anchor="bottom"
          className="font-body z-20 !bg-transparent !shadow-none"
        >
          <div className="bg-background/80 backdrop-blur-md text-foreground text-sm p-2 rounded-md border border-primary/20">{popupInfo.label}</div>
        </Popup>
      )}
    </Map>
  );
}
