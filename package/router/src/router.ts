import { joinParameterList, routeSignalProvider } from './core.js';
import { routeChangeSignal } from './signal.js';
import { clickTrigger } from './trigger-click.js';
import { popstateTrigger } from './trigger-popstate.js';

import type { InitOptions, Route, RoutesConfig, RequestRouteParam } from './type.js';
import type { SignalInterface } from '@godgiven/signal';

export { type Route, type RequestRouteParam, type RoutesConfig, routeChangeSignal };

/**
 * Initial and config the Router.
 */
function initial(options: InitOptions = {}): void
{
  options.clickTrigger ??= true;
  options.popstateTrigger ??= true;

  clickTrigger.enable = options.clickTrigger;
  popstateTrigger.enable = options.popstateTrigger;

  routeChangeSignal.setProvider(routeSignalProvider, { debounce: true, receivePrevious: true });

  // first route request.
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!routeChangeSignal.dispatched)
  {
    const { pathname, search, hash } = window.location;
    // Don't use `routeChangeSignal.request()` because we need set the route value immediately.
    routeChangeSignal.dispatch(routeSignalProvider({ pathname, search, hash, pushState: false }), { debounce: false });
  }
}

/**
 * Make anchor valid href from route.
 *
 * Example:
 *
 * ```html
 * <a href=${ router.makeUrl({sectionList: ['product', 100]}) }>
 * ```
 */
function makeUrl(route: Partial<Route>): string
{
  let href = '';

  if (route.sectionList != null)
  {
    // @TODO: handle <base> url.
    href += '/' + route.sectionList.join('/');
  }

  if (route.queryParamList != null)
  {
    href += '?' + joinParameterList(route.queryParamList);
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (route.hash)
  {
    // != null && !== ''
    if (route.hash.indexOf('#') !== 0)
    {
      route.hash += '#';
    }
    href += route.hash;
  }

  return href;
}

/**
 * The result of calling the current route's render() callback base on routesConfig.
 *
 * outlet return `routesConfig.list[routesConfig.map(currentRoute)].render(currentRoute)`
 *
 * if the location is app root and `routesConfig.map()` return noting then redirect to home automatically
 * if `routesConfig.map()` return noting or not found in the list the "404" route will be used.
 *
 * Example:
 *
 * ```ts
 * const routes: routesConfig = {
 *   map: (route) => route.sectionList[0]?.toString(),
 *
 *   list: {
 *     'about': {
 *       render: () => html`<page-about></page-about>`,
 *     },
 *     'product-list': {
 *       render: () => {
 *         import('./page-product-list.js'); // lazy loading page
 *         html`<page-product-list></page-product-list>`,
 *       }
 *     },
 *     'contact': {
 *       render: () => html`<page-contact></page-contact>`,
 *     },
 *
 *     'home': {
 *       render: () => html`<page-home></page-home>`,
 *     },
 *     '404': {
 *       render: () => html`<page-404></page-404>`,
 *     },
 *   },
 * };

 * router.outlet(routes);
 * ```
 */
function outlet(routesConfig: RoutesConfig): unknown
{
  const currentRoute = routeChangeSignal.value;
  if (currentRoute == null)
  {
    return;
  }

  let page = routesConfig.map(currentRoute);

  if (page == null && currentRoute.sectionList.length === 0)
  {
    // root
    page = 'home';

    if (typeof routesConfig.list[page]?.render !== 'function')
    {
      routesConfig.list[page] = { render: () => 'Home Page!' };
    }
  }

  if (page == null || typeof routesConfig.list[page]?.render !== 'function')
  {
    // 404

    page = '404';

    if (typeof routesConfig.list[page]?.render !== 'function')
    {
      // 404
      routesConfig.list[page] = {
        render: () => 'Error 404: Page Not Found!'
      };
    }
  }

  return routesConfig.list[page].render(currentRoute);
}

/**
 * The Router API.
 */
export const router = {
  get currentRoute(): Route
  {
    const route = routeChangeSignal.value;
    if (route == null)
    {
      throw new Error('route_not_initialized');
    }
    return route;
  },

  initial,

  makeUrl,

  outlet,

  /**
   * Signal interface of 'route-change' signal.
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  signal: routeChangeSignal as SignalInterface<'route-change'>
} as const;
