import { isAdmin } from "../_lib/auth";
import { redirect } from "next/navigation";
import { Shell } from "./ui";
import "./dashboard.css";
export default async function Layout({ children }: { children: React.ReactNode }) {
  if (!await isAdmin()) redirect("/login");
  return <Shell>{children}</Shell>;
}
