import { useState, useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { HeroSection } from './components/HeroSection';
import { TrackingSection } from './components/TrackingSection';
import { Dashboard } from './components/Dashboard';
import { useAuthStore } from './store/useAuthStore';
import { useShipmentStore } from './store/useShipmentStore';

export default function App() {
  const [trackTarget, setTrackTarget] = useState<string | undefined>(undefined);
  const hydrate = useAuthStore((s) => s.hydrate);
  const track = useShipmentStore((s) => s.track);

  useEffect(() => {
    void hydrate();
    void track('GIT240915000123');
  }, [hydrate, track]);

  const handleTrackRequest = (trackingNumber: string) => {
    setTrackTarget(trackingNumber);
    document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Topbar />
      <main>
        <HeroSection onTrack={handleTrackRequest} />

        <TrackingSection key={trackTarget ?? 'public'} initialTracking={trackTarget} />

        <section id="services" className="section soft">
          <div className="section-head">
            <div>
              <div className="eyebrow">WHAT WE DO</div>
              <h2>Logistics built for people and business</h2>
            </div>
          </div>
          <div className="service-grid">
            {[
              { icon: '📦', title: 'E-commerce Delivery', desc: 'Reliable pickup and delivery for online stores and marketplace sellers.' },
              { icon: '⚡', title: 'Same-Day Delivery', desc: 'Fast city delivery for urgent packages within supported locations.' },
              { icon: '🏢', title: 'Business Logistics', desc: 'Scheduled pickups, bulk shipments and business delivery operations.' },
              { icon: '↩️', title: 'Reverse Logistics', desc: 'Simple returns and package movement back to merchants.' },
            ].map(s => (
              <article key={s.title} className="service">
                <div className="icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <Dashboard onViewShipment={handleTrackRequest} />
      </main>

      <footer>
        <div className="brand">
          <span className="brand-mark">G</span>
          <span>GIT<span>Logistics</span></span>
        </div>
        <p>Fast • Safe • Reliable delivery.</p>
        <small>© 2026 GIT Logistics MVP</small>
      </footer>
    </>
  );
}
