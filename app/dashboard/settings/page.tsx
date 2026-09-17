import { adminData } from "../data";
import { sql } from "../../_lib/db";
import { RateEditor } from "../ui";
export default async function Page(){await adminData();const rows=await sql()`SELECT value FROM store_settings WHERE key='exchange_rate'`;return <RateEditor rate={String(rows[0]?.value??1350)}/>;}
