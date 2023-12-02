import { alpha, alphanumeric } from './alpha.js';

/**
 *
 */
export function isAlpha(value: unknown, locale: string = 'en-US', ignore?: RegExp | string): boolean
{
  if (typeof value !== 'string') { return false; }

  if (ignore instanceof RegExp) { value = value.replace(ignore, ''); }
  // escape regex for ignore
  if (typeof ignore === 'string') { value = (value as string).replace(new RegExp(`[${ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&')}]`, 'g'), ''); }

  if (locale in alpha)
  {
    return alpha[locale].test(value as string);
  }
  return false;
}

/**
 *
 */
export function isAlphanumeric(value: unknown, locale: string = 'en-US', ignore?: RegExp | string): boolean
{
  if (typeof value !== 'string') { return false; }

  if (ignore instanceof RegExp) { value = value.replace(ignore, ''); }
  // escape regex for ignore
  if (typeof ignore === 'string') { value = (value as string).replace(new RegExp(`[${ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&')}]`, 'g'), ''); }

  if (locale in alphanumeric)
  {
    return alphanumeric[locale].test(value as string);
  }
  return false;
}
