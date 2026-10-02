// temporary Supabase import bridge
import { gunzipSync } from 'node:zlib';
import { CATALOG_DATA_A } from '../../catalogDataA.js';
import { CATALOG_DATA_B } from '../../catalogDataB.js';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(){
  const zipped=Buffer.from(CATALOG_DATA_A+CATALOG_DATA_B,'base64');
  const catalog=JSON.parse(gunzipSync(zipped).toString('utf8'));
  return Response.json(catalog,{headers:{'Cache-Control':'no-store'}});
}
