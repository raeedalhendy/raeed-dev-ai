import "server-only";
import { redirect } from "next/navigation";
import { isAdmin } from "../_lib/auth";
import { getStorefront } from "../_lib/store";
export async function adminData() {
  if (!await isAdmin()) redirect("/login");
  return getStorefront();
}
