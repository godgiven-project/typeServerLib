import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { createId } from '@godgiven/util/uuid.js';
import Debug from 'debug';

const log = Debug('app/page/home');

export const pageUtil = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');

  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    data: {
      uuid: createId(),
    },
  });
};
