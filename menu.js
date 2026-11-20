'use strict';

(() => {
  const grid = document.getElementById('live-menu-grid');
  if (!grid) return;

  const lang = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
  const labels = {
    en: { empty: "Our menu is being updated. Please contact us for today's menu.", price: "Price", other: "Other" },
    si: { empty: "අපගේ ආහාර ලැයිස්තුව යාවත්කාලීන කරමින් පවතී. අද දවසේ ආහාර ගැන විමසීමට අප අමතන්න.", price: "මිල", other: "වෙනත්" },
    ta: { empty: "எங்கள் உணவுப் பட்டியல் புதுப்பிக்கப்படுகிறது. இன்றைய உணவு வகைகள் பற்றி எங்களைத் தொடர்புகொள்ளுங்கள்.", price: "விலை", other: "மற்றவை" }
  };
  const t = labels[lang] || labels.en;

  function make(tag, text) {
    const el = document.createElement(tag);
    if (text !== undefined && text !== null && text !== '') el.textContent = text;
    return el;
  }
  function localizedCategory(category) {
    if (!category) return t.other;
    return category['name_' + lang] || category.name_en || category.id || t.other;
  }
  function renderItem(item) {
    const card = make('article');
    card.className = 'menu-card' + (item.featured ? ' featured' : '');
    if (item.image) {
      const img = make('img');
      const imagePath = item.image.startsWith('/') ? item.image.slice(1) : item.image;
      img.src = new URL(imagePath, window.location.href).href;
      img.alt = item['name_' + lang] || item.name_en || 'Herbal Food Corner menu item';
      img.loading = 'lazy';
      img.className = 'menu-photo';
      card.append(img);
    }
    const content = make('div');
    content.className = 'card-content';
    const name = item['name_' + lang] || item.name_en || '';
    content.append(make('h3', name));
    const description = item['description_' + lang] || item.description_en || '';
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
    return card;
  }

  async function loadMenu() {
    try {
      const stamp = Date.now();
      const [menuResponse, categoryResponse] = await Promise.all([
        fetch('menu.json?v=' + stamp, { cache: 'no-store' }),
        fetch('categories.json?v=' + stamp, { cache: 'no-store' })
      ]);
      if (!menuResponse.ok) throw new Error('Menu file not found');
      const data = await menuResponse.json();
      const categoryData = categoryResponse.ok ? await categoryResponse.json() : { categories: [] };
      if (!data || !Array.isArray(data.items)) throw new Error('Invalid menu.json');
      const items = data.items.filter(item => item && item.active !== false);
      const categories = Array.isArray(categoryData.categories) ? categoryData.categories.filter(c => c && c.active !== false) : [];
      grid.replaceChildren();
      if (!items.length) {
        grid.append(make('p', t.empty));
        return;
      }

      const categoryMap = new Map(categories.map(c => [String(c.id), c]));
      const orderedIds = categories.map(c => String(c.id));
      const itemCategoryIds = [...new Set(items.map(item => String(item.category || '')).filter(Boolean))];
      itemCategoryIds.forEach(id => { if (!orderedIds.includes(id)) orderedIds.push(id); });

      orderedIds.forEach(id => {
        const categoryItems = items.filter(item => String(item.category || '') === id);
        if (!categoryItems.length) return;
        const section = make('section');
        section.className = 'menu-category-section';
        const heading = make('h3', localizedCategory(categoryMap.get(id) || { id, name_en: id }));
        heading.className = 'menu-category-title';
        section.append(heading);
        const itemGrid = make('div');
        itemGrid.className = 'menu-grid menu-category-grid';
        categoryItems.forEach(item => itemGrid.append(renderItem(item)));
        section.append(itemGrid);
        grid.append(section);
      });

      const uncategorized = items.filter(item => !item.category);
      if (uncategorized.length) {
        const section = make('section');
        section.className = 'menu-category-section';
        const heading = make('h3', t.other);
        heading.className = 'menu-category-title';
        section.append(heading);
        const itemGrid = make('div');
        itemGrid.className = 'menu-grid menu-category-grid';
        uncategorized.forEach(item => itemGrid.append(renderItem(item)));
        section.append(itemGrid);
        grid.append(section);
      }
    } catch (error) {
      console.error(error);
      grid.replaceChildren(make('p', t.empty));
    }
  }
  loadMenu();
})();
