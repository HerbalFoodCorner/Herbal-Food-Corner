'use strict';

(() => {
  const grid = document.getElementById('live-menu-grid');
  if (!grid) return;

  const menuUrl = new URL('menu.json', window.location.href);
  menuUrl.searchParams.set('_', Date.now());

  function make(tag, text) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    return el;
  }

  async function loadMenu() {
    try {
      const response = await fetch(menuUrl.href, { cache: 'no-store' });
      if (!response.ok) throw new Error('Menu file not found');

      const data = await response.json();
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Invalid menu.json');
      }

      grid.replaceChildren();

      const items = data.items.filter(item => item && item.active !== false);

      if (!items.length) {
        grid.append(make('p', 'Our menu is being updated. Please contact us for today’s menu.'));
        return;
      }

      items.forEach(item => {
        const card = make('article');
        card.style.cssText = 'background:white;border:1px solid #ddd;border-radius:14px;padding:15px;margin:12px 0;';

        if (item.image) {
          const img = make('img');
          img.src = new URL(item.image.replace(/^\//, ''), window.location.href).href;
          img.alt = item.name_en || 'Menu item';
          img.style.cssText = 'width:100%;height:190px;object-fit:cover;border-radius:10px;';
          card.append(img);
        }

        const title = make('h3', item.name_en || 'Menu item');
        card.append(title);

        if (item.name_si) card.append(make('p', item.name_si));
        if (item.name_ta) card.append(make('p', item.name_ta));
        if (item.description_en) card.append(make('p', item.description_en));

        card.append(make('strong', item.price || 'Ask for price'));

        const order = make('a', 'Order on WhatsApp');
        order.href = 'https://wa.me/94726460854?text=' +
          encodeURIComponent('Hello, I would like to order ' + (item.name_en || 'a menu item'));
        order.target = '_blank';
        order.style.cssText = 'display:block;background:#174b32;color:white;padding:12px;text-align:center;border-radius:8px;margin-top:12px;text-decoration:none;';
        card.append(order);

        grid.append(card);
      });
    } catch (error) {
      console.error(error);
      grid.replaceChildren(make('p', 'Menu is temporarily unavailable. Please contact us on 072 646 0854.'));
    }
  }

  loadMenu();
})();
