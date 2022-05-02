import isEmail from 'validator/lib/isEmail.js';
import { isMobilePhone } from './lib/isMobilePhone.js';
import { isAlpha, isAlphanumeric } from './lib/isAlpha.js';

export const validate = {
  isEmail: (value: unknown): boolean => typeof value === 'string' ? isEmail(value) : false,
  isExist: (value: unknown): boolean => value != null,
  isMobilePhone: (value: unknown): boolean =>
  {
    // if (typeof value !== 'string') { return false; }
    return isMobilePhone(value);
  },
  isAlpha: (value: unknown): boolean =>
  {
    return (isAlpha(value, undefined, ' ') || isAlpha(value, 'fa-IR', ' '));
  },
  isAlphanumeric: (value: unknown): boolean =>
  {
    return typeof value === 'string' ? (isAlphanumeric(value) || isAlphanumeric(value, 'fa-IR')) : false;
  },
  isNumeric: (value: unknown): boolean => typeof value === 'number'
};
