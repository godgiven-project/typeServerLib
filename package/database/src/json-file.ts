import { createId } from '@godgiven/util/uuid.js';
import { utcTimestamp } from '@godgiven/util/time.js';
import { writeJsonFile, readJsonDirectory, readJsonFile, deleteJsonFile } from '@godgiven/json-file';

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
   * @param {object} scope is config of database name and other salt.
   */
  constructor(scope: ScopeType)
  {
    this._scope = scope;
  }

  /**
   * For insert record data to table of database
   *
   * @param {string} type similar the table and structure
   * @param {object} data data of Record
   * @param {string} id the unique reference for Record
   * @returns {true | Record<string, unknown>} `true` if the insert was successful Else return a `Error Object`
   */
  async insert(
    type: string,
    data: Record<string, unknown>,
    id: string = createId()
  ): Promise<void>
  {
    try
    {
      await writeJsonFile(
        `${this._scope.path}/${this._scope.name}/${type}/${id}.json`,
        {
          ...data,
          _id: id,
          _modified: utcTimestamp(),
          _created: utcTimestamp()
        },
        false
      );
    }
    catch (error)
    {
      if ((error as Error).message === 'EEXIST')
      {
        throw new Error('Record is exist');
      }
      else
      {
        throw new Error('Insert is not successful');
      }
    }
  }

  /**
   * For save record data to table of database
   *
   * @param {string} type similar the table and structure
   * @param {object} data data of Record
   * @param {string} id the unique reference for Record
   * @returns {true | Record<string, unknown>} `true` if the save was successful Else return a `Error Object`
   */
  async save(
    type: string,
    data: Record<string, unknown>,
    id: string = createId()
  ): Promise<void>
  {
    try
    {
      await writeJsonFile(
        `${this._scope.path}/${this._scope.name}/${type}/${id}.json`,
        {
          ...data,
          _id: id,
          _modified: utcTimestamp(),
          _created: utcTimestamp()
        },
        true
      );
    }
    catch
    {
      throw new Error('Save is not successful');
    }
  }

  /**
   *
   * @param {string} type similar the table and structure
   * @returns {Array<Record<string, unknown>>} Return a array of data
   */
  async findAll(type: string): Promise<Array<Record<string, unknown>>>
  {
    try
    {
      const data = await readJsonDirectory(`${this._scope.path}/${this._scope.name}/${type}`);
      return data;
    }
    catch (error)
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
  async deleteById(type: string, id: string | number): Promise<void>
  {
    try
    {
      await deleteJsonFile(`${this._scope.path}/${this._scope.name}/${type}/${id}.json`);
    }
    catch (error)
    {
      if ((error as Error).message === 'NEXIST')
      {
        throw new Error('Record is not exist');
      }
      else
      {
        throw error;
      }
    }
  }

  /**
   *
   * @param {string} type similar the table and structure
   * @param {string} id the unique reference for Record
   * @returns
   */
  async findById(type: string, id: string | number): Promise<Record<string, unknown>>
  {
    try
    {
      const data = await readJsonFile(`${this._scope.path}/${this._scope.name}/${type}/${id}.json`);
      return data;
    }
    catch (error)
    {
      if ((error as Error).message === 'NEXIST')
      {
        throw new Error('Record is not exist');
      }
      else
      {
        throw error;
      }
    }
  }

  /**
   *
   * @param {string} type similar the table and structure
   * @param {Record<string, unknown>} data any field that you want update
   * @param {string} id the unique reference for Record
   * @returns {true | Error} `true` if the update was successful Else return a `Error Object`
   */
  async updateById(
    type: string,
    data: Record<string, unknown>,
    id: string | number
  ): Promise<void>
  {
    try
    {
      const old = await readJsonFile(`${this._scope.path}/${this._scope.name}/${type}/${id}.json`);
      data._modified = utcTimestamp();
      try
      {
        await writeJsonFile(
          `${this._scope.path}/${this._scope.name}/${type}/${id}.json`,
          {
            ...old,
            ...data,
            _id: id,
            _modified: utcTimestamp()
          },
          true
        );
      }
      catch
      {
        throw new Error('Update is not successful');
      }
    }
    catch (error)
    {
      if ((error as Error).message === 'NEXIST')
      {
        throw new Error('Record is not exist');
      }
      else
      {
        throw error;
      }
    }
  }

  // delete(_type: string, _query: QueryType): unknown;
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
