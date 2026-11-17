
(function(){
'use strict';

const galleryHost = document.getElementById('live-gallery-grid');
const momentsHost = document.getElementById('live-special-moments-grid');

if(!galleryHost && !momentsHost) return;

const lang = (document.documentElement.lang || 'en')
 .toLowerCase().split('-')[0];

const translations = {
 en: {
  galleryEmpty: 'Herbal plant photos will be added soon.',
  momentsEmpty: 'Special Moments photos will be added soon.',
  error: 'Photos will appear here soon.'
 },
 si: {
  galleryEmpty: 'ඖෂධීය පැළෑටිවල ඡායාරූප ඉක්මනින් එකතු කරනු ලැබේ.',
  momentsEmpty: 'විශේෂ අවස්ථාවල ඡායාරූප ඉක්මනින් එකතු කරනු ලැබේ.',
  error: 'ඡායාරූප ඉක්මනින් මෙහි පෙන්වනු ලැබේ.'
 },
 ta: {
  galleryEmpty: 'மூலிகைத் தாவரங்களின் படங்கள் விரைவில் சேர்க்கப்படும்.',
  momentsEmpty: 'சிறப்புத் தருணங்களின் படங்கள் விரைவில் சேர்க்கப்படும்.',
  error: 'படங்கள் விரைவில் இங்கே காண்பிக்கப்படும்.'
 }
};

const t = translations[lang] || translations.en;

function localized(value){
 if(value && typeof value === 'object'){
  return value[lang] || value.en || value.si || value.ta || '';
 }
 return value || '';
}

function renderItems(host, items, emptyText){
 if(!host) return;

 host.innerHTML = '';

 if(!items.length){
  host.textContent = emptyText;
  return;
 }

 const grid = document.createElement('div');
 grid.className = 'gallery-grid';

 items.forEach(item => {
  const figure = document.createElement('figure');
  figure.className = 'gallery-card';

  const frame = document.createElement('div');
  frame.className = 'gallery-frame';

  const img = document.createElement('img');
  const title = localized(item.title);

  img.src = item.image || '';
  img.alt = title || 'Herbal Food Corner';
  img.loading = 'lazy';
  img.onerror = () => {
   img.style.display = 'none';
  };

  frame.appendChild(img);
  figure.appendChild(frame);

  const caption = document.createElement('figcaption');

  if(title){
   const strong = document.createElement('strong');
   strong.textContent = title;
   caption.appendChild(strong);
  }

  if(item.date){
   const date = document.createElement('time');
   date.dateTime = item.date;
   date.textContent = item.date;
   caption.appendChild(date);
  }

  const note = localized(item.note);

  if(note){
   const paragraph = document.createElement('p');
   paragraph.textContent = note;
   caption.appendChild(paragraph);
  }

  figure.appendChild(caption);
  grid.appendChild(figure);
 });

 host.appendChild(grid);
}

fetch('gallery.json?v=' + Date.now())
.then(response => {
 if(!response.ok) throw Error('Gallery data unavailable');
 return response.json();
})
.then(data => {
 const items = Array.isArray(data.items)
  ? data.items.filter(item => item.active !== false)
  : [];

 const plants = items.filter(item => item.category === 'plants');
 const moments = items.filter(item => item.category === 'moments');

 renderItems(galleryHost, plants, t.galleryEmpty);
 renderItems(momentsHost, moments, t.momentsEmpty);
})
.catch(() => {
 if(galleryHost) galleryHost.textContent = t.error;
 if(momentsHost) momentsHost.textContent = t.error;
});

})();
