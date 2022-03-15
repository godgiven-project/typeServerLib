import { createId } from '@godgiven/util/uuid.js';
import { utcTimestamp } from '@godgiven/util/time.js';
import { writeJsonFile, readJsonDirectory, readJsonFile } from '@godgiven/json-file';

// interface QueryType extends Record<string, string> {}

interface ScopeType
{
  name: string; // string without the slash
  path: string; // ./
  username?: string;
  password?: string;
  port?: number;
}

/**
 * Database is a middleware for communicate to flat file database
 *
 */
export class Database
{
  private readonly _scope: ScopeType;

  /**
   * @param {Object} scope is config of database name and other salt.
   */
  constructor(scope: ScopeType)
  {
    this._scope = scope;
  }

  /**
   * For insert record data to table of database
   *
   * @param {string} type similar the table and structure
   * @param {Object} data data of Record
   * @param {string} id the unique reference for Record
   * @returns {true | Record<string, unknown>} `true` if the insert was successful Else return a `Error Object`
   */
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

  /**
   *
   * @param {string} type similar the table and structure
   * @returns {Array<Record<string, unknown>>} Return a array of data
   */
  async findAll(type: string): Promise<Array<Record<string, unknown>>>
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

  /**
   *
   * @param {string} type similar the table and structure
   * @param {string} id the unique reference for Record
   * @returns
   */
  async findById(type: string, id: string | number): Promise<Record<string, unknown> | Error>
  {
    const data = await readJsonFile(`${this._scope.path}/${this._scope.name}/${type}/${id}.json`);
    if (!(data instanceof Error))
    {
      return data;
    }
    else
    {
      if (data.message === 'NEXIST')
      {
        return new Error('Record is not exist');
      }
      else
      {
        return new Error(data.message);
      }
    }
  }

  /**
   *
   * @param {string} type similar the table and structure
   * @param {string} id the unique reference for Record
   * @param {Record<string, unknown>} data any field that you want update
   * @returns {true | Error} `true` if the update was successful Else return a `Error Object`
   */
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
      if (old.message === 'NEXIST')
      {
        return new Error('Record is not exist');
      }
      else
      {
        return new Error(old.message);
      }
    }
  }

  // delete(_type: string, _query: QueryType): unknown
  // {
  //   return null;
  // }

  // update(_type: string, _query: QueryType, _data: unknown): unknown
  // {
  //   return null;
  // }

  // find(_type: string, _query: QueryType): unknown
  // {
  //   return null;
  // }
}
