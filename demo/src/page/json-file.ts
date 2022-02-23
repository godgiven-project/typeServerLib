import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { readJsonFile, writeJsonFile } from '@godgiven/json-file';
import Debug from 'debug';

const log = Debug('app/page/home');

export const pageJsonFile = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');
  const jsonAddres = './data/test.json';
  await writeJsonFile(jsonAddres, { test: 'Every thing is ok' });
  const json = await readJsonFile(jsonAddres, { description: 'it\'s not ok' });
  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    data: {
      test: json
    },
  });
};
