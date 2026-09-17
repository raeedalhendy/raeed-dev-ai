import { adminData } from "../data";
import { Manager } from "../ui";
export default async function Page(){const data=await adminData();return <Manager kind="product" {...data}/>;}
