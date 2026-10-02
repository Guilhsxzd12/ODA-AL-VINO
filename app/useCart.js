'use client';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY='videira-cart-v2';

export default function useCart(){
  const [cart,setCart]=useState([]);
  const [hydrated,setHydrated]=useState(false);

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      if(Array.isArray(saved)) setCart(saved.filter(x=>x&&x.id).map(x=>({...x,qty:Math.max(1,Number(x.qty)||1)})));
    }catch{}
    setHydrated(true);
  },[]);

  useEffect(()=>{
    if(!hydrated)return;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart))}catch{}
  },[cart,hydrated]);

  const add=(product,amount=1)=>{
    const qty=Math.max(1,Number(amount)||1);
    setCart(items=>{
      const found=items.find(x=>String(x.id)===String(product.id));
      return found
        ? items.map(x=>String(x.id)===String(product.id)?{...x,qty:(Number(x.qty)||1)+qty}:x)
        : [...items,{...product,qty}];
    });
  };

  const updateQty=(id,value)=>{
    const qty=Math.max(0,Math.floor(Number(value)||0));
    setCart(items=>qty<=0?items.filter(x=>String(x.id)!==String(id)):items.map(x=>String(x.id)===String(id)?{...x,qty}:x));
  };
  const remove=id=>setCart(items=>items.filter(x=>String(x.id)!==String(id)));
  const clear=()=>setCart([]);
  const count=useMemo(()=>cart.reduce((s,x)=>s+(Number(x.qty)||1),0),[cart]);
  const total=useMemo(()=>cart.reduce((s,x)=>s+Number(x.price||0)*(Number(x.qty)||1),0),[cart]);

  return {cart,add,updateQty,remove,clear,count,total};
}
