import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { validate } from '@godgiven/validator';
import Debug from 'debug';

const log = Debug('app/page/home');

export const pageValidator = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');
  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    data: {
      email: {
        'test string': validate.isEmail('test string'),
        'test@string.com': validate.isEmail('test@string.com'),
        Object: validate.isEmail({ test: 'test' }),
      },
      phone: {
        'test string': validate.isMobilePhone('test string'),
        '+989999999999': validate.isMobilePhone('+989999999999'),
      },
      Alpha: {
        'test string': validate.isAlpha('test string'),
        'test 12 35 string': validate.isAlpha('test 12 35 string'),
        Object: validate.isAlpha({ test: 'test' }),
        125: validate.isAlpha(125),
      },
      isAlphanumeric: {
        'test string': validate.isAlphanumeric('test string'),
        'test 12 35 string': validate.isAlphanumeric('test 12 35 string'),
        Object: validate.isAlphanumeric({ test: 'test' }),
        125: validate.isAlphanumeric('125'),
      }
    },
  });
};
