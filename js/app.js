const PAL=['#e5626b','#f0a04b','#e8c547','#5fb37c','#4fb0c6','#7b8fe0','#b57edc','#e58bb1'];
const uid=()=>Math.random().toString(36).slice(2,9);
function DEF(){let i=0;const m=(ty,ic,n,s)=>({id:uid(),ty,ic,name:n,co:PAL[i++%8],subs:s.map(x=>({id:uid(),name:x}))});return[
m('chi','🍚','Ăn uống',['Chợ, siêu thị','Ăn ngoài','Cà phê']),
m('chi','🏠','Nhà ở, tiện ích',['Tiền nhà, trả góp','Điện, nước','Internet, điện thoại','Phí quản lý']),
m('chi','🛵','Đi lại',['Xăng xe']),
m('chi','👶','Con cái',['Sữa, tã','Học thêm','Học chính khóa','Văn phòng phẩm, sách vở','Đồ chơi, quần áo con']),
m('chi','🛍️','Mua sắm, giải trí, khác',['Mua sắm','Giải trí','Hiếu hỉ, quà biếu','Cúng, lễ Phật','Chi khác']),
m('thu','💰','Lương',['Lương chồng','Lương vợ']),
m('thu','👨‍👩‍👧','Người thân gửi',['Bố gửi','Mẹ gửi']),
m('thu','✨','Thu khác',[])]}
let S=null;try{S=JSON.parse(localStorage.getItem('vd_v1')||'null')}catch(e){}
if(!S||!S.cats)S={cats:DEF(),txs:[]};
if(!S.v2&&!S.txs.length){S.cats=DEF()}S.v2=1;
function migrate(){const R={"Chợ siêu thị": "Chợ, siêu thị", "Tiền nhà trả góp": "Tiền nhà, trả góp", "Điện nước": "Điện, nước", "Internet điện thoại": "Internet, điện thoại", "Sữa tã": "Sữa, tã", "Văn phòng phẩm sách vở": "Văn phòng phẩm, sách vở", "Đồ chơi quần áo con": "Đồ chơi, quần áo con", "Hiếu hỉ quà biếu": "Hiếu hỉ, quà biếu", "Cúng lễ phật": "Cúng, lễ Phật"};S.cats.forEach(c=>c.subs.forEach(x=>{if(R[x.name])x.name=R[x.name]}))}
const AK='vd_auto';
const autos=()=>{try{return JSON.parse(localStorage.getItem(AK)||'{}')}catch(e){return{}}};
function snap(){try{const A=autos();A[today()]=JSON.stringify(S);Object.keys(A).sort().slice(0,-14).forEach(k=>delete A[k]);localStorage.setItem(AK,JSON.stringify(A))}catch(e){}}
const persist=()=>{try{localStorage.setItem('vd_v1',JSON.stringify(S))}catch(e){}};
let CT=0;const save=()=>{persist();snap();if(S.cloudAuto){clearTimeout(CT);CT=setTimeout(()=>cloudSave(true),5000)}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>Math.round(n).toLocaleString('vi-VN')+'đ';
const pad=n=>String(n).padStart(2,'0');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
const DOW=['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
const fd=d=>{const[y,m,x]=d.split('-').map(Number);return DOW[new Date(y,m-1,x).getDay()]+', '+x+'/'+m};
const cat=id=>S.cats.find(c=>c.id===id);
const sum=(a,ty)=>a.filter(t=>t.ty===ty).reduce((s,t)=>s+t.a,0);
let tab='led',sOn=false,sQ='',sAmin='',sAmax='',sD1='',sD2='',month=today().slice(0,7),rm='m',rd=today();
let F={id:null,ty:'chi',c:'',s:'',d:today(),amt:'',n:''};
const mtx=()=>S.txs.filter(t=>t.d.startsWith(month)).sort((a,b)=>b.d.localeCompare(a.d)||b.ts-a.ts);
function mv(k){let[y,m]=month.split('-').map(Number);m+=k;if(m<1){m=12;y--}if(m>12){m=1;y++}month=y+'-'+pad(m);render()}
const mbar=()=>{const[y,m]=month.split('-');return`<div class="mb"><button onclick="mv(-1)">‹</button><span>Tháng ${+m}/${y}</span><button onclick="mv(1)">›</button></div>`};
const totals=a=>{const t=sum(a,'thu'),c=sum(a,'chi');return`<div class="card tot"><div class="t1"><small>TỔNG THU</small><b>${money(t)}</b></div><div class="t2"><small>TỔNG CHI</small><b>${money(c)}</b></div><div class="t3"><small>CÒN LẠI</small><b>${(t-c<0?'-':'')+money(Math.abs(t-c))}</b></div></div>`};

function dlg(o){const m=document.createElement('div');m.className='ov';
m.innerHTML=`<div class="dl"><h3>${esc(o.t)}</h3>${o.msg?`<p>${esc(o.msg)}</p>`:''}${o.inp?`<input id="dv" value="${esc(o.v||'')}" placeholder="${esc(o.ph||'')}">`:''}<div class="br">${o.del?'<button class="b2" id="dd">Xóa</button>':''}<button class="b3" id="dc">Hủy</button><button class="b1" id="dk">${o.ok||'Lưu'}</button></div></div>`;
document.body.appendChild(m);const x=()=>m.remove();
m.querySelector('#dc').onclick=x;
m.querySelector('#dk').onclick=()=>{const v=o.inp?m.querySelector('#dv').value.trim():null;if(o.inp&&!v)return;x();o.k(v)};
if(o.del)m.querySelector('#dd').onclick=()=>{x();o.del()};
if(o.inp)m.querySelector('#dv').focus()}
function toast(s){const t=document.createElement('div');t.className='toast';t.textContent=s;document.body.appendChild(t);setTimeout(()=>t.remove(),1600)}

/* ---- Nhập ---- */
const ICONS={'Chợ, siêu thị':'🛒','Ăn ngoài':'🍜','Cà phê':'☕','Tiền nhà, trả góp':'🏠','Điện, nước':'💡','Internet, điện thoại':'📱','Phí quản lý':'🏢','Xăng xe':'⛽','Sữa, tã':'🍼','Học thêm':'✏️','Học chính khóa':'🎒','Văn phòng phẩm, sách vở':'📚','Đồ chơi, quần áo con':'🧸','Mua sắm':'🛍️','Giải trí':'🎮','Hiếu hỉ, quà biếu':'🎁','Cúng, lễ Phật':'🙏','Chi khác':'🌸','Lương chồng':'💼','Lương vợ':'👛','Bố gửi':'👨','Mẹ gửi':'👩','Khám, thuốc men':'💊','Đưa bố':'👨'};
const subIc=(c,x)=>x.ic||ICONS[x.name]||c.ic;
const ico=e=>`<span class="ic">${e}</span>`;
function pick(c,x){F.c=c;F.s=x;render()}
function inp(){const cs=S.cats.filter(c=>c.ty===F.ty);
if(!cs.find(c=>c.id===F.c)){const f=cs[0];F.c=f?f.id:'';F.s=f&&f.subs[0]?f.subs[0].id:''}
const c=cat(F.c);if(c&&F.s&&!c.subs.find(x=>x.id===F.s))F.s='';
const sel=c&&c.subs.find(x=>x.id===F.s);
const pk=cs.map(g=>`<div class="pgh" style="border-left:6px solid ${g.co}">${g.ic} ${esc(g.name)}</div><div class="chips">`+(g.subs.length?g.subs.map(x=>`<button class="chip ${F.c==g.id&&F.s==x.id?'sel':''}" onclick="pick('${g.id}','${x.id}')">${ico(subIc(g,x))}${esc(x.name)}</button>`).join(''):`<button class="chip ${F.c==g.id&&!F.s?'sel':''}" onclick="pick('${g.id}','')">${ico(g.ic)}${esc(g.name)}</button>`)+`<button class="chip add" onclick="addSub('${g.id}')">＋</button></div>`).join('');
return`<div class="seg"><button class="chi ${F.ty=='chi'?'on':''}" onclick="F.ty='chi';render()">💸 CHI</button><button class="thu ${F.ty=='thu'?'on':''}" onclick="F.ty='thu';render()">💰 THU</button></div>
<div class="card"><label>Số tiền (đ)</label><input class="big" inputmode="numeric" placeholder="0" value="${F.amt?(+F.amt).toLocaleString('vi-VN'):''}" oninput="const v=this.value.replace(/\\D/g,'');F.amt=v;this.value=v?(+v).toLocaleString('vi-VN'):''">
<label>Ngày</label><input type="date" value="${F.d}" onchange="F.d=this.value">
<label>Ghi chú</label><input placeholder="VD: mua sữa Aptamil" value="${esc(F.n)}" oninput="F.n=this.value">
<label>Chọn mục — đang chọn: <b>${c?(sel?subIc(c,sel)+' '+esc(sel.name):c.ic+' '+esc(c.name)):'—'}</b></label>${pk}
<button class="chip" onclick="tab='mng';render()" style="margin:14px 0">✏️ Sửa / xóa nhóm &amp; mục con</button>
<button class="b1 full" onclick="saveTx()">${F.id?'💾 LƯU CHỈNH SỬA':'💾 LƯU'}</button>
${F.id?`<div class="br"><button class="b3" onclick="F={id:null,ty:'chi',c:'',s:'',d:today(),amt:'',n:''};tab='led';render()">Hủy</button><button class="b2" onclick="delTx()">Xóa khoản này</button></div>`:''}</div>`}
function saveTx(){const a=+F.amt;if(!a||!F.c||!F.d){toast('Nhập số tiền nhé');return}
const o={ty:F.ty,c:F.c,s:F.s,d:F.d,a,n:F.n.trim()};
if(F.id){Object.assign(S.txs.find(t=>t.id===F.id),o);tab='led'}else S.txs.push({id:uid(),ts:Date.now(),...o});
save();month=F.d.slice(0,7);F={id:null,ty:F.ty,c:F.c,s:'',d:F.d,amt:'',n:''};toast('Đã lưu 💖');tab='led';render();scrollTo(0,0)}
function ed(id){const t=S.txs.find(x=>x.id===id);F={id,ty:t.ty,c:t.c,s:t.s,d:t.d,amt:String(t.a),n:t.n};tab='in';render();scrollTo(0,0)}
function delTx(){dlg({t:'Xóa khoản này?',ok:'Xóa',k:()=>{S.txs=S.txs.filter(t=>t.id!==F.id);save();F={id:null,ty:'chi',c:'',s:'',d:today(),amt:'',n:''};tab='led';render()}})}

/* ---- Sổ ---- */
function toggleSearch(){sOn=!sOn;if(!sOn){sQ='';sAmin='';sAmax='';sD1='';sD2=''}render()}
function updSearch(){const el=document.getElementById('sres');if(el)el.innerHTML=searchResults()}
function amtv(el,f){const v=el.value.replace(/\D/g,'');window[f]=v;el.value=v?(+v).toLocaleString('vi-VN'):'';updSearch()}
function searchPanel(){return`<div class="card">
<input class="sf" placeholder="🔎 Tìm theo nội dung hoặc tên mục..." value="${esc(sQ)}" oninput="sQ=this.value;updSearch()">
<label>Từ ngày — đến ngày (bỏ trống nếu không giới hạn)</label>
<div class="sg"><input type="date" value="${sD1}" onchange="sD1=this.value;updSearch()"><input type="date" value="${sD2}" onchange="sD2=this.value;updSearch()"></div>
<label>Số tiền từ — đến (đ)</label>
<div class="sg"><input inputmode="numeric" placeholder="0" value="${sAmin?(+sAmin).toLocaleString('vi-VN'):''}" oninput="amtv(this,'sAmin')"><input inputmode="numeric" placeholder="Không giới hạn" value="${sAmax?(+sAmax).toLocaleString('vi-VN'):''}" oninput="amtv(this,'sAmax')"></div>
</div>`}
function searchResults(){const q=sQ.trim().toLowerCase();
const R=S.txs.filter(t=>{if(sD1&&t.d<sD1)return false;if(sD2&&t.d>sD2)return false;
if(sAmin&&t.a<+sAmin)return false;if(sAmax&&t.a>+sAmax)return false;
if(q){const c=cat(t.c),x=c&&c.subs.find(y=>y.id===t.s);const hay=((t.n||'')+' '+(x?x.name:'')+' '+(c?c.name:'')).toLowerCase();if(!hay.includes(q))return false}
return true}).sort((a,b)=>b.d.localeCompare(a.d)||b.ts-a.ts);
let h='';if(!R.length)return h+'<div class="empty">Không tìm thấy khoản nào phù hợp 🔎</div>';
h+=totals(R);const days={};R.forEach(t=>(days[t.d]=days[t.d]||[]).push(t));
Object.keys(days).sort().reverse().forEach(d=>{const L=days[d],n=sum(L,'thu')-sum(L,'chi');
h+=`<div class="card"><div class="dh"><span>${fd(d)}</span><span>${n<0?'-':n>0?'+':''}${money(Math.abs(n))}</span></div>`;
L.forEach(t=>{const c=cat(t.c),x=c&&c.subs.find(q2=>q2.id===t.s);const ic=c?(x?subIc(c,x):c.ic):'🏷️',nm=c?(x?x.name:c.name):'Mục đã xóa';
h+=`<div class="tr" onclick="ed('${t.id}')"><span class="ti">${ic}</span><div class="ct"><b>${esc(nm)}</b>${t.n?`<em>${esc(t.n)}</em>`:''}</div><span class="am ${t.ty}"><i class="tg">${t.ty=='thu'?'Thu':'Chi'}</i>${money(t.a)}</span></div>`});
h+='</div>'});
return h+`<div class="empty">Tìm thấy ${R.length} khoản. Chạm vào một khoản để sửa nhanh ✏️</div>`}
function led(){const sb=`<button class="chip" style="float:right" onclick="toggleSearch()">${sOn?'✕ Đóng tìm kiếm':'🔎 Tìm kiếm'}</button><div style="clear:both"></div>`;
if(sOn)return sb+searchPanel()+`<div id="sres">${searchResults()}</div>`;
const a=mtx();let h=sb+mbar()+totals(a);
if(!a.length)return h+'<div class="empty">Chưa có khoản nào trong tháng này 🌷</div>';
const days={};a.forEach(t=>(days[t.d]=days[t.d]||[]).push(t));
Object.keys(days).sort().reverse().forEach(d=>{const L=days[d],n=sum(L,'thu')-sum(L,'chi');
h+=`<div class="card"><div class="dh"><span>${fd(d)}</span><span>${n<0?'-':n>0?'+':''}${money(Math.abs(n))}</span></div>`;
L.forEach(t=>{const c=cat(t.c),x=c&&c.subs.find(q=>q.id===t.s);const ic=c?(x?subIc(c,x):c.ic):'🏷️',nm=c?(x?x.name:c.name):'Mục đã xóa';
h+=`<div class="tr" onclick="ed('${t.id}')"><span class="ti">${ic}</span><div class="ct"><b>${esc(nm)}</b>${t.n?`<em>${esc(t.n)}</em>`:''}</div><span class="am ${t.ty}"><i class="tg">${t.ty=='thu'?'Thu':'Chi'}</i>${money(t.a)}</span></div>`});
h+='</div>'});
return h+'<div class="empty">Chạm vào một khoản để sửa nhanh ✏️</div>'}

/* ---- Báo cáo ---- */
function bd(a,ty){const L=a.filter(t=>t.ty===ty),tot=sum(a,ty);if(!L.length)return'';
const g={};L.forEach(t=>{const o=g[t.c]=g[t.c]||{s:0,sub:{}};o.s+=t.a;o.sub[t.s]=(o.sub[t.s]||0)+t.a});
const E=Object.entries(g).sort((x,y)=>y[1].s-x[1].s);let cum=0;
const seg=E.map(([id,v])=>{const c=cat(id),p=v.s/tot*100,r=(c?c.co:'#999')+' '+cum+'% '+(cum+p)+'%';cum+=p;return r}).join(',');
let h=`<div class="card"><h2 class="${ty}">${ty=='chi'?'CÁC KHOẢN CHI':'CÁC KHOẢN THU'}</h2><div class="pie" style="background:conic-gradient(${seg})"><span>${ty=='chi'?'CHI':'THU'}</span></div>`;
E.forEach(([id,v])=>{const c=cat(id),p=Math.round(v.s/tot*100),co=c?c.co:'#999';
h+=`<div class="bi"><div class="rw"><b><i class="dot" style="background:${co}"></i>${c?c.ic:'🏷️'} ${esc(c?c.name:'Mục đã xóa')} · ${p}%</b><b>${money(v.s)}</b></div><div class="bar"><i style="width:${p}%;background:${co}"></i></div>`;
Object.entries(v.sub).sort((x,y)=>y[1]-x[1]).forEach(([sid,m])=>{const x=c&&c.subs.find(q=>q.id==sid);h+=`<div class="rw sb"><span>${x?ico(subIc(c,x))+esc(x.name):'Chung'}</span><span>${money(m)}</span></div>`});
h+='</div>'});return h+'</div>'}
function cmp(a){const t=sum(a,'thu'),c=sum(a,'chi');if(!t)return'';const r=Math.round(c/t*100),p=Math.min(100,c/t*100);
return`<div class="card"><h2>🥧 SO SÁNH THU – CHI</h2><div class="pie" style="background:conic-gradient(var(--chi) 0% ${p}%,var(--thu) ${p}% 100%)"><span>${r}%</span></div><div class="rw"><b style="color:var(--chi)">● Đã chi ${r}% thu nhập</b></div><div class="rw"><b style="color:var(--thu)">● ${c<=t?'Còn lại '+(100-r)+'%':'Chi vượt '+(r-100)+'%'}</b></div></div>`}
function advice(a){const t=sum(a,'thu'),c=sum(a,'chi'),tips=[];
if(!a.length)return['Hãy ghi chép đều đặn mỗi ngày để cuối tháng nhìn rõ tiền đi đâu nhé 🌷'];
if(t===0)tips.push('Tháng này chưa ghi khoản thu nào. Nhớ ghi đủ thu để số liệu chính xác.');
if(t>0&&c>t)tips.push(`Chi vượt thu ${money(c-t)}. Hãy xem lại các khoản chưa thật cần thiết và đặt hạn mức cho tháng sau.`);
if(t>0&&c<=t){const r=(t-c)/t;tips.push(r>=.2?`Tuyệt vời! Cả nhà để dành được ${Math.round(r*100)}% thu nhập 🎉 Hãy duy trì và gửi tiết kiệm sớm.`:`Mới để dành ${Math.round(r*100)}% thu nhập. Nên hướng tới 20%: chuyển tiết kiệm ngay khi có lương.`)}
const g={};a.filter(x=>x.ty=='chi').forEach(x=>g[x.c]=(g[x.c]||0)+x.a);
const top=Object.entries(g).sort((x,y)=>y[1]-x[1])[0];
if(top&&c>0){const p=Math.round(top[1]/c*100),k=cat(top[0]);if(p>=40)tips.push(`Nhóm "${k?k.name:'Mục đã xóa'}" chiếm ${p}% tổng chi. Thử xem có thể cắt giảm phần nào.`)}
tips.push('Gợi ý: ~50% thu nhập cho nhu cầu thiết yếu, ~30% mong muốn, ~20% tiết kiệm.');return tips}
const tipsCard=a=>`<div class="card"><h2>💡 NHẮC NHỞ CHI TIÊU THÁNG NÀY</h2>${advice(a).map(x=>`<div class="tip">${esc(x)}</div>`).join('')}</div>`;
const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const pd=x=>{const[y,m,d]=x.split('-').map(Number);return new Date(y,m-1,d)};
const addD=(x,k)=>{const d=pd(x);d.setDate(d.getDate()+k);return ds(d)};
const mon=x=>addD(x,-((pd(x).getDay()+6)%7));
const sd=x=>{const d=pd(x);return d.getDate()+'/'+(d.getMonth()+1)};
let rw=mon(today()),ry=new Date().getFullYear();
function wk(k){rw=addD(rw,7*k);render()}
const dayRow=(l,L)=>`<div class="rw" style="padding:6px 0;border-bottom:1px solid var(--line)"><b>${l}</b><span>${L.length?`<span style="color:var(--thu)">+${money(sum(L,'thu'))}</span> · <span style="color:var(--chi)">-${money(sum(L,'chi'))}</span>`:'—'}</span></div>`;
function rep(){const B=(k,t)=>`<button class="${rm==k?'on':''}" onclick="rm='${k}';render()">${t}</button>`;
let h=`<div class="seg">${B('w','🗓️ Tuần')}${B('m','🌙 Tháng')}${B('y','🎀 Năm')}</div>`;
if(rm=='w'){const e=addD(rw,6),a=S.txs.filter(t=>t.d>=rw&&t.d<=e);
h+=`<div class="mb"><button onclick="wk(-1)">‹</button><span>Tuần ${sd(rw)} – ${sd(e)}</span><button onclick="wk(1)">›</button></div>`+totals(a)+cmp(a);
h+='<div class="card"><h2>🗓️ TỪNG NGÀY TRONG TUẦN</h2>';
for(let i=0;i<7;i++){const d=addD(rw,i);h+=dayRow(fd(d),a.filter(t=>t.d==d))}
return h+'</div>'+(a.length?bd(a,'chi')+bd(a,'thu'):'<div class="empty">Tuần này chưa có khoản nào 🌷</div>')}
if(rm=='y'){const a=S.txs.filter(t=>t.d.startsWith(ry+'-'));
h+=`<div class="mb"><button onclick="ry--;render()">‹</button><span>Năm ${ry}</span><button onclick="ry++;render()">›</button></div>`+totals(a)+cmp(a);
h+='<div class="card"><h2>🗓️ TỪNG THÁNG TRONG NĂM</h2>';
for(let m=1;m<=12;m++)h+=dayRow('Tháng '+m,a.filter(t=>t.d.startsWith(ry+'-'+pad(m)+'-')));
return h+'</div>'+(a.length?bd(a,'chi')+bd(a,'thu'):'<div class="empty">Năm này chưa có khoản nào 🌷</div>')}
const a=mtx();return h+mbar()+totals(a)+cmp(a)+bd(a,'chi')+bd(a,'thu')+tipsCard(a)}

/* ---- Sao lưu ---- */
const getCode=()=>JSON.stringify({app:'chi-tieu-gia-dinh',at:new Date().toISOString(),data:S});
function bak(){const A=autos(),ks=Object.keys(A).sort().reverse();
return`<div class="card"><h2>🛡️ DỮ LIỆU CỦA BẠN Ở ĐÂU?</h2><p>Dữ liệu đang nằm <b>ngay trong Safari của chiếc điện thoại này</b>. Nếu điện thoại hỏng, mất, hoặc bạn xóa dữ liệu Safari thì dữ liệu trong máy sẽ mất theo. Vì vậy hãy lưu thêm <b>ít nhất một bản ở nơi khác</b> (mục 2, 3 hoặc 4 bên dưới).</p></div>
<div class="card"><h2>1️⃣ 🕒 BẢN TỰ ĐỘNG TRONG MÁY</h2><p>App tự chụp lại dữ liệu mỗi ngày và giữ 14 ngày gần nhất. Bạn không cần làm gì.</p><div class="tip"><b>Dùng khi:</b> lỡ tay xóa nhầm khoản hoặc mục và muốn quay lại như hôm trước.<br><b>Không cứu được khi:</b> hỏng máy hoặc xóa Safari, vì các bản này nằm cùng chỗ với dữ liệu.</div>${ks.length?ks.map(k=>{let n=0;try{n=JSON.parse(A[k]).txs.length}catch(e){}return`<div class="sr"><span>📅 ${fd(k)} · ${n} khoản</span><button class="ib" style="width:auto;padding:0 12px;font-size:16px" onclick="restoreAuto('${k}')">Khôi phục</button></div>`}).join(''):'<div class="empty">Chưa có bản lưu nào.</div>'}</div>
<div class="card"><h2>2️⃣ ☁️ LƯU LÊN TÀI KHOẢN CLAUDE</h2><p>Gửi một bản sao lên tài khoản Claude của bạn, riêng tư, chỉ bạn xem được. Bản này nằm ngoài điện thoại nên vẫn còn khi máy hỏng hoặc xóa Safari.</p><div class="tip"><b>Dùng khi:</b> đổi hoặc mất điện thoại. Chỉ cần đăng nhập cùng tài khoản Claude, mở lại app này rồi bấm "Lấy lại từ tài khoản".<br><b>Lưu ý:</b> chỉ dùng được khi bạn mở app trong tài khoản Claude của mình; nếu máy báo chưa dùng được thì hãy dùng mục 3 hoặc 4.</div>${S.lastCloud?`<p>💖 Lần lưu gần nhất: <b>${esc(S.lastCloud)}</b></p>`:'<p>🌷 Chưa lưu lên tài khoản lần nào.</p>'}
<button class="b1 full" onclick="cloudSave()">☁️ Lưu lên tài khoản ngay</button><div style="height:8px"></div><button class="b3 full" onclick="cloudGet()">⬇️ Lấy lại từ tài khoản</button><div style="height:8px"></div><button class="b3 full" onclick="S.cloudAuto=!S.cloudAuto;save();render()">${S.cloudAuto?'✅ Đang tự động lưu sau mỗi lần ghi (bấm để tắt)':'⬜ Bật tự động lưu sau mỗi lần ghi'}</button></div>
<div class="card"><h2>3️⃣ 📁 LƯU THÀNH FILE</h2><p>Tạo một file <b>.json</b> chứa toàn bộ dữ liệu. Khi hiện bảng lưu, bạn chọn nơi cất: <b>iCloud Drive</b> (an toàn nhất vì nằm trên đám mây của Apple), hoặc <b>Lưu vào Tệp</b>.</p><div class="tip"><b>Dùng khi:</b> muốn giữ một file để cất riêng hoặc chuyển sang máy khác. Lấy lại bằng mục 5.</div><button class="b1 full" onclick="fileBak()">📁 Lưu file về máy</button></div>
<div class="card"><h2>4️⃣ 📤 GỬI MÃ SAO LƯU</h2><p>Biến dữ liệu thành một đoạn mã chữ. Bạn gửi đoạn mã này vào <b>Ghi chú</b> (đồng bộ iCloud), <b>Zalo (Cloud của tôi)</b> hoặc email cho chính mình.</p><div class="tip"><b>Dùng khi:</b> muốn cách đơn giản nhất, không cần cài gì. Lấy lại bằng mục 5: dán đoạn mã vào ô khôi phục.</div>${S.lastBak?`<p>💖 Lần gửi gần nhất: <b>${esc(S.lastBak)}</b></p>`:''}<button class="b1 full" onclick="shareBak()">📤 Gửi / lưu mã sao lưu</button><div style="height:8px"></div><button class="b3 full" onclick="copyBak()">📋 Sao chép mã sao lưu</button><textarea id="bk" readonly onfocus="this.select()">${esc(getCode())}</textarea></div>
<div class="card"><h2>5️⃣ ♻️ KHÔI PHỤC / NHẬP DỮ LIỆU</h2><p>Dùng khi đổi máy hoặc mất dữ liệu. Có hai cách:</p><p><b>Cách A:</b> chọn file .json đã lưu (mục 3, hoặc file cũ từ app trước).</p><input type="file" accept=".json,application/json,text/plain" onchange="impFile(this)"><p><b>Cách B:</b> dán đoạn mã đã gửi ở mục 4.</p><textarea id="rs" placeholder="Dán mã sao lưu vào đây..."></textarea><button class="b1 full" onclick="restore()">♻️ Khôi phục từ mã</button><div class="tip" style="margin-top:10px"><b>Lưu ý:</b> bản sao lưu của app này sẽ <b>thay toàn bộ</b> dữ liệu hiện tại. File cũ (loại có mục "tx") thì được <b>thêm vào</b>, không xóa gì và không bị trùng khi nhập lại.</div></div>`}
const cpath=id=>'data/users/'+CL.uid+'/'+id;let CL=null;
// Mục "Lưu lên tài khoản Claude" chỉ hoạt động khi mở trong ứng dụng/artifact của Claude.
// Khi tự host (GitHub Pages, Netlify...), window.claude sẽ không tồn tại nên mục này tự ẩn tác dụng, các mục 3/4/5 vẫn dùng bình thường.
async function cloud(){if(CL)return CL;try{if(!window.claude||!claude.use)return null;const db=await claude.use('db'),u=await claude.use('user');if(!db||!u)return null;const uid=await u.id();if(!uid)return null;CL={db,uid};return CL}catch(e){return null}}
async function cloudSave(silent){const c=await cloud();if(!c){if(!silent)toast('Chưa dùng được mục này 🙈');return}
try{const code=getCode(),N=200000,parts=[];for(let i=0;i<code.length;i+=N)parts.push(code.slice(i,i+N));
for(let i=0;i<parts.length;i++)await c.db.doc(cpath('p'+i)).set({t:parts[i]});
await c.db.doc(cpath('meta')).set({n:parts.length,at:new Date().toISOString(),tx:S.txs.length});
const d=new Date();S.lastCloud=fd(today())+' ('+d.getHours()+':'+pad(d.getMinutes())+')';persist();
if(!silent){toast('Đã lưu lên tài khoản ☁️');render()}}catch(e){if(!silent)toast('Không lưu được ('+(e&&e.code||'lỗi')+') 🙈')}}
async function cloudGet(){const c=await cloud();if(!c){toast('Chưa dùng được mục này 🙈');return}
try{const m=await c.db.doc(cpath('meta')).get();if(!m.exists){toast('Chưa có bản lưu trên tài khoản 🌷');return}
const n=m.data().n;let t='';for(let i=0;i<n;i++){const d=await c.db.doc(cpath('p'+i)).get();t+=d.data().t}loadText(t)}catch(e){toast('Không lấy được ('+(e&&e.code||'lỗi')+') 🙈')}}
function browserDownload(text,filename){const blob=new Blob([text],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
async function fileBak(){const filename='chi-tieu-gia-dinh-'+today()+'.json',code=getCode();
try{if(window.claude&&claude.use){const d=await claude.use('downloads');if(d){await d.save({filename,data:code});markBak();render();return}}}catch(e){if(e&&e.code=='declined')return}
try{browserDownload(code,filename);markBak();render()}catch(e){toast('Không lưu được file, hãy dùng mục 4 🙈')}}
function restoreAuto(k){const A=autos();let o;try{o=JSON.parse(A[k])}catch(e){toast('Không đọc được bản lưu 🙈');return}
dlg({t:'Khôi phục bản ngày '+fd(k)+'?',msg:'Có '+o.txs.length+' khoản. Dữ liệu hiện tại sẽ được thay bằng bản này.',ok:'Khôi phục',k:()=>{S=o;S.v2=1;migrate();save();toast('Đã khôi phục 💖');tab='led';render()}})}
function markBak(){S.lastBak=fd(today())+' ('+new Date().getHours()+':'+pad(new Date().getMinutes())+')';save()}
function copyBak(){const c=getCode();const fb=()=>{const t=document.getElementById('bk');if(t){t.select();t.setSelectionRange(0,c.length);try{document.execCommand('copy');toast('Đã sao chép 💖');markBak();render()}catch(e){toast('Hãy giữ ô mã và chọn Sao chép')}}};
try{navigator.clipboard.writeText(c).then(()=>{toast('Đã sao chép 💖');markBak();render()},fb)}catch(e){fb()}}
function shareBak(){const c=getCode();if(navigator.share){navigator.share({title:'Sao lưu CHI TIÊU GIA ĐÌNH',text:c}).then(()=>{markBak();render()}).catch(()=>{})}else copyBak()}
const OLD={an:['chi','Ăn uống','Ăn ngoài'],cho:['chi','Ăn uống','Chợ, siêu thị'],nha:['chi','Nhà ở, tiện ích','Tiền nhà, trả góp'],dn:['chi','Nhà ở, tiện ích','Điện, nước'],mang:['chi','Nhà ở, tiện ích','Internet, điện thoại'],pql:['chi','Nhà ở, tiện ích','Phí quản lý'],dl:['chi','Đi lại','Xăng xe'],con:['chi','Con cái','Đồ chơi, quần áo con'],dc:['chi','Con cái','Đồ chơi, quần áo con'],sua:['chi','Con cái','Sữa, tã'],ht:['chi','Con cái','Học thêm'],hoc:['chi','Con cái','Học chính khóa'],vpp:['chi','Con cái','Văn phòng phẩm, sách vở'],ms:['chi','Mua sắm, giải trí, khác','Mua sắm'],gt:['chi','Mua sắm, giải trí, khác','Giải trí'],hh:['chi','Mua sắm, giải trí, khác','Hiếu hỉ, quà biếu'],cung:['chi','Mua sắm, giải trí, khác','Cúng, lễ Phật'],kc:['chi','Mua sắm, giải trí, khác','Chi khác'],sk:['chi','Sức khỏe','Khám, thuốc men'],bo:['chi','Đưa bố','Đưa bố'],bogui:['thu','Người thân gửi','Bố gửi'],tc:['thu','Thu khác','']};
function findCat(ty,g,sn){let c=S.cats.find(x=>x.ty==ty&&x.name==g);if(!c){c={id:uid(),ty,ic:g=='Sức khỏe'?'💊':g=='Đưa bố'?'👨':'🌷',name:g,co:PAL[S.cats.length%8],subs:[]};S.cats.push(c)}
let x=null;if(sn){x=c.subs.find(q=>q.name==sn);if(!x){x={id:uid(),name:sn};c.subs.push(x)}}return[c.id,x?x.id:'']}
function impOld(o){const have=new Set(S.txs.map(t=>t.id));let n=0,k=0,last='';
o.tx.forEach((t,i)=>{if(!t||have.has(t.id)||!t.date||!(+t.amount>0)){k++;return}
const m=OLD[t.cat]||(t.type=='thu'?['thu','Thu khác','']:['chi','Mua sắm, giải trí, khác','Chi khác']);const[c,s]=findCat(m[0],m[1],m[2]);
S.txs.push({id:t.id||uid(),ts:Date.now()+i,ty:m[0],c,s,d:t.date,a:+t.amount,n:t.note||''});n++;if(t.date>last)last=t.date});
save();if(last)month=last.slice(0,7);return[n,k]}
function loadText(v){let o;try{o=JSON.parse(v)}catch(e){toast('File / mã không hợp lệ 🙈');return}
if(o&&Array.isArray(o.tx)){const[n,k]=impOld(o);tab='led';toast('Đã nhập '+n+' khoản 💖'+(k?' (bỏ qua '+k+' khoản trùng)':''));render();scrollTo(0,0);return}
if(o&&o.data)o=o.data;if(!o||!Array.isArray(o.cats)||!Array.isArray(o.txs)){toast('File / mã không hợp lệ 🙈');return}
dlg({t:'Khôi phục dữ liệu?',msg:'Có '+o.txs.length+' khoản trong bản sao lưu. Dữ liệu hiện tại sẽ bị thay thế.',ok:'Khôi phục',k:()=>{S=o;S.v2=1;migrate();save();toast('Đã khôi phục 💖');tab='led';render()}})}
function restore(){loadText(document.getElementById('rs').value.trim())}
function impFile(el){const f=el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>loadText(String(r.result));r.readAsText(f)}

/* ---- Mục ---- */
const parseN=v=>{const m=v.match(/^(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)\s*(.*)$/u);return m&&m[2]?{ic:m[1],name:m[2]}:{ic:'',name:v}};
const withIc=(ic,n)=>(ic?ic+' ':'')+n;
function addSub(cid){const c=cat(cid);if(!c)return;dlg({t:'Thêm mục con cho '+c.name,inp:1,ph:'Tên mục (có thể gõ 🍜 ở đầu)',k:v=>{const p=parseN(v),x={id:uid(),name:p.name};if(p.ic)x.ic=p.ic;c.subs.push(x);if(tab=='in'){F.c=cid;F.s=x.id}save();render()}})}
function editSub(cid,sid){const c=cat(cid),x=c.subs.find(q=>q.id==sid);dlg({t:'Đổi tên / biểu tượng',inp:1,v:withIc(subIc(c,x),x.name),k:v=>{const p=parseN(v);x.name=p.name;if(p.ic)x.ic=p.ic;save();render()}})}
function delSub(cid,sid){const c=cat(cid),x=c.subs.find(q=>q.id==sid);dlg({t:'Xóa mục "'+x.name+'"?',msg:'Các khoản đã ghi vẫn được giữ lại.',ok:'Xóa',k:()=>{c.subs=c.subs.filter(q=>q.id!=sid);save();render()}})}
function editCat(cid){const c=cat(cid);dlg({t:'Đổi tên / biểu tượng nhóm',inp:1,v:withIc(c.ic,c.name),k:v=>{const p=parseN(v);c.name=p.name;if(p.ic)c.ic=p.ic;save();render()}})}
function delCat(cid){const c=cat(cid);dlg({t:'Xóa nhóm "'+c.name+'"?',msg:'Các khoản đã ghi thuộc nhóm này vẫn được giữ lại nhưng hiện là "Mục đã xóa".',ok:'Xóa',k:()=>{S.cats=S.cats.filter(x=>x.id!=cid);save();render()}})}
function addCat(ty){dlg({t:ty=='chi'?'Thêm nhóm chi':'Thêm nhóm thu',inp:1,ph:'Tên nhóm (có thể gõ 🌷 ở đầu)',k:v=>{const p=parseN(v);S.cats.push({id:uid(),ty,ic:p.ic||(ty=='chi'?'🌷':'🌼'),name:p.name,co:PAL[S.cats.length%8],subs:[]});save();render()}})}
function mng(){let h='<div class="card" style="background:#fff1c9;color:#5a3d0a">✏️ đổi tên &nbsp; 🗑️ xóa — bấm nút bên phải mỗi nhóm hoặc mục. Muốn đổi hình, gõ biểu tượng ở đầu tên, ví dụ <b>🍜 Phở</b>.</div>';
[['chi','KHOẢN CHI'],['thu','KHOẢN THU']].forEach(([ty,lb])=>{h+=`<h2 class="${ty}" style="margin:6px 4px">${lb}</h2>`;
S.cats.filter(c=>c.ty==ty).forEach(c=>{h+=`<div class="card" style="border-left:8px solid ${c.co}"><div class="gh"><span>${c.ic} ${esc(c.name)}</span><span><button class="ib" onclick="editCat('${c.id}')">✏️</button><button class="ib" onclick="delCat('${c.id}')">🗑️</button></span></div>`+
c.subs.map(x=>`<div class="sr"><span>${ico(subIc(c,x))}${esc(x.name)}</span><span><button class="ib" onclick="editSub('${c.id}','${x.id}')">✏️</button><button class="ib" onclick="delSub('${c.id}','${x.id}')">🗑️</button></span></div>`).join('')+
`<button class="chip add" style="margin-top:10px" onclick="addSub('${c.id}')">＋ Thêm mục con</button></div>`});
h+=`<button class="b1 full" style="margin-bottom:16px" onclick="addCat('${ty}')">＋ Thêm nhóm ${ty}</button>`});
return h}

function render(){
const V={in:inp,led,rep,mng,bak};
$app.innerHTML='<h1>CHI TIÊU GIA ĐÌNH</h1><p class="sub">🌸 Ghi chép mỗi ngày, cả nhà ấm no 🌸</p>'+V[tab]();
$tb.innerHTML=[['led','📒','Sổ'],['rep','📊','Báo cáo'],['in','+',''],['mng','🏷️','Mục'],['bak','💾','Sao lưu']].map(([k,i,n])=>k=='in'?`<button class="plus ${tab=='in'?'on':''}" aria-label="Thêm khoản mới" onclick="tab='in';render();scrollTo(0,0)">+</button>`:`<button class="${tab==k?'on':''}" onclick="tab='${k}';render();scrollTo(0,0)"><b>${i}</b>${n}</button>`).join('')}
const $app=document.getElementById('app'),$tb=document.getElementById('tb');
migrate();save();render();snap();try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
