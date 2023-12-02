// import { logger } from './core.js';
import { browserRouteChangeSignal } from './signal.js';

let _enabled = false;

/**
 * A navigation trigger for Godgiven Router that translates popstate events into navigation signal.
 */
export const popstateTrigger = {
  /**
   * Godgiven router global popstate handler.
   */
  _popstateHandler(event: PopStateEvent): void
  {
    if (event.state === 'godgiven-router-ignore')
    {
      return;
    }
    // if none of the above, convert the click into a navigation signal.
    const { pathname, search, hash } = window.location;
    browserRouteChangeSignal.dispatch({ pathname, search, hash, pushState: false });
    // void routeChangeSignal.request();
  },

  set enable(enable: boolean)
  {
    // logger.logProperty('popstateTrigger.enable', enable);

    if (enable && !_enabled)
    {
      window.addEventListener('popstate', popstateTrigger._popstateHandler);
    }
    if (!enable && _enabled)
    {
      window.removeEventListener('popstate', popstateTrigger._popstateHandler);
    }
    _enabled = enable;
  },

  get enable(): boolean
  {
    return _enabled;
  }
};
