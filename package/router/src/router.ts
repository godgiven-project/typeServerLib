import { joinParameterList, updateBrowserHistory, _decodeURIComponent, splitParameterString } from './core.js';
import { browserRouteChangeSignal, routeChangeSignal } from './signal.js';
import { clickTrigger } from './trigger-click.js';
import { popstateTrigger } from './trigger-popstate.js';
import type { InitOptions, RequestRouteParam, Route, RoutesConfig } from './type.js';
export type { Route, RoutesConfig } from './type.js';

let sectionBase: string[] = [];
let sectionIndent: number = 0;

/**
 * Make Route from RequestRouteParam.
 */
export function makeRouteObject(requestParam: RequestRouteParam): Route
{
  // logger.logMethodArgs('makeRouteObject', { requestParam });

  requestParam.search ??= '';
  requestParam.hash ??= '';

  const sectionList = requestParam.pathname
    .split('/')
    .map(_decodeURIComponent) // decode must be after split because encoded '/' maybe include in values.
    .filter((section) => section.trim() !== '');
  return {
    sectionList,
    queryParamList: splitParameterString(requestParam.search.substring(1) /* remove first ? */),
    hash: requestParam.hash
  };
}

/**
 *
 */
export function redirect(route: Partial<Route>): void
{
  const link = makeUrl(route);
  const { pathname, search, hash } = new URL(`${window.location.origin}${link}`);
  void browserRouteChangeSignal.dispatch({ pathname, search, hash });
}

/**
 *
 */
export function routeSignalProvider(requestParam: RequestRouteParam): Route
{
  // logger.logMethodArgs('routeSignalProvider', { requestParam });
  updateBrowserHistory(requestParam);
  const object = makeRouteObject(requestParam);
  object.sectionList = object.sectionList.slice(sectionIndent);
  return object;
}

/**
 * Initial and config the Router.
 */
function initial(options: InitOptions = {}): void
{
  options.clickTrigger ??= true;
  options.popstateTrigger ??= true;

  options.sectionBase ??= [];
  options.sectionIndent ??= 0;
  if (options.sectionBase.length > 0)
  {
    sectionIndent = options.sectionBase.length;
    sectionBase = options.sectionBase;
  }
  // logger.logMethodArgs('initialRouter', { options });

  clickTrigger.enable = options.clickTrigger;
  popstateTrigger.enable = options.popstateTrigger;
  // browserRouteChangeSignal.dispatch(routeSignalProvider, { debounce: true });
  browserRouteChangeSignal.addListener((route) =>
  {
    routeChangeSignal.dispatch((routeSignalProvider(route)), { debounce: true });
  }, { receivePrevious: true });

  // first route request.
  if (routeChangeSignal.dispatched === false)
  {
    const { pathname, search, hash } = window.location;
    // Don't use `routeChangeSignal.request()` because we need set the route value immediately.
    routeChangeSignal.dispatch((routeSignalProvider({ pathname, search, hash, pushState: false })), { debounce: false });
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
  // logger.logMethodArgs('makeUrl', { route });
  route.sectionList = [...sectionBase, ...route.sectionList ?? []];
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

  if (route.hash != null && route.hash !== '')
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
  // logger.logMethodArgs('outlet', { routesConfig });

  const currentRoute = routeChangeSignal.value;
  if (currentRoute == null)
  {
    // logger.accident('outlet', 'route_not_initialized', 'Signal "route-change" not dispatched yet');
    return;
  }

  let page = routesConfig.map(currentRoute);

  if (page == null && currentRoute.sectionList.length === 0)
  {
    // root
    // logger.incident(
    //   'outlet',
    //   'redirect_to_home',
    //   'Route location is app root and routesConfig.map() return noting then redirect to home automatically'
    // );

    page = 'home';

    if (typeof routesConfig.list[page]?.render !== 'function')
    {
      // 'home' not defined!
      // logger.accident('outlet', 'no_render_for_home', 'routesConfig.list["home"] not defined', {
      //   page,
      //   currentRoute,
      //   routesConfig
      // });
      routesConfig.list[page] = { render: () => 'Home Page!' };
    }
  }

  if (page == null || typeof routesConfig.list[page]?.render !== 'function')
  {
    // 404
    // logger.accident('outlet', 'redirect_to_404', 'Requested page not defined in routesConfig.list', {
    //   page,
    //   currentRoute,
    //   routesConfig
    // });

    page = '404';

    if (typeof routesConfig.list[page]?.render !== 'function')
    {
      // 404
      // logger.accident('outlet', 'no_render_for_404', 'Page "404" not defined in routesConfig.list', {
      //   page,
      //   currentRoute,
      //   routesConfig
      // });
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
  signal: routeChangeSignal
} as const;
