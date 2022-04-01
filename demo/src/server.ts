import { App } from '@godgiven/type-server';
import { authFunction } from './middleware/authentication-server.js';
import {
  pageHome,
  pageTest,
  pageUtil,
  pageJsonFile,
  pageInsertDatabase,
  pageInsertUniqueIdDatabase,
  pageUpdateUniqueIdDatabase,
  pageFindUniqueIdDatabase,
  pageFindAllDatabase,
  pageSaveUniqueIdDatabase
} from './page/index.js';

const app = new App();
app.port = 5000;
app.version = 'v1';
app.middlewareList.push(authFunction);

app.register('GET', '/', pageHome);
app.register('GET', '/util', pageUtil);
app.register('GET', '/json-file', pageJsonFile);
app.register('GET', '/database-save', pageSaveUniqueIdDatabase);
app.register('GET', '/database-insert', pageInsertDatabase);
app.register('GET', '/database-insert-id', pageInsertUniqueIdDatabase);
app.register('GET', '/database-update-id', pageUpdateUniqueIdDatabase);
app.register('GET', '/database-find-id', pageFindUniqueIdDatabase);
app.register('GET', '/database-find-all', pageFindAllDatabase);
app.register('GET', '/test', pageTest);
app.register('GET', '', pageHome);

app.listen();
