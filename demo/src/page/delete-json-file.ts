import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { deleteJsonFile } from '@godgiven/json-file';
import Debug from 'debug';

const log = Debug('app/page/home');

export const pageDeleteJsonFile = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');
  const jsonAdders = './data/test.json';
  await deleteJsonFile(jsonAdders);
  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
  });
};
