import fs from 'node:fs/promises';
const base='https://raw.githubusercontent.com/Corvus-gent/hackthefeed/corvus-hosting/corvus/';
const response=await fetch(base+'guard.ts');if(!response.ok)throw Error('Hosting guard unavailable: refusing unguarded build');
await fs.writeFile('src/lib/corvus-guard.ts',await response.text());
for(const name of ['generate','retry']){
 const file=`src/app/api/${name}/route.ts`;let src=await fs.readFile(file,'utf8');
 if(!src.includes('export async function POST(req: Request)'))throw Error('Upstream route changed: guard needs review');
 src=src.replace('export async function POST(req: Request)','async function upstreamPOST(req: Request)');
 src="import {guard} from '@/lib/corvus-guard';\n"+src;
 src+=`\nexport async function POST(req: Request) {\nlet body;try{body=await req.clone().json();}catch{return Response.json({error:'Invalid request'},{status:400});}\nconst blocked=await guard(req,${name==='generate'?'Array.isArray(body.videos)?body.videos.length*2:0':'1'});if(blocked)return blocked;\ntry{return await upstreamPOST(req);}catch{return Response.json({error:'Generation unavailable. Please try later.'},{status:503});}\n}\n`;
 if(name==='generate')src=src.replace('model = VIDEO_MODEL','model: _requestedModel').replace('const refs =','const model = VIDEO_MODEL;\n  const refs =');
 await fs.writeFile(file,src);
}
// All paid API attempts are reserved before execution; failed attempts stay charged
// against the demo cap. Disable SDK retries that could submit duplicate paid jobs.
const gmi='src/lib/gmi.ts';await fs.writeFile(gmi,(await fs.readFile(gmi,'utf8')).replace('tries = 3','tries = 1'));
