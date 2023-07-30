import { ServerResponse } from 'http';
import { ApiResponseInterface } from './type.js';
import { SignalInterface } from '@godgiven/signal';
import Debug from 'debug';

const log = Debug('app/sendResponse');
const apiSignal = new SignalInterface('api');

export const sendResponse = (response: ServerResponse, code: number, content: ApiResponseInterface = { ok: false, description: '!' }): void =>
{
  log('sendResponse: %s => %j', code, content);
  try
  {
    content.apiVersion = apiSignal.value?.version ?? 'v1';
    response.statusCode = code;
    // response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Content-Type', 'application/json');
    response.writeHead(code, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Server: 'Godgiven TypeMicroServer'
    });
    response.end(JSON.stringify(content, undefined, 2));
  }
  catch (error)
  {
    log('error: %o', error);
    // responseError(response); // error 500
  }
};
