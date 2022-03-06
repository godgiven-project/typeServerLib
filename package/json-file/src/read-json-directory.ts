import { existsSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';
import { readJsonFile } from './read-json-file.js';

/**
 *
 */
export async function readJsonDirectory<T extends Record<string | number, unknown>>(path: string): Promise<T[] | Error>
{
  // Check the path is exsist
  path = resolve(path);
  if (!existsSync(path))
  {
    return [];
  }

  // Try to read file list
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
    return new Error('read_file_list_error');
  }

  // read all json file
  for (const file of fileList)
  {
    const fileContent = await readJsonFile<T>(`${path}/${file}`);
    if (!(fileContent instanceof Error))
    {
      fileContentList.push(fileContent);
    }
  }

  return fileContentList;
}
