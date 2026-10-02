'use client';
import { useEffect, useRef, useState } from 'react';
import { loadWineImage } from './catalogLoader';

export default function WineThumb({wine,className='wine-photo'}){
 const ref=useRef(null);
 const [src,setSrc]=useState(wine?.image_url||'');
 useEffect(()=>{
   if(src||!wine?.id)return;
   const el=ref.current;
   let active=true,observer;
   const load=()=>loadWineImage(wine.id).then(url=>{if(active&&url)setSrc(url)}).catch(()=>{});
   if('IntersectionObserver' in window&&el){
     observer=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting){observer.disconnect();load()}},{rootMargin:'260px'});
     observer.observe(el);
   }else load();
   return()=>{active=false;observer?.disconnect()};
 },[wine?.id,src]);
 if(!src)return <span ref={ref} className="wine-photo-placeholder" aria-hidden="true"/>;
 return <img ref={ref} className={className} src={src} alt={wine?.name||'Rótulo de vinho'} loading="lazy" decoding="async" draggable="false"/>;
}
