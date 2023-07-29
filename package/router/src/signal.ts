import { SignalInterface } from '@godgiven/signal';

import type { RequestRouteParam, Route } from './type.js';

declare global
{
  interface SignalNameList
  {
    'route-change': Route;
  }

  interface RequestSignalNameList
  {
    'route-change': RequestRouteParam;
  }
}

export const routeChangeSignal = new SignalInterface('route-change');
