import { createClient } from 'redis';
import { createHmac } from 'node:crypto';
let client: ReturnType<typeof createClient> | undefined;
let pending: Promise<unknown> | undefined;
async function db() {
 if (!client) {
  const raw=process.env.REDIS_URL; if(!raw) throw Error('storage');
  const u=new URL(raw);
  if(u.protocol!=='rediss:' && !(u.protocol==='redis:' && u.hostname===process.env.REDIS_PLAINTEXT_HOST && Date.now()<Date.parse(process.env.REDIS_PLAINTEXT_UNTIL||''))) throw Error('storage');
  client=createClient({url:raw,socket:{connectTimeout:2500,reconnectStrategy:false}}); client.on('error',()=>{});
  pending=client.connect().catch(()=>{client=undefined;pending=undefined;throw Error('storage');});
 }
 await pending; return client!;
}
export async function guard(req:Request, clips:number) {
 if(!process.env.GMI_API_KEY)return Response.json({error:'Generation coming soon. Explore the early beta while we connect the video engine.'},{status:503});
 if(!Number.isInteger(clips)||clips<1||clips>10)return Response.json({error:'Choose between 1 and 5 source videos.'},{status:400});
 try {
  const day=new Date().toISOString().slice(0,10),salt=process.env.HACK_RATE_SECRET;
  if(!salt)throw Error('storage');
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';
  const hash=createHmac('sha256',salt).update(day+':'+ip).digest('hex');
  const cap=Math.max(0,Math.min(1000,Number(process.env.HACK_DAILY_CAP||20)));
  const result=await (await db()).eval(`local all=tonumber(redis.call('GET',KEYS[1]) or '0');local ip=tonumber(redis.call('GET',KEYS[2]) or '0');local n=tonumber(ARGV[1]);if all+n>tonumber(ARGV[2]) or ip+n>tonumber(ARGV[3]) then return 0 end;redis.call('INCRBY',KEYS[1],n);redis.call('EXPIRE',KEYS[1],172800);redis.call('INCRBY',KEYS[2],n);redis.call('EXPIRE',KEYS[2],172800);return 1`,{keys:['hack:clips:'+day,'hack:clip-ip:'+day+':'+hash],arguments:[String(clips),String(cap),'6']});
  if(!result)return Response.json({error:'Demo limit reached. Come back tomorrow — the early beta has a small daily clip budget.'},{status:429,headers:{'Retry-After':'86400'}});
  return null;
 }catch{return Response.json({error:'Generation is taking a break. Please try again later.'},{status:503});}
}
