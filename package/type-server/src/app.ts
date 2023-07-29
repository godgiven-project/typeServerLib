import { createServer } from 'http';
import { readFileSync } from 'fs';
import { methodType } from './type.js';
import { SignalInterface } from '@godgiven/signal';
import type { IncomingMessage, ServerResponse, Server } from 'http';
import debug from 'debug';

declare global
{
  /**
   * Global signals value type registry.
   */
  interface SignalNameList
  {
    readonly 'api': {
      version: string;
    };
  }
}

const versionSignal = new SignalInterface('api');

export class App
{
  public app: Server;
  public port: number = 5000;
  public version: string = 'v1';
  public middlewareList: Array<(req: IncomingMessage, res: ServerResponse) => Promise<IncomingMessage>> = [];
  public routeList: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {};

  constructor()
  {
    this.app = createServer(async (req, res) =>
    {
      // await authFunction(req, res);
      for (const middleware of this.middlewareList)
      {
        req = await middleware(req, res);
      }
      const url = `${req.method!} ${req.url!}`;
      if (url in this.routeList)
      {
        try
        {
          await this.routeList[url](req, res);
        }
        catch
        {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          debug('500');
          res.end();
        }
      }
      else
      {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        debug('404 - Route not found');
        res.end();
      }
    });
  }

  public register(method: methodType, path: string, page: (req: IncomingMessage, res: ServerResponse) => Promise<void>): void
  {
    const url = `${method as string} /${this.version}${path}`;
    this.routeList[url] = page;
  }

  public listen(): void
  {
    this.app.addListener('error', (err) =>
    {
      if (err.message === 'EADDRINUSE')
      {
        console.log('Address in use, retrying...');
      }
      else
      {
        console.error(JSON.stringify(err));
      }
      process.exit(1);
    });

    this.app.listen(this.port, () =>
    {
      let showCover = readFileSync('./logo', { encoding: 'utf8' });
      showCover = showCover.replace('$1', `localhost:${this.port}`);
      showCover = showCover.replace('$2', 'Godgiven');
      showCover = showCover.replace('$3', 'https://github.com/godgiven-project');
      console.log(showCover);
      versionSignal.dispatch({ version: this.version });
    });
  }
}

export default App;
