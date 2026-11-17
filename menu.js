'use strict';

(() => {
  const grid = document.getElementById('live-menu-grid');
  if (!grid) return;

  const lang = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
  const labels = {
    en: { empty: "Our menu is being updated. Please contact us for today's menu.", price: "Price" },
    si: { empty: "අපගේ ආහාර ලැයිස්තුව යාවත්කාලීන කරමින් පවතී. අද දවසේ ආහාර ගැන විමසීමට අප අමතන්න.", price: "මිල" },
    ta: { empty: "எங்கள் உணவுப் பட்டியல் புதுப்பிக்கப்படுகிறது. இன்றைய உணவு வகைகள் பற்றி எங்களைத் தொடர்புகொள்ளுங்கள்.", price: "விலை" }
  };
  const t = labels[lang] || labels.en;
  const menuUrl = new URL('menu.json', window.location.href);
  menuUrl.searchParams.set('_', Date.now());

  function make(tag, text) {
    const el = document.createElement(tag);
    if (text !== undefined && text !== null && text !== '') el.textContent = text;
    return el;
  }

  async function loadMenu() {
    try {
      const response = await fetch(menuUrl.href, { cache: 'no-store' });
      if (!response.ok) throw new Error('Menu file not found');
      const data = await response.json();
      if (!data || !Array.isArray(data.items)) throw new Error('Invalid menu.json');

      grid.replaceChildren();
      const items = data.items.filter(item => item && item.active !== false);

      if (!items.length) {
        grid.append(make('p', t.empty));
        return;
      }

      items.forEach(item => {
        const card = make('article');
        card.className = 'menu-card';
        if (item.image) {
          const img = make('img');
          const imagePath = item.image.startsWith('/') ? item.image.slice(1) : item.image;
          img.src = new URL(imagePath, window.location.href).href;
          img.alt = item['name_' + lang] || '';
          img.loading = 'lazy';
          img.className = 'menu-photo';
          card.append(img);
        }

        const content = make('div');
        content.className = 'card-content';
        const name = item['name_' + lang] || '';
        content.append(make('h3', name));
        const description = item['description_' + lang] || '';
        if (description) content.append(make('p', description));

        const price = item.price ? String(item.price).trim() : '';
        if (price) {
          const priceLine = make('p');
          priceLine.className = 'price-line';
          priceLine.append(make('strong', t.price + ': '));
          priceLine.append(document.createTextNode(price.toLowerCase().startsWith('rs') ? price : 'Rs. ' + price));
          content.append(priceLine);
        }

        card.append(content);
        grid.append(card);
      });
    } catch (error) {
      console.error(error);
      grid.replaceChildren(make('p', t.empty));
    }
  }

  loadMenu();
})();
