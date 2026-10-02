'use client';
import { useEffect, useState } from 'react';
import { HEADER_LOGO } from './brand';

export default function AgeGate(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{try{if(localStorage.getItem('videira-age-ok')!=='1')setOpen(true)}catch{setOpen(true)}},[]);
 if(!open)return null;
 return <div className="age-gate"><div className="age-card"><span className="age-logo-mask" aria-label="Videira Vinhoteca" style={{WebkitMaskImage:`url("${HEADER_LOGO}")`,maskImage:`url("${HEADER_LOGO}")`}}/><p className="kicker dark">BEM-VINDO À VIDEIRA</p><h2>Você tem 18 anos ou mais?</h2><p>Este site contém informações sobre bebidas alcoólicas e é destinado somente a maiores de 18 anos.</p><div className="age-actions"><button onClick={()=>{try{localStorage.setItem('videira-age-ok','1')}catch{}setOpen(false)}}>Sim, tenho 18+</button><a href="https://www.google.com/">Não</a></div></div></div>;
}
