import { Capacitor } from '@capacitor/core';

/**
 * Prevents the status/navigation bar space being added twice on Android.
 *
 * On newer Android WebViews the app draws behind the system bars and Ionic pads the header and
 * tab bar by the bar heights (correct). On older WebViews Capacitor instead pads the WebView
 * itself, yet the page can still report the bar heights as safe-area insets, leaving blank
 * strips above the header and below the tab bar. When the WebView is visibly shorter than the
 * screen, the bars are already outside the page, so the page's own insets are switched off.
 */
export function watchNativeInsets(): void {
  if (Capacitor.getPlatform() !== 'android') return;
  const check = (): void => {
    // A focused input means the keyboard may be open, which also shortens the page.
    const typing = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;
    if (typing || !window.innerHeight) return;
    const pageIsInset = screen.height - window.innerHeight > 10;
    document.documentElement.classList.toggle('native-insets', pageIsInset);
  };
  check();
  window.addEventListener('resize', check);
}
