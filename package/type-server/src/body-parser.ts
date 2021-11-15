import { IncomingMessage } from 'http';

export const bodyParser = async (request: IncomingMessage): Promise<Record<string, any>> =>
{
  let body = '';

  request.on('data', chunk =>
  {
    body += chunk as string;
  });

  request.on('error', () =>
  {
    throw new Error('Invalid_HTTP_Body');
  });

  await new Promise(resolve => request.on('end', resolve));

  try
  {
    return JSON.parse(body);
  }
  catch (error)
  {
    throw new Error('Cant_Parse_JSON!');
  }
};
