import { readFileSync, writeFileSync } from 'node:fs';
const input = readFileSync(new URL('../docs/research/report-source.md', import.meta.url), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const inline = value => escape(value).replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
const lines = input.split('\n');
let table = false;
const blocks = [];
for (const line of lines) {
  if (!line.trim()) { if (table) { blocks.push('</tbody></table></div>'); table = false; } continue; }
  if (line.startsWith('|')) {
    const cells = line.split('|').slice(1, -1).map(value => value.trim());
    if (cells.every(value => /^[- :]+$/.test(value))) continue;
    if (!table) { blocks.push('<div class="table-wrap"><table><thead><tr>' + cells.map(value => `<th scope="col">${inline(value)}</th>`).join('') + '</tr></thead><tbody>'); table = true; }
    else blocks.push('<tr>' + cells.map(value => `<td>${inline(value)}</td>`).join('') + '</tr>');
  } else if (line.startsWith('# ')) blocks.push(`<p class="eyebrow">GLOBALNOW · PRODUCT QUALITY REVIEW</p><h1>${inline(line.slice(2))}</h1>`);
  else if (line.startsWith('## ')) blocks.push(`<h2>${inline(line.slice(3))}</h2>`);
  else blocks.push(`<p>${inline(line)}</p>`);
}
if (table) blocks.push('</tbody></table></div>');
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Globalnow UX·UI 개선 연구</title><style>
:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f1f4f8;color:#182438;font:16px/1.8 -apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif;word-break:keep-all;overflow-wrap:anywhere}main{max-width:1120px;margin:40px auto;background:white;padding:64px;border-top:6px solid #205ed0;box-shadow:0 8px 40px #2335510b}.eyebrow{font-size:12px;letter-spacing:.16em;color:#2055ae;font-weight:700}h1{font-size:38px;line-height:1.3;letter-spacing:-.04em;margin:18px 0 24px}h2{font-size:24px;line-height:1.4;margin:52px 0 18px;padding-top:20px;border-top:1px solid #dbe1e9}p{margin:14px 0;color:#334155}a{color:#164ca5;text-underline-offset:3px}a:focus-visible{outline:3px solid #205ed0;outline-offset:3px}.table-wrap{overflow-x:auto;margin:24px 0}table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.65}th{background:#edf3fc;text-align:left;color:#173764}td,th{padding:13px 14px;border-bottom:1px solid #dbe3ed;vertical-align:top}tr:nth-child(even){background:#f8fafc}footer{margin-top:48px;padding-top:20px;border-top:1px solid #dbe3ed;font-size:13px;color:#536274}@media(max-width:700px){main{padding:28px 20px;margin:0}h1{font-size:29px}h2{font-size:22px}table{min-width:640px}}@media print{body{background:white}main{margin:0;padding:0;border:0;box-shadow:none}h2{break-after:avoid}tr{break-inside:avoid}a{color:inherit}.table-wrap{overflow:visible}table{min-width:0;font-size:10px}}
</style></head><body><main>${blocks.join('\n')}<footer>코드 감사와 공개 1차 근거를 바탕으로 작성했습니다. 실제 이용자 연구·운영 이탈률·1만 동접 시험 결과를 대체하지 않습니다.</footer></main></body></html>`;
writeFileSync(new URL('../docs/ux-review-2026-09-08.html', import.meta.url), html);
console.log('Created docs/ux-review-2026-09-08.html');
