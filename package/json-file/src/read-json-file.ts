import { existsSync, promises as fs } from 'fs';
import { resolve } from 'path';
/**
 *
 */
export async function readJsonFile<T extends Record<string | number, unknown>>(path: string, defaultContent: T): Promise<T>
{
  // Check the path is exsist
  path = resolve(path);
  if (!existsSync(path))
  {
    return defaultContent;
  }

  // Try to read file
  let fileContent: string;
  try
  {
    fileContent = await fs.readFile(path, { encoding: 'utf-8' });
  }
  catch (err)
  {
    throw new Error('read_file_error');
  }

  // Try to pars file
  try
  {
    return JSON.parse(fileContent);
  }
  catch (err)
  {
    throw new Error('invalid_json');
  }
}
