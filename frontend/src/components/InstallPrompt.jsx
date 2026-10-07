import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DISMISS_KEY = 'vf_install_dismissed_at';
const SNOOZE_DAYS = 14;      // after "Not now", don't ask again for two weeks
const SHOW_AFTER_MS = 12000; // let the visitor look around first

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIos() {
  const ua = window.navigator.userAgent;
  const iPadOs = window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/i.test(ua) || iPadOs;
}

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at && Date.now() - at < SNOOZE_DAYS * 86400000;
  } catch {
    return false;
  }
}

/**
 * Small banner inviting phone visitors to add the shop to their home screen.
 * - Android / Chrome: shows an Install button (uses the browser's own install prompt).
 * - iPhone / iPad: iOS has no install button, so it shows the two-step "Share -> Add to Home Screen" hint.
 * Never shown on desktop, inside the installed app, on checkout/admin pages, or for 2 weeks after "Not now".
 */
export default function InstallPrompt() {
  const { pathname } = useLocation();
  const [installEvent, setInstallEvent] = useState(null);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ios = typeof window !== 'undefined' && isIos();

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return undefined;
    if (!window.matchMedia('(max-width: 820px)').matches) return undefined; // phones/small tablets only

    function onBeforeInstall(e) {
      e.preventDefault(); // keep the event so we can show our own, nicer prompt
      setInstallEvent(e);
    }
    function onInstalled() {
      setHidden(true);
      setInstallEvent(null);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    const timer = setTimeout(() => setReady(true), SHOW_AFTER_MS);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      clearTimeout(timer);
    };
  }, []);

  const onSensitivePage = pathname.startsWith('/admin') || pathname.startsWith('/checkout');
  const canShow = installEvent || ios;
  if (hidden || !ready || !canShow || onSensitivePage) return null;

  function dismiss() {
    setHidden(true);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* private mode: just hide for now */ }
  }

  async function install() {
    if (!installEvent) return;
    installEvent.prompt();
    try {
      const choice = await installEvent.userChoice;
      if (choice.outcome !== 'accepted') dismiss(); else setHidden(true);
    } catch {
      dismiss();
    }
    setInstallEvent(null);
  }

  return (
    <div className="install-banner" role="dialog" aria-label="Install the Vedik Farms app">
      <img src="/icons/icon-192.png" alt="" className="install-banner-icon" width="44" height="44" />
      <div className="install-banner-text">
        <strong>Add Vedik Farms to your home screen</strong>
        {installEvent ? (
          <span>Order faster, like an app - no download from a store.</span>
        ) : (
          <span>Tap <b>Share</b> <span aria-hidden="true">&#x2B06;&#xFE0E;</span> then <b>Add to Home Screen</b>.</span>
        )}
      </div>
      <div className="install-banner-actions">
        {installEvent && <button type="button" className="btn btn-primary install-banner-btn" onClick={install}>Install</button>}
        <button type="button" className="install-banner-close" onClick={dismiss} aria-label="Not now">{installEvent ? 'Not now' : 'Got it'}</button>
      </div>
    </div>
  );
}
