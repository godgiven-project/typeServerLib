import { SignalInterface } from '@godgiven/signal';
import type { RequestRouteParam, Route } from './type.js';
declare global
{
  interface SignalList
  {
    'route-change': Route;
    'browser-route-change': RequestRouteParam;
  }
}

export const routeChangeSignal = new SignalInterface('route-change');
export const browserRouteChangeSignal = new SignalInterface('browser-route-change');
