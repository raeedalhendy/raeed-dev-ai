import { adminData } from "../../data";
import { Editor } from "../../ui";
export default async function Page(){const {categories}=await adminData();return <Editor kind="product" categories={categories}/>;}
