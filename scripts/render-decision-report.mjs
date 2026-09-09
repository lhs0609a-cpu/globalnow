import { readFileSync, writeFileSync } from 'node:fs';
const source=readFileSync(new URL('../docs/research/decision-intelligence-strategy.md',import.meta.url),'utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const inline=s=>escape(s).replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g,'<a href="$2">$1</a>');
let table=false;
let index=0;
const nav=[];
const blocks=[];
for(const line of source.split(/\r?\n/)){
  if(!line.trim()){if(table){blocks.push('</tbody></table></div>');table=false;}continue;}
  if(line.startsWith('|')){
    const cells=line.split('|').slice(1,-1).map(s=>s.trim());
    if(cells.every(s=>/^[- :]+$/.test(s)))continue;
    if(!table){blocks.push('<div class="table-wrap"><table><thead><tr>'+cells.map(s=>'<th scope="col">'+inline(s)+'</th>').join('')+'</tr></thead><tbody>');table=true;}
    else blocks.push('<tr>'+cells.map(s=>'<td>'+inline(s)+'</td>').join('')+'</tr>');
  }else if(line.startsWith('# '))blocks.push('<h1>'+inline(line.slice(2))+'</h1>');
  else if(line.startsWith('## ')){index++;const title=inline(line.slice(3));nav.push('<a href="#section-'+index+'">'+title+'</a>');blocks.push('<h2 id="section-'+index+'">'+title+'</h2>');}
  else blocks.push('<p>'+inline(line)+'</p>');
}
if(table)blocks.push('</tbody></table></div>');
const css='*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:20px}body{margin:0;color:#20242b;background:#fff;font:16px/1.85 system-ui,"Malgun Gothic",sans-serif;word-break:keep-all;overflow-wrap:anywhere}main{max-width:1080px;margin:auto;padding:64px 36px}h1{font-size:36px;line-height:1.35;letter-spacing:-.04em;margin:0 0 36px}h2{font-size:25px;line-height:1.4;margin:56px 0 20px;padding-top:24px;border-top:1px solid #b9bec5}p{margin:16px 0}a{color:#234e78;text-underline-offset:3px}nav{border-block:1px solid #d5d9dd;padding:20px 0;display:flex;flex-wrap:wrap;gap:10px 24px;font-size:14px}table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.7}th,td{padding:13px;border:1px solid #d5d9dd;text-align:left;vertical-align:top}th{background:#eef0f2}tr:nth-child(even){background:#f8f9fa}.table-wrap{overflow-x:auto;margin:28px 0}@media(max-width:640px){main{padding:28px 20px}h1{font-size:28px}h2{font-size:22px}table{min-width:700px}}@media print{main{max-width:none;padding:0}nav{display:none}h2{break-after:avoid}tr{break-inside:avoid}table{font-size:10px;min-width:0}.table-wrap{overflow:visible}}';
const heading=blocks.shift();
writeFileSync(new URL('../docs/decision-intelligence-strategy.html',import.meta.url),'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Globalnow 의사결정 도구 재설계</title><style>'+css+'</style></head><body><main>'+heading+'<nav aria-label="보고서 목차">'+nav.join('')+'</nav>'+blocks.join('\n')+'</main></body></html>');
console.log('Created docs/decision-intelligence-strategy.html');
