import type { ParamList, RequestRouteParam, Route } from './type.js';
// import { sign } from '@godgiven/signal';

/**
 * Update browser history state (history.pushState or history.replaceState).
 */
export function updateBrowserHistory(options: RequestRouteParam): void
{
  // logger.logMethodArgs('updateBrowserHistory', { options });

  if (options.pushState === false) { return; } // default is true then undefined means true.

  options.search ??= '';
  options.hash ??= '';

  if (
    window.location.pathname === options.pathname &&
    window.location.search === options.search &&
    window.location.hash === options.hash
  )
  {
    return;
  }

  const changeState = options.pushState === 'replace' ? 'replaceState' : 'pushState';
  window.history[changeState](null, document.title, options.pathname + options.search + options.hash);
}

// --- Utils ---

/**
 * decodeURIComponent without throwing error.
 */
export function _decodeURIComponent(val: string): string
{
  try
  {
    return decodeURIComponent(val);
  }
  catch (err)
  {
    return val;
  }
}

/**
 * Make query string from {key:val} object
 */
export function joinParameterList(parameterList: ParamList | null | undefined): string
{
  if (parameterList == null) { return ''; }
  const list: string[] = [];
  for (const key in parameterList)
  {
    if (Object.prototype.hasOwnProperty.call(parameterList, key))
    {
      list.push(`${key}=${String(parameterList[key])}`);
    }
  }
  return list.join('&');
}

/**
 * Make {key:val} object from query string
 */
export function splitParameterString(parameterString: string | null | undefined): ParamList
{
  const parameterList: ParamList = {};
  if (parameterString == null) { return parameterList; }
  if (parameterString === '') { return parameterList; }
  if (!(parameterString as unknown as boolean)) { return parameterList; }

  parameterString.split('&').forEach((parameter) =>
  {
    const parameterArray = parameter.split('=');
    parameterList[parameterArray[0]] = parameterArray[1] != null ? parseValue(parameterArray[1]) : '';
  });

  return parameterList;
}

/**
 * Check type of a value is `number` or not
 */
export function parseValue(value: string): string
{
  return value;
}
