/**
 *
 */
export function utcTimestamp(): number
{
  const now = new Date();
  return now.getTime() + now.getTimezoneOffset() * 60000;
}
