'use client';

import { useSyncExternalStore } from 'react';

/** Never fires: whether we are on the client cannot change after mount. */
const subscribe = () => () => {};

/**
 * True once running on the client, false during SSR and the hydration pass.
 *
 * Used to gate createPortal, which needs a real `document`. Written with
 * useSyncExternalStore rather than the usual useState + useEffect pair so it
 * does not set state inside an effect — that triggers a second render on every
 * mount, and the React Compiler lint rules reject it.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
