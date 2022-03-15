import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { Database } from '@godgiven/database/json-file.js';
import Debug from 'debug';

const log = Debug('app/page/database/insert');

const Db = new Database({
  name: 'testDb',
  path: './data',
});

export const pageInsertUniqueIdDatabase = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageInsertDatabase');
  const test = await Db.insert(
    'testTable',
    { testField: 'Everything is ok' },
    'test'
  );

  if (test !== true)
  {
    sendResponse(response, 200, {
      ok: false,
      description: '..:: Welcome ::..',
      data: {
        message: test.message
      },
    });
  }
  else
  {
    sendResponse(response, 200, {
      ok: true,
      description: '..:: Welcome ::..',
      data: {
        status: 'testField insert to testTable in test Db.'
      },
    });
  }
};
