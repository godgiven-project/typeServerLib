import { App } from '@godgiven/type-server';
import { authFunction } from './middleware/authentication-server.js';
import {
  pageHome,
  pageTest,
  pageUtil,
  pageJsonFile
} from './page/index.js';

const app = new App();
app.port = 5000;
app.version = 'v1';
app.middlewareList.push(authFunction);

app.register('GET', '/', pageHome);
app.register('GET', '/util', pageUtil);
app.register('GET', '/json-file', pageJsonFile);
app.register('GET', '/test', pageTest);
app.register('GET', '', pageHome);

app.listen();
