
(function(){
'use strict';

const host = document.getElementById('live-gallery-grid');
if(!host) return;

const lang = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];

const translations = {
 en: {
  plants: 'Herbal Plants',
  moments: 'Special Moments',
  empty: 'Gallery photos will be added soon.',
  error: 'Gallery photos will appear here soon.'
 },
 si: {
  plants: 'ඖෂධීය පැළෑටි',
  moments: 'විශේෂ අවස්ථා',
  empty: 'ගැලරියේ ඡායාරූප ඉක්මනින් එකතු කරනු ලැබේ.',
  error: 'ගැලරියේ ඡායාරූප ඉක්මනින් මෙහි පෙන්වනු ලැබේ.'
 },
 ta: {
  plants: 'மூலிகைத் தாவரங்கள்',
  moments: 'சிறப்பு தருணங்கள்',
  empty: 'காட்சியகப் படங்கள் விரைவில் சேர்க்கப்படும்.',
  error: 'காட்சியகப் படங்கள் விரைவில் இங்கே காண்பிக்கப்படும்.'
 }
};

const t = translations[lang] || translations.en;

function localized(value){
 if(value && typeof value === 'object'){
  return value[lang] || value.en || value.si || value.ta || '';
 }
 return value || '';
}

const url = 'gallery.json?v=' + Date.now();

fetch(url)
.then(response => {
 if(!response.ok) throw Error('Gallery data unavailable');
 return response.json();
})
.then(data => {
 const items = Array.isArray(data.items)
  ? data.items.filter(x => x.active !== false)
  : [];

 host.innerHTML = '';

 if(!items.length){
  host.textContent = t.empty;
  return;
 }

 const categories = [
  ['plants', t.plants],
  ['moments', t.moments]
 ];

 categories.forEach(([key,label]) => {
  const list = items.filter(x => x.category === key);
  if(!list.length) return;

  const section = document.createElement('section');
  section.className = 'gallery-category';

  const heading = document.createElement('h3');
  heading.textContent = label;
  section.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  list.forEach(x => {
   const fig = document.createElement('figure');
   fig.className = 'gallery-card';

   const frame = document.createElement('div');
   frame.className = 'gallery-frame';

   const img = document.createElement('img');
   const title = localized(x.title);

   img.src = x.image || '';
   img.alt = title || label;
   img.loading = 'lazy';
   img.onerror = () => {
    img.style.display = 'none';
   };

   frame.appendChild(img);
   fig.appendChild(frame);

   const cap = document.createElement('figcaption');

   if(title){
    const strong = document.createElement('strong');
    strong.textContent = title;
    cap.appendChild(strong);
   }

   if(x.date){
    const date = document.createElement('time');
    date.dateTime = x.date;
    date.textContent = x.date;
    cap.appendChild(date);
   }

   const note = localized(x.note);

   if(note){
    const paragraph = document.createElement('p');
    paragraph.textContent = note;
    cap.appendChild(paragraph);
   }

   fig.appendChild(cap);
   grid.appendChild(fig);
  });

  section.appendChild(grid);
  host.appendChild(section);
 });
})
.catch(() => {
 host.textContent = t.error;
});

})();
