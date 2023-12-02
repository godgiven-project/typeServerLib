import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse, bodyParser } from '@godgiven/type-server';

import Debug from 'debug';

const log = Debug('app/page/home');

export const pageTest = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');

  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    data: {
      app: await bodyParser(_request),
      user: _request.server
    }
  });
};
