'use client';
import { CATALOG_DATA_A } from './catalogDataA';
import { CATALOG_DATA_B } from './catalogDataB';

let catalogPromise;

function decodeBase64(value){
  const binary=atob(value);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  return bytes;
}

export function loadCatalog(){
  if(!catalogPromise){
    catalogPromise=(async()=>{
      const bytes=decodeBase64(CATALOG_DATA_A+CATALOG_DATA_B);
      if(typeof DecompressionStream==='undefined') throw new Error('Navegador sem suporte à descompressão do catálogo.');
      const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      const text=await new Response(stream).text();
      return JSON.parse(text);
    })();
  }
  return catalogPromise;
}

export function money(value){
  return Number(value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}
