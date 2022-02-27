import { existsSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';
import { readJsonFile } from './read-json-file.js';

/**
 *
 */
export async function readJsonDirectory<T extends Record<string | number, unknown>>(path: string, defaultContent: T): Promise<T[]>
{
  // Check the path is exsist
  path = resolve(path);
  if (!existsSync(path))
  {
    return [];
  }

  // Try to read file
  const fileContentList: T[] = [];
  let fileList: string[] = [];
  try
  {
    fileList = readdirSync(
      path
    ).filter(
      file => extname(file) === '.json'
    );
  }
  catch (err)
  {
    throw new Error('read_file_list_error');
  }

  for (const file of fileList)
  {
    try
    {
      fileContentList.push(await readJsonFile(`${path}/${file}`, defaultContent));
    }
    catch (error)
    {
      throw new Error('read_file_error');
    }
  }

  return fileContentList;
}
