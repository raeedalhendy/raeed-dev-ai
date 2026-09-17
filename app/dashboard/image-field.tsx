"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ImageField({ current }: { current?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview,setPreview] = useState(current ?? "");
  const [removed,setRemoved] = useState(false);
  const [description,setDescription] = useState("");
  const [error,setError] = useState("");
  useEffect(()=>()=>{if(preview.startsWith("blob:"))URL.revokeObjectURL(preview);},[preview]);
  return <div className="full image-field">
    <label htmlFor="image-file">الصورة</label>
    <input type="hidden" name="remove_image" value={removed?"yes":"no"}/>
    <div className="upload-box">
      {preview ? <Image unoptimized src={preview} alt="معاينة الصورة" width={460} height={230}/> : <div className="upload-placeholder"><span>↥</span><b>اختر صورة من جهازك</b><p>ستظهر هنا قبل حفظ التغييرات.</p></div>}
      <input ref={input} id="image-file" type="file" name="image_file" accept="image/jpeg,image/png,image/webp" aria-describedby="image-help" onChange={event=>{
        const file=event.target.files?.[0];
        if(!file)return;
        if(file.size>3*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(file.type)){
          event.target.value="";setError("اختر صورة JPG أو PNG أو WebP بحجم حتى 3 ميغابايت.");setPreview(removed?"":current??"");setDescription("");return;
        }
        setPreview(URL.createObjectURL(file));setRemoved(false);setError("");setDescription(file.name+" · "+(file.size/1024).toFixed(0)+" KB");
      }}/>
      <div className="upload-actions"><button type="button" className="secondary" onClick={()=>input.current?.click()}>{preview?"تغيير الصورة":"اختيار صورة"}</button>{preview&&<button type="button" className="danger-text" onClick={()=>{if(input.current)input.current.value="";setPreview("");setRemoved(true);setDescription("");setError("");}}>إزالة الصورة</button>}</div>
    </div>
    {description&&<p className="upload-description" dir="auto">{description}</p>}
    <p id="image-help" className="upload-help">JPG، PNG، WebP · حتى 3 ميغابايت · ضغط تلقائي بلا فقدان، مع الحفاظ على الأبعاد عند الحفظ.</p>
    {error&&<p role="alert" className="form-error">{error}</p>}
  </div>;
}
