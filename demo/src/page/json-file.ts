import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { readJsonFile, writeJsonFile } from '@godgiven/json-file';
import Debug from 'debug';

const log = Debug('app/page/home');

export const pageJsonFile = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  log('pageHome');
  const jsonAdders = './data/test.json';
  await writeJsonFile(jsonAdders, { test: 'Every thing is ok' });
  const json = await readJsonFile(jsonAdders);
  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    data: {
      test: json
    },
  });
};
