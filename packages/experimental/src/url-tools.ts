/**
 * Check if the Current Url is same as New Url
 * @param currentUrl {string}
 * @param newUrl {string}
 * @returns {boolean}
 */
export function checkIsAnchorOfCurrentUrl(currentUrl: string, newUrl: string): boolean {
  const currentUrlObj = new URL(currentUrl);
  const newUrlObj = new URL(newUrl);
  // Compare hostname, pathname, and search parameters
  if (
    currentUrlObj.hostname === newUrlObj.hostname &&
    currentUrlObj.pathname === newUrlObj.pathname &&
    currentUrlObj.search === newUrlObj.search
  ) {
    // Check if the new URL is just an anchor of the current URL page
    const currentHash = currentUrlObj.hash;
    const newHash = newUrlObj.hash;
    return (
      currentHash !== newHash &&
      currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
    );
  }
  return false;
}

/**
 * Convert the url to Absolute URL based on the current window location.
 * @param url {string}
 * @returns {string}
 */
export const toAbsoluteURL = (url: string): string => {
  return new URL(url, window.location.href).href;
};

/**
 * Check if it is hash anchor or same page anchor
 * @param currentUrl {string} Current Url Location
 * @param newUrl {string} New Url detected with each anchor
 * @returns {boolean}
 */
export const checkIsHashAnchor = (currentUrl: string, newUrl: string): boolean => {
  const current = new URL(toAbsoluteURL(currentUrl));
  const next = new URL(toAbsoluteURL(newUrl));
  return current.href.split('#')[0] === next.href.split('#')[0];
};

/**
 * Check if it is Same Host name
 * @param currentUrl {string} Current Url Location
 * @param newUrl {string} New Url detected with each anchor
 * @returns {boolean}
 */
export const checkIsSameHostName = (currentUrl: string, newUrl: string): boolean => {
  const current = new URL(toAbsoluteURL(currentUrl));
  const next = new URL(toAbsoluteURL(newUrl));
  return current.hostname.replace(/^www\./, '') === next.hostname.replace(/^www\./, '');
};

export const specialProtocols = ['tel', 'mailto', 'sms', 'blob', 'download'];
export const specialSchemes = specialProtocols.map((proto) => `${proto}:`);

export function checkIsSpecialScheme(url: string) {
  return specialSchemes.some((scheme) => url.startsWith(scheme));
}
