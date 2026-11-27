import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.tsx';
import { AdConfig } from '../../types/calculator.ts';

type SlotKey = keyof AdConfig['slots'];

interface AdSlotProps {
  slotKey: SlotKey;
  label: string;
  sizeHint: string;
  minHeightClass: string;
  className?: string;
}

export function AdSlot({
  slotKey,
  label,
  sizeHint,
  minHeightClass,
  className = '',
}: AdSlotProps) {
  const { adConfig, ui, l } = useAppContext();
  const insRef = useRef<HTMLModElement | null>(null);

  const unitId = adConfig.slots[slotKey];
  const hasLiveAdSense = Boolean(adConfig.enabled && adConfig.publisherId && unitId);

  useEffect(() => {
    if (!hasLiveAdSense) return;
    const pubId = adConfig.publisherId.trim();
    if (!pubId) return;

    const scriptId = 'calcaxis-adsense-script';
    const hasExistingScript =
      document.getElementById(scriptId) ||
      document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    if (!hasExistingScript) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(pubId)}`;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }

    try {
      const win = window as unknown as { adsbygoogle?: unknown[] };
      win.adsbygoogle = win.adsbygoogle || [];
      win.adsbygoogle.push({});
    } catch {
      // AdSense script blocked or pending
    }
  }, [hasLiveAdSense, adConfig.publisherId, unitId]);

  if (!adConfig.enabled) return null;

  if (hasLiveAdSense) {
    return (
      <div
        className={`ad-slot-container w-full overflow-hidden ${minHeightClass} ${className}`}
        aria-label={`${ui.ads.slotPrefix}: ${label}`}
      >
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={adConfig.publisherId}
          data-ad-slot={unitId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (!adConfig.showSlotPlaceholders) return null;

  return (
    <aside
      aria-label={`${ui.ads.slotPrefix}: ${label}`}
      className={`ad-slot-container w-full rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-start ${minHeightClass} ${className}`}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#64748B]">
          {ui.ads.slotPrefix} · {label} ({sizeHint})
        </p>
        <p className="text-[11px] text-[#94A3B8]">{ui.ads.reservedHint}</p>
      </div>
      <Link
        to={l('/admin/')}
        className="text-xs font-medium text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
      >
        {ui.ads.configureUnit}
      </Link>
    </aside>
  );
}
