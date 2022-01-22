import { ServerResponse } from 'http';
import Debug from 'debug';
import * as jwt from './json-web-token.js';

import type { IncomingMessage } from 'http';

export interface requestType extends IncomingMessage
{
  user?: {
    fName: string;
    lName: string;
  };
  server?: {
    name: string;
  };
}

const debug = Debug('auth');
// define plugin using callbacks
export const authFunction = (request: requestType, reply: ServerResponse): requestType =>
{
  const authHeader = request.headers.authorization;
  // const secret: string | undefined = 'sssssss';
  // const token2 = jwt.sign('{"name":"test"}', secret);
  // if (reply != null) { console.log('sss'); }
  // request.user = jwt.verify(token2, secret) as string;
  // console.log(token2);

  // Giv token and secret
  if (authHeader == null)
  {
    // reply.writeHead(401, { 'Content-Type': 'application/json' });
    // debug('401 - User don,t have a token');
    // reply.end();
    return request;
  }

  // Set token and secret
  const token = authHeader.split(' ')[1];
  const secret = 'sssssss';

  if (secret == null)
  {
    reply.writeHead(401, { 'Content-Type': 'application/json' });
    debug('401 - secret is not set');
    reply.end();
    return request;
  }

  // Verify token
  try
  {
    request.server = jwt.verify(token, secret) as typeof request.server;
    return request;
    // const user = jwt.verify(token, secret);
  }
  catch
  {
    reply.writeHead(403, { 'Content-Type': 'application/json' });
    debug('403 - Bad token');
    reply.end();
    return request;
  }
};
