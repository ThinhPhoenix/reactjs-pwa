export const usePlatform = () => {
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isPwa =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://');
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const getPlatform = (): 'desktop' | 'ios' | 'android' => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    }
    if (/android/.test(userAgent)) {
      return 'android';
    }
    return 'desktop';
  };

  const platform = getPlatform();

  return {
    platform,
    isTouchDevice,
    isPwa,
    screenWidth,
    screenHeight,
  };
};
