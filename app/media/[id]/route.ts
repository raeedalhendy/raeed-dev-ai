import { sql } from "../../_lib/db";

export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{64}$/.test(id)) return new Response(null, {status:404});
  try {
    const rows = await sql()`SELECT mime,data_base64 FROM store_images WHERE id=${id}`;
    if (!rows.length) return new Response(null,{status:404});
    const headers = {
      "Content-Type": String(rows[0].mime),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ETag: '"' + id + '"',
    };
    if (request.headers.get("if-none-match") === headers.ETag) return new Response(null,{status:304,headers});
    return new Response(new Uint8Array(Buffer.from(rows[0].data_base64,"base64")),{headers});
  } catch {
    return new Response(null,{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
