import {createContext,useContext,useEffect,useState,type ReactNode} from 'react'
import {useQuery,useQueryClient} from '@tanstack/react-query'
import {useRouter} from '@tanstack/react-router'
import type {User} from '@supabase/supabase-js'
import {supabase} from '@/integrations/supabase/client'
import type {Tables,Json} from '@/integrations/supabase/types'
import {dateKey} from '@/lib/balance'
import {toast} from 'sonner'

type Prefs={excluded:string[];favorites:string[];theme:string;reminders:Record<string,string>;mealTimes:string[]}
export const emptyPrefs:Prefs={excluded:[],favorites:[],theme:'light',reminders:{},mealTimes:[]}
export function parsePrefs(value:Json|undefined):Prefs{if(!value||typeof value!=='object'||Array.isArray(value))return emptyPrefs;return {...emptyPrefs,...value} as Prefs}
type State={user:User|null;ready:boolean;date:string;setDate:(s:string)=>void;profile:Tables<'profiles'>|null;entries:Tables<'daily_entries'>[];meals:Tables<'meal_entries'>[];workouts:Tables<'workout_entries'>[];loading:boolean;refresh:()=>Promise<void>;requireUser:()=>User|null;signOut:()=>Promise<void>}
const Context=createContext<State|null>(null)
export function BalanceProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null),[ready,setReady]=useState(false),[date,setDate]=useState(dateKey())
 const queryClient=useQueryClient(),router=useRouter()
 useEffect(()=>{let active=true;void supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user);setReady(true)}});const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{if(event!=='SIGNED_IN'&&event!=='SIGNED_OUT'&&event!=='USER_UPDATED')return;setUser(session?.user??null);setReady(true);void router.invalidate();if(event!=='SIGNED_OUT')void queryClient.invalidateQueries();else queryClient.clear()});return()=>{active=false;subscription.unsubscribe()}},[router,queryClient])
 const query=useQuery({queryKey:['balance',user?.id],enabled:ready&&!!user,queryFn:async()=>{if(!user)return null;const start=new Date();start.setMonth(start.getMonth()-12);const from=dateKey(start);const results=await Promise.all([supabase.from('profiles').select('*').eq('id',user.id).single(),supabase.from('daily_entries').select('*').eq('user_id',user.id).gte('date',from).order('date').limit(1000),supabase.from('meal_entries').select('*').eq('user_id',user.id).gte('date',from).order('date',{ascending:false}).limit(1000),supabase.from('workout_entries').select('*').eq('user_id',user.id).gte('date',from).order('date').limit(1000)]);for(const r of results)if(r.error)throw r.error;return {profile:results[0].data,entries:results[1].data??[],meals:results[2].data??[],workouts:results[3].data??[]}}})
 const prefs=parsePrefs(query.data?.profile?.preferences)
 useEffect(()=>{document.documentElement.classList.toggle('dark',prefs.theme==='dark')},[prefs.theme])
 useEffect(()=>{if(!user)return;const sent=new Set<string>();const interval=setInterval(()=>{const current=new Date();const time=current.toTimeString().slice(0,5);for(const [name,value]of Object.entries(prefs.reminders)){const key=dateKey()+name+time;if(value===time&&!sent.has(key)){sent.add(key);toast(name);if('Notification'in window&&Notification.permission==='granted')new Notification('MyBalance',{body:name,icon:'/icon-192.png'})}}},30000);return()=>clearInterval(interval)},[user,JSON.stringify(prefs.reminders)])
 async function refresh(){await queryClient.invalidateQueries({queryKey:['balance']})}
 async function signOut(){await queryClient.cancelQueries();queryClient.clear();await supabase.auth.signOut();setUser(null);await router.navigate({to:'/',replace:true})}
 const value:State={user,ready,date,setDate,profile:query.data?.profile??null,entries:query.data?.entries??[],meals:query.data?.meals??[],workouts:query.data?.workouts??[],loading:query.isFetching,refresh,signOut,requireUser:()=>{if(!user)toast('Accedi per salvare nel tuo diario personale.');return user}}
 return <Context.Provider value={value}>{query.error&&<div role="alert" className="data-error">Impossibile caricare i dati. <a href="/">Riprova</a></div>}{children}</Context.Provider>
}
export function useBalance(){const context=useContext(Context);if(!context)throw new Error('BalanceProvider missing');return context}