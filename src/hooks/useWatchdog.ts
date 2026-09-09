'use client';
import { useState, useSyncExternalStore } from 'react';
import { useResource } from './useResource';
import type { WatchlistItem, WatchdogFeedResult } from '@/types/watchdog';
const KEY='globalnow_watchlist';
function snapshot(){try{return localStorage.getItem(KEY)||'[]';}catch{return '[]';}}
function subscribe(callback:()=>void){window.addEventListener('storage',callback);window.addEventListener(KEY,callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener(KEY,callback);};}
export function useWatchdog(){
  const raw=useSyncExternalStore(subscribe,snapshot,()=>'[]');
  const [page,setPage]=useState(1);
  const [storageError,setStorageError]=useState<string|null>(null);
  let watchlist:WatchlistItem[]=[];
  try{const value=JSON.parse(raw);if(Array.isArray(value))watchlist=value.filter(item=>item&&typeof item.ticker==='string'&&typeof item.name==='string').slice(0,100);}catch{}
  const params=new URLSearchParams({tickers:watchlist.map(w=>w.ticker).join(','),page:String(page),limit:'20'});
  const resource=useResource<WatchdogFeedResult>(watchlist.length?'/api/watchdog?'+params:null);
  const commit=(next:WatchlistItem[])=>{try{localStorage.setItem(KEY,JSON.stringify(next.slice(0,100)));window.dispatchEvent(new Event(KEY));setStorageError(null);setPage(1);}catch{setStorageError('관심 종목을 저장하지 못했습니다. 브라우저 저장 공간을 확인하세요.');}};
  const addTicker=(item:WatchlistItem)=>{if(!watchlist.some(w=>w.ticker===item.ticker))commit([...watchlist,{...item,addedAt:new Date().toISOString()}]);};
  const addPresetGroup=(items:WatchlistItem[])=>commit([...watchlist,...items.filter(i=>!watchlist.some(w=>w.ticker===i.ticker)).map(i=>({...i,addedAt:new Date().toISOString()}))]);
  return {watchlist,news:resource.data?.items||[],total:resource.data?.total||0,isLoading:resource.isLoading,error:resource.error||storageError,mode:resource.data?.mode,page,setPage,addTicker,addPresetGroup,removeTicker:(ticker:string)=>commit(watchlist.filter(w=>w.ticker!==ticker)),clearAll:()=>commit([]),hasTicker:(ticker:string)=>watchlist.some(w=>w.ticker===ticker),refresh:resource.refresh};
}
