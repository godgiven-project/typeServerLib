import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import Debug from 'debug';

const log = Debug('app/page/home');

export const pageHome = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');

  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    // data: {
    //   app: packageJson.description,
    // },
  });
};
