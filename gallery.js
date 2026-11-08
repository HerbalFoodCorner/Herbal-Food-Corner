(function(){
'use strict';
const host=document.getElementById('live-gallery-grid');
if(!host)return;
const url='gallery.json?v='+Date.now();
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
fetch(url).then(r=>{if(!r.ok)throw Error('Gallery data unavailable');return r.json();}).then(data=>{
 const items=Array.isArray(data.items)?data.items.filter(x=>x.active!==false):[];
 host.innerHTML='';
 if(!items.length){host.innerHTML='<p>Gallery photos will be added soon.</p>';return;}
 const cats=[['plants','Herbal Plants'],['moments','Special Moments']];
 cats.forEach(([key,label])=>{
  const list=items.filter(x=>x.category===key);if(!list.length)return;
  const section=document.createElement('section');section.className='gallery-category';
  const h=document.createElement('h3');h.textContent=label;section.appendChild(h);
  const grid=document.createElement('div');grid.className='gallery-grid';
  list.forEach(x=>{
   const fig=document.createElement('figure');fig.className='gallery-card';
   const frame=document.createElement('div');frame.className='gallery-frame';
   const img=document.createElement('img');img.src=x.image||'';img.alt=x.title||label;img.loading='lazy';img.onerror=()=>{img.style.display='none';};
   frame.appendChild(img);fig.appendChild(frame);
   const cap=document.createElement('figcaption');
   if(x.title){const strong=document.createElement('strong');strong.textContent=x.title;cap.appendChild(strong);}
   if(x.date){const date=document.createElement('time');date.dateTime=x.date;date.textContent=x.date;cap.appendChild(date);}
   if(x.note){const note=document.createElement('p');note.textContent=x.note;cap.appendChild(note);}
   fig.appendChild(cap);grid.appendChild(fig);
  });
  section.appendChild(grid);host.appendChild(section);
 });
}).catch(()=>{host.innerHTML='<p>Gallery photos will appear here soon.</p>';});
})();
