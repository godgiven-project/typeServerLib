import { createId } from '@godgiven/util/uuid.js';
import { writeJsonFile } from '@godgiven/json-file';

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

  insert(_type: string, _data: unknown, uid: string = createId()): unknown
  {
    void writeJsonFile(
      `${this._scope.path}/${this._scope.name}/${_type}/${uid}.json`,
      _data
    );
    return uid;
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

  findAll(_type: string, _query: QueryType): unknown
  {
    return null;
  }
}
