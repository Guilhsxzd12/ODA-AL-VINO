'use client';
import { useEffect, useState } from 'react';
import { HEADER_LOGO } from './brand';

export default function AgeGate(){
 const [open,setOpen]=useState(false);
 const [denied,setDenied]=useState(false);

 useEffect(()=>{
   try{
     if(localStorage.getItem('videira-age-ok')!=='1')setOpen(true);
   }catch{setOpen(true)}
 },[]);

 if(!open)return null;

 const accept=()=>{
   try{localStorage.setItem('videira-age-ok','1')}catch{}
   setOpen(false);
 };
 const deny=()=>{
   // propositalmente NÃO persiste a escolha: ao atualizar a página,
   // a pergunta aparece novamente para evitar bloqueio permanente por engano.
   setDenied(true);
 };

 return <div className="age-gate">
   <div className={`age-card ${denied?'age-denied':''}`}>
     {!denied?<>
       <span className="age-logo-mask" aria-label="Videira Vinhoteca" style={{WebkitMaskImage:`url("${HEADER_LOGO}")`,maskImage:`url("${HEADER_LOGO}")`}}/>
       <p className="kicker dark">BEM-VINDO À VIDEIRA</p>
       <h2>Você tem 18 anos ou mais?</h2>
       <p>Este site contém informações sobre bebidas alcoólicas e é destinado somente a maiores de 18 anos.</p>
       <div className="age-actions">
         <button onClick={accept}>Sim, tenho 18+</button>
         <button className="age-no" onClick={deny}>Não</button>
       </div>
     </>:<>
       <span className="age-logo-mask" aria-label="Videira Vinhoteca" style={{WebkitMaskImage:`url("${HEADER_LOGO}")`,maskImage:`url("${HEADER_LOGO}")`}}/>
       <div className="age-denied-head">
         <h2>Obrigado pela sinceridade.</h2>
         <p>Você precisa ter mais de 18 anos para acessar este site.</p>
       </div>
       <div className="age-denied-body">
         <p>Desculpe, mas este conteúdo é destinado exclusivamente a maiores de 18 anos.</p>
         <p>Ao acessar este site, você concorda com nossos <a href="/politicas/termos">Termos de uso</a>. Beba com moderação. Não compartilhe com menores de 18 anos.</p>
         <small>Se você selecionou “Não” por engano, atualize esta página para responder novamente.</small>
       </div>
     </>}
   </div>
 </div>;
}
