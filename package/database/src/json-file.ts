import { createId } from '@godgiven/util/uuid.js';
import { utcTimestamp } from '@godgiven/util/time.js';
import { writeJsonFile, readJsonDirectory } from '@godgiven/json-file';

interface QueryType extends Record<string, string> {}

interface ScopeType
{
  name: string; // string without the slash
  path: string; // ./
  username?: string;
  passworld?: string;
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

  async insert(_type: string, _data: Record<string, unknown>, id: string = createId()): Promise<true | Error>
  {
    _data._id = id;
    _data._modified = utcTimestamp();
    _data._created = utcTimestamp();
    const file = await writeJsonFile(
      `${this._scope.path}/${this._scope.name}/${_type}/${id}.json`,
      _data,
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

  async findAll(_type: string, _query?: QueryType): Promise<Array<Record<string, unknown>>>
  {
    const data = await readJsonDirectory(`${this._scope.path}/${this._scope.name}/${_type}`, {});
    return data;
  }
}
