import { createServer } from 'http';
import { readFileSync } from 'fs';
import { methodType } from './type.js';
import { dispatchSignal } from '@godgiven/signal';
import type { IncomingMessage, ServerResponse, Server } from 'http';
import debug from 'debug';

export class App
{
  public app: Server;
  public port: number = 5000;
  public version: string = 'v1';
  public middlewareList: Array<(req: IncomingMessage, res: ServerResponse) => IncomingMessage> = [];
  public routeList: Record<string, (req: IncomingMessage, res: ServerResponse) => void> = {};

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
      // console.log(url);
      // console.log(Object.keys(this.routeList));
      if (url in this.routeList)
      {
        this.routeList[url](req, res);
      }
      else
      {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        debug('404 - Route not found');
        res.end();
      }
    });
  }

  public register(method: methodType, path: string, page: (req: IncomingMessage, res: ServerResponse) => void): void
  {
    const url = `${method as string} /${this.version}${path}`;
    this.routeList[url] = page;
  }

  public listen(): void
  {
    this.app.addListener('error', (err) =>
    {
      console.error(JSON.stringify(err));
      process.exit(1);
    });

    this.app.listen(this.port, () =>
    {
      let showCover = readFileSync('./logo', { encoding: 'utf8' });
      showCover = showCover.replace('$1', `localhost:${this.port}`);
      showCover = showCover.replace('$2', 'Godgiven');
      showCover = showCover.replace('$3', 'https://github.com/godgiven-project');
      console.log(showCover);
      void dispatchSignal('api', {
        version: this.version
      });
    });
  }
}

export default App;
