import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { Database } from '@godgiven/database/json-file.js';
import Debug from 'debug';

const log = Debug('app/page/home');

const Db = new Database({
  name: 'testDb',
  path: './data',
});

export const pageDatabase = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');
  await Db.insert(
    'testTable',
    { testFild: 'Everything is ok' },
    'id'
  );

  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    data: {
      status: 'testFild insert to testTable in test Db.'
    },
  });
};
