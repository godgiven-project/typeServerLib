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
      }
    },
  });
};
