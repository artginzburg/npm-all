'use client';

import {
  checkIsAnchorOfCurrentUrl,
  checkIsHashAnchor,
  checkIsSameHostName,
  checkIsSpecialScheme,
  toAbsoluteURL,
} from '@artginzburg/experimental/url-tools';
import { useEventListener } from 'ahooks';
import { useEffect } from 'react';

export function LinkBusy() {
  const ariaBusyAttribute = createAttributeController('aria-busy', booleanString);
  /** allows to differentiate between links that have custom aria-busy logic applied locally, and links touched by this script. */
  const markerAttribute = createAttributeController('data-nextjs-link-busy', booleanString);

  function handleNavigationStart(anchor: HTMLAnchorElement) {
    ariaBusyAttribute.set(anchor, true);
    markerAttribute.set(anchor, true);
  }

  function handleNavigationEnd() {
    const busyLinks = document.querySelectorAll(
      `a${ariaBusyAttribute.toString(true)}${markerAttribute.toString(true)}`,
    );
    busyLinks.forEach((link) => {
      ariaBusyAttribute.remove(link);
      markerAttribute.remove(link);
    });
  }

  useEffect(
    () =>
      registerEffects(
        overrideHistoryMethod('pushState', handleNavigationEnd),
        overrideHistoryMethod('replaceState', handleNavigationEnd),
        createWindowEventListener('popstate', handleNavigationEnd, {
          passive: true,
        }),
      ),
    [],
  );

  useEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    const newUrl = anchor?.href;
    if (!newUrl) return;

    const currentUrl = window.location.href;

    const sameHost = checkIsSameHostName(currentUrl, newUrl);
    if (!sameHost) return;

    const currentAriaBusy = ariaBusyAttribute.get(anchor);
    if (currentAriaBusy) return;

    const isIdenticalUrl = newUrl === currentUrl;
    const isExternalLink = anchor.target === '_blank';

    if (
      isIdenticalUrl ||
      checkIsAnchorOfCurrentUrl(currentUrl, newUrl) ||
      isExternalLink ||
      checkIsSpecialScheme(newUrl) ||
      checkModifierKeys(event) ||
      checkIsHashAnchor(currentUrl, newUrl) ||
      !toAbsoluteURL(newUrl).startsWith('http')
    ) {
      handleNavigationEnd();
    } else {
      handleNavigationStart(anchor);
    }
  });

  return null;
}

function checkModifierKeys(event: MouseEvent) {
  return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}

function createAttributeController<QN extends string, Processor extends (value: never) => string>(
  qualifiedName: QN,
  processor: Processor,
) {
  return {
    toString(value?: Parameters<Processor>[0]) {
      return `[${qualifiedName}${value === undefined ? '' : `="${processor(value)}"`}]` as const;
    },
    get(element: Element) {
      return element.getAttribute(qualifiedName);
    },
    set(element: Element, value: Parameters<Processor>[0]) {
      element.setAttribute(qualifiedName, processor(value));
    },
    remove(element: Element) {
      element.removeAttribute(qualifiedName);
    },
  };
}
function registerEffects<Cleanups extends VoidFunction[]>(
  ...cleanups: AtLeastOneTupleElement<Cleanups>
) {
  return () => {
    cleanups.forEach((cleanup) => {
      cleanup();
    });
  };
}
function overrideHistoryMethod(
  methodName: keyof Pick<History, 'pushState' | 'replaceState'>,
  handler: History['pushState'] | History['replaceState'],
) {
  const originalMethod = history[methodName];
  history[methodName] = function (...args) {
    handler(...args);
    originalMethod.apply(history, args);
  };

  return function cleanup() {
    history[methodName] = originalMethod;
  };
}
function createWindowEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
) {
  window.addEventListener(type, listener, options);
  return function removeEventListener() {
    window.removeEventListener(type, listener);
  };
}
function booleanString<B extends boolean>(bool: B) {
  return String(bool) as B extends true ? 'true' : 'false';
}

type AtLeastOneTupleElement<Tuple extends unknown[]> = Tuple extends [] ? never : Tuple;
