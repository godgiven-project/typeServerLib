import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { Database } from '@godgiven/database/json-file.js';
import Debug from 'debug';

const log = Debug('app/page/database/findAll');

const Db = new Database({
  name: 'testDb',
  path: './data',
});

export const pageFindAllDatabase = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');
  const test = await Db.findAll('testTable');

  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    data: test,
  });
};
