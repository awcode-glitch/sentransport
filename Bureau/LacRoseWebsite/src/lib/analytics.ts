declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const analyticsEnabled = typeof import.meta.env.VITE_GA_ID === 'string' && import.meta.env.VITE_GA_ID.length > 0;

export function initAnalytics() {
  if (!analyticsEnabled || typeof window === 'undefined') return;
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;
    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_GA_ID);
  }
}

export function logEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (analyticsEnabled && window.gtag) {
    window.gtag('event', eventName, params);
  }
  console.debug('Analytics event:', eventName, params);
}
