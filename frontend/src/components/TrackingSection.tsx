import { useState, useEffect } from 'react';
import { useShipmentStore } from '../store/useShipmentStore';
import { TrackingResult } from './TrackingResult';

interface Props {
  initialTracking?: string;
}

export function TrackingSection({ initialTracking }: Props) {
  const { track, trackedShipment, trackLoading } = useShipmentStore();
  const initial = initialTracking?.trim().toUpperCase() ?? '';
  const [input, setInput] = useState(initial);
  const [searched, setSearched] = useState<string | null>(initial || null);

  useEffect(() => {
    if (!initial) return;
    void track(initial);
  }, [initial, track]);

  const handleTrack = async (val?: string) => {
    const v = (val ?? input).trim().toUpperCase();
    if (!v) return;
    setInput(v);
    setSearched(v);
    await track(v);
  };

  const notFound = !trackLoading && searched !== null && trackedShipment === null;

  return (
    <section id="track" className="section">
      <div className="section-head center">
        <div className="eyebrow">SHIPMENT TRACKING</div>
        <h2>Where is your package?</h2>
        <p>Enter a tracking number to see the latest shipment status and movement history.</p>
      </div>
      <div className="public-track">
        <input
          id="trackInput"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && void handleTrack()}
          placeholder="GIT240915000123"
          aria-label="Tracking number"
        />
        <button className="btn btn-primary" onClick={() => void handleTrack()}>Track Shipment</button>
      </div>
      <div id="trackingResult">
        <TrackingResult
          shipment={trackedShipment}
          loading={trackLoading}
          notFound={notFound}
          trackedId={searched ?? undefined}
        />
      </div>
    </section>
  );
}
