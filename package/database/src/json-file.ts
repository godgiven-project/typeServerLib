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

  insert(_type: string, _data: Record<string, unknown>, id: string = createId()): Record<string, unknown>
  {
    _data._id = id;
    _data._modified = utcTimestamp();
    _data._created = utcTimestamp();
    void writeJsonFile(
      `${this._scope.path}/${this._scope.name}/${_type}/${id}.json`,
      _data
    );
    return _data;
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
