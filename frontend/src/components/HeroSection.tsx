import { useState } from 'react';

interface Props {
  onTrack: (trackingNumber: string) => void;
}

export function HeroSection({ onTrack }: Props) {
  const [value, setValue] = useState('');

  const handleTrack = () => {
    const v = value.trim().toUpperCase();
    if (!v) return;
    onTrack(v);
    document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-copy">
        <div className="eyebrow">FAST • SAFE • RELIABLE</div>
        <h1>Your packages,<br /><strong>our priority.</strong></h1>
        <p>Track, manage and deliver shipments with confidence. GIT Logistics connects people and businesses across Nigeria.</p>
        <div className="track-box">
          <input
            id="heroTracking"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
            placeholder="Enter tracking number e.g. GIT240915000123"
          />
          <button className="btn btn-primary" onClick={handleTrack}>Track Package</button>
        </div>
        <div className="hero-points">
          <span>✓ Real-time shipment updates</span>
          <span>✓ Secure delivery</span>
          <span>✓ Business logistics</span>
        </div>
      </div>
      <div className="hero-art">
        <div className="road" />
        <div className="truck">🚚</div>
        <div className="floating-card">
          <span className="live-dot" />
          <div>
            <b>Shipment in transit</b>
            <small>Abuja → Wuse, Abuja</small>
          </div>
        </div>
      </div>
    </section>
  );
}
