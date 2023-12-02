import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { Database } from '@godgiven/database/json-file.js';
import Debug from 'debug';

const log = Debug('app/page/database/deleteById');

const Db = new Database({
  name: 'testDb',
  path: './data'
});

export const pageDeleteUniqueIdDatabase = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageUpdateDatabase');
  try
  {
    await Db.deleteById(
      'testTable',
      'test'
    );
    sendResponse(response, 200, {
      ok: true,
      description: '..:: Welcome ::..'
    });
  }
  catch (error)
  {
    sendResponse(response, 200, {
      ok: false,
      description: '..:: Welcome ::..',
      data: {
        message: (error as Error).message
      }
    });
  }
};
