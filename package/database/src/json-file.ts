import { createId } from '@godgiven/util/uuid.js';
import { utcTimestamp } from '@godgiven/util/time.js';
import { writeJsonFile, readJsonDirectory, readJsonFile } from '@godgiven/json-file';

interface QueryType extends Record<string, string> {}

interface ScopeType
{
  name: string; // string without the slash
  path: string; // ./
  username?: string;
  password?: string;
  port?: number;
}

/**
 * Databse is a middlewere for communicate to flat file database
 *
 * @scope is config of database name and other salt.
 * @type similar the table and structure
 */
export class Database
{
  private readonly _scope: ScopeType;

  constructor(scope: ScopeType)
  {
    this._scope = scope;
  }

  async insert(type: string, data: Record<string, unknown>, id: string = createId()): Promise<true | Error>
  {
    data._id = id;
    data._modified = utcTimestamp();
    data._created = utcTimestamp();
    const file = await writeJsonFile(
      `${this._scope.path}/${this._scope.name}/${type}/${id}.json`,
      data,
      false
    );

    if (file === true)
    {
      return true;
    }
    else
    {
      if (file.message === 'EEXIST')
      {
        return new Error('Record is exist');
      }
      else
      {
        return new Error('Insert is not successful');
      }
    }
  }

  async updateById(type: string, id: string | number, data: Record<string, unknown>): Promise<true | Error>
  {
    const old = await readJsonFile(`${this._scope.path}/${this._scope.name}/${type}/${id}.json`);
    if (!(old instanceof Error))
    {
      data._modified = utcTimestamp();
      const file = await writeJsonFile(
        `${this._scope.path}/${this._scope.name}/${type}/${id}.json`,
        {
          ...old,
          ...data
        },
        true
      );

      if (file === true)
      {
        return true;
      }
      else
      {
        return new Error('Update is not successful');
      }
    }
    else
    {
      if (old.message === 'ENOENT')
      {
        return new Error('Record is not exist');
      }
      else
      {
        return new Error(old.message);
      }
    }
  }

  async findAll(type: string, _query?: QueryType): Promise<Array<Record<string, unknown>>>
  {
    const data = await readJsonDirectory(`${this._scope.path}/${this._scope.name}/${type}`);
    if (!(data instanceof Error))
    {
      return data;
    }
    else
    {
      return [];
    }
  }

  delete(_type: string, _query: QueryType): unknown
  {
    return null;
  }

  update(_type: string, _query: QueryType, _data: unknown): unknown
  {
    return null;
  }

  find(_type: string, _query: QueryType): unknown
  {
    return null;
  }
}
