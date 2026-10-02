'use client';
import { useEffect, useState } from 'react';

const cache=new Map();

function removeConnectedBackground(img){
  const maxSide=520;
  const scale=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
  const w=Math.max(1,Math.round(img.naturalWidth*scale));
  const h=Math.max(1,Math.round(img.naturalHeight*scale));
  const canvas=document.createElement('canvas');
  canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(img,0,0,w,h);
  const data=ctx.getImageData(0,0,w,h);
  const p=data.data;
  const idx=(x,y)=>(y*w+x)*4;
  const cornerColors=[
    [p[0],p[1],p[2]],
    [p[(w-1)*4],p[(w-1)*4+1],p[(w-1)*4+2]],
    [p[((h-1)*w)*4],p[((h-1)*w)*4+1],p[((h-1)*w)*4+2]],
    [p[(h*w-1)*4],p[(h*w-1)*4+1],p[(h*w-1)*4+2]]
  ];
  const nearBg=(i)=>{
    const r=p[i],g=p[i+1],b=p[i+2];
    return cornerColors.some(c=>Math.abs(r-c[0])+Math.abs(g-c[1])+Math.abs(b-c[2])<78);
  };
  const seen=new Uint8Array(w*h);
  const qx=new Int32Array(w*h),qy=new Int32Array(w*h);let head=0,tail=0;
  const push=(x,y)=>{const n=y*w+x;if(seen[n])return;const i=n*4;if(!nearBg(i))return;seen[n]=1;qx[tail]=x;qy[tail]=y;tail++};
  for(let x=0;x<w;x++){push(x,0);push(x,h-1)}
  for(let y=0;y<h;y++){push(0,y);push(w-1,y)}
  while(head<tail){
    const x=qx[head],y=qy[head];head++;
    const i=idx(x,y);p[i+3]=0;
    if(x>0)push(x-1,y);if(x<w-1)push(x+1,y);if(y>0)push(x,y-1);if(y<h-1)push(x,y+1);
  }
  // soften one-pixel halo
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
    const n=y*w+x,i=n*4;
    if(p[i+3]===0)continue;
    let transparent=0;
    for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)if(p[idx(x+xx,y+yy)+3]===0)transparent++;
    if(transparent>=3&&nearBg(i))p[i+3]=Math.min(p[i+3],90);
  }
  ctx.putImageData(data,0,0);
  return canvas.toDataURL('image/png');
}

export default function WineImage({src,alt='',className=''}) {
  const [display,setDisplay]=useState(()=>cache.get(src)||src);
  useEffect(()=>{
    if(!src)return;
    if(cache.has(src)){setDisplay(cache.get(src));return}
    let alive=true;
    const img=new Image();
    img.onload=()=>{
      try{
        const cleaned=removeConnectedBackground(img);
        cache.set(src,cleaned);
        if(alive)setDisplay(cleaned);
      }catch{if(alive)setDisplay(src)}
    };
    img.onerror=()=>alive&&setDisplay(src);
    img.src=src;
    return()=>{alive=false};
  },[src]);
  return <img className={className} src={display} alt={alt} draggable="false"/>;
}
