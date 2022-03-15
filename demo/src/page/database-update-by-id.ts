import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { Database } from '@godgiven/database/json-file.js';
import Debug from 'debug';

const log = Debug('app/page/database/update');

const Db = new Database({
  name: 'testDb',
  path: './data',
});

export const pageUpdateUniqueIdDatabase = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageUpdateDatabase');
  const test = await Db.updateById(
    'testTable',
    'test',
    { testField: 'Update was run' }
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
        status: 'testRecord update to testTable in test Db.'
      },
    });
  }
};
