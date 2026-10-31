import { PALETTES, OVERRIDES, ART_OVERRIDES } from './palette.js';
import { createController, STORAGE_KEY } from './controller.js';
import { liquidGlassCss, gaussianGlassCss, createMessageMaterialManager } from './glass.js';
import { artCss, installHeroCopy, installButtonPreviews, installFooterAlignment, joinedMaterialCss } from './art.js';

export const inject = ['theme', 'slots', 'locale'];
export const dictionaries = {
  zh: { title:'超管局主题', description:'橙色是警告，也是底线——里世界的守夜人。', default:'默认配色', light:'白昼巡查', dark:'夜间收容', system:'跟随系统', activeLight:'当前为白昼巡查', activeDark:'当前为夜间收容', inactive:'已恢复默认配色', saved:'选择已保存', unavailable:'当前选择仅在本次打开期间生效，无法保存到本机。', newer:'已有较新版本的设置，本版不会覆盖；当前切换仅临时生效。', invalid:'保存的设置无法识别，已恢复默认；重新选择即可保存。', palette:'部门配色', colorTeal:'橙风衣', colorWhite:'白制服', colorNavy:'深蓝高层', colorPink:'警示红', colorGold:'银金' },
  en: { title:'Bureau theme', description:'Orange is the warning, and the bottom line — night watch of the inner world.', default:'Default colors', light:'Day patrol', dark:'Night containment', system:'Follow system', activeLight:'Day patrol active', activeDark:'Night containment active', inactive:'Default colors restored', saved:'Selection saved', unavailable:'This selection lasts for this window only. Local saving is unavailable.', newer:'Newer settings were found and will be preserved. Changes are temporary.', invalid:'Saved settings were not recognized. Choose an appearance to save again.', palette:'Department palette', colorTeal:'Orange coat', colorWhite:'White uniform', colorNavy:'Deep blue', colorPink:'Warning red', colorGold:'Brass' }
};
Object.assign(dictionaries.zh, {material:'聊天框效果',liquid:'液态折射',gaussian:'磨砂遮蔽',materialNote:'滚动卡顿时，可切换为磨砂遮蔽。',wallpaper:'全窗口里世界场景',stickers:'特工头像',artNote:'侧栏与底栏采用磨砂玻璃；头像用于新会话、主页欢迎区和发送按钮，功能文字保留。',greeting:'到岗',thinking:'分析中',reading:'收容中',confused:'异常',good:'任务完成',heart:'致意'});
Object.assign(dictionaries.en, {material:'Message appearance',liquid:'Liquid refraction',gaussian:'Frosted mask',materialNote:'Choose frosted mask for smoother scrolling.',wallpaper:'Inner-world scene',stickers:'Agent avatars',artNote:'Sidebar and footer use frosted glass. Avatars appear on new session, home hero and send button; labels stay.',greeting:'On duty',thinking:'Analyzing',reading:'Containing',confused:'Anomaly',good:'Cleared',heart:'Salute'});

// React comes from DSH's module table; it must not be bundled a second time.
export function makeCard(React, assets) {
  const h = React.createElement;
  return function YuexinCard({ controller, t }) {
    const state = React.useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
    const colors = state.scheme === 'dark' ? PALETTES.dark : PALETTES.light;
    const swatches = [['accent','colorTeal'],['base','colorWhite'],['text','colorNavy'],['pink','colorPink'],['gold','colorGold']];
    const sticker = (index, className='') => h('span', {className:'yuexin-sticker '+className, 'aria-hidden':true,style:{backgroundImage:`url("${assets.stickers}")`,backgroundPosition:`${(index%3)*50}% ${Math.floor(index/3)*100}%`}});
    return h('section', { className:'fellowmoon-theme-card', 'aria-label':t('title') },
      state.enabled && state.wallpaper ? h('div',{className:'yuexin-wallpaper-preview','aria-hidden':true},h('img',{src:assets.wallpaper,alt:'',decoding:'async'})) : null,
      h('div', { className:'fellowmoon-theme-heading' }, state.enabled && state.stickers ? sticker(0) : h('span', { className:'fellowmoon-theme-mark', 'aria-hidden':true }, '✧'), h('h3', null, t('title'))),
      h('p', { className:'fellowmoon-theme-description' }, t('description')),
      h('div', { className:'fellowmoon-theme-options', role:'group', 'aria-label':t('title') },
        ['default','light','dark','system'].map(mode => h('button', {
          key:mode, type:'button', 'aria-pressed':mode === 'default' ? !state.enabled : state.enabled && state.preference === mode,
          onClick:() => controller.choose(mode)
        }, state.enabled && state.stickers ? sticker({default:3,light:0,dark:2,system:1}[mode]) : null, t(mode)))),
      h('div', { className:'fellowmoon-theme-swatches', 'aria-label':t('palette') }, swatches.map(([key,label]) => h('span', {
        key, className:'fellowmoon-theme-swatch', style:{ background:colors[key] }, title:t(label), 'aria-label':t(label), role:'img'
      }))),
      h('div',{className:'yuexin-decoration-options'}, ['wallpaper','stickers'].map(name=>h('label',{key:name},h('input',{type:'checkbox',checked:state[name],disabled:!state.enabled,onChange:event=>controller.setDecoration(name,event.target.checked)}),t(name)))),
      h('div',{className:'fellowmoon-theme-options',role:'group','aria-label':t('material')},h('span',null,t('material')),['liquid','gaussian'].map(value=>h('button',{key:value,type:'button','aria-pressed':state.material===value,disabled:!state.enabled||!state.wallpaper,onClick:()=>controller.setMaterial(value)},t(value)))),
      h('p',{className:'fellowmoon-theme-description'},t('materialNote')),
      h('p',{className:'fellowmoon-theme-description'},t('artNote')),
      state.enabled && state.stickers ? h('div',{className:'yuexin-sticker-gallery'}, ['greeting','thinking','reading','confused','good','heart'].map((name,index)=>h('div',{key:name,title:t(name)},sticker(index),h('span',null,t(name))))) : null,
      h('p', { className:'fellowmoon-theme-status', role:'status', 'aria-live':'polite' },
        t(state.enabled ? (state.scheme === 'dark' ? 'activeDark' : 'activeLight') : 'inactive'), ' · ', t(state.storageState))
    );
  };
}

/**
 * 本地自举开机动画。
 *
 * Host 半侧会在 index.html 的 </head>/<body> 里注入 splash.css / splash.js，
 * 但桌面端的那次首屏 HTML 由 frontend-static 直接产出，注入能不能赶上要看时序；
 * 一旦赶不上，页面加载完就再也没有机会注入 —— 表现为"完全没有开场动画"。
 * 所以浏览器半侧（插件加载时必然执行）再做一次自举：先糊一层黑幕，
 * 拿到样式与运行时后交给 splash.js 自己接管。
 */
const STARTUP_CSS = '/cpo-startup/splash.css';
const STARTUP_JS = '/cpo-startup/splash.js';
const STARTUP_DONE_KEY = 'cpo-startup:shown';

function bootStartup() {
  try {
    if (typeof document === 'undefined' || !document.body) return;
    if (window.__CPO_STARTUP_LOADED__ || window.__CPO_STARTUP_RUNNING__) return;
    if (window.__CPO_STARTUP_SKIP__) return;
    if (document.getElementById('cpo-startup-root')) return;
    try { if (window.sessionStorage.getItem(STARTUP_DONE_KEY) === '1') return; } catch { /* 隐私模式读不到就当没播过 */ }

    const root = document.createElement('div');
    root.id = 'cpo-startup-root';
    root.className = 'cpo-root cpo-boot';
    root.setAttribute('data-yuexin-startup', '');
    // 样式还没到之前先自己糊住，避免露出应用本体。
    root.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#000';
    document.documentElement.classList.add('cpo-lock');
    document.body.appendChild(root);

    const release = () => {
      try { root.remove(); } catch { /* noop */ }
      try { document.documentElement.classList.remove('cpo-lock'); } catch { /* noop */ }
    };

    const start = () => {
      const script = document.createElement('script');
      script.src = STARTUP_JS + '?t=' + Date.now();
      script.dataset.yuexinStartup = '';
      script.onload = () => { root.style.cssText = ''; };
      script.onerror = release;
      document.head.appendChild(script);
    };

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STARTUP_CSS;
    link.dataset.yuexinStartup = '';
    link.onload = start;
    link.onerror = release;
    document.head.appendChild(link);

    // 运行时 8 秒还没接手就放行，别把整个应用锁在黑幕里。
    setTimeout(() => { if (!window.__CPO_STARTUP_LOADED__) release(); }, 8000);
  } catch { /* 装饰性功能，失败也不该影响主题本身 */ }
}

export function applyClient(ctx, React, css, assets) {
  bootStartup();
  let controller;
  let storage;
  ctx.effect(() => {
    try { storage = window.localStorage; } catch { /* Browsers may block local storage. The controller reports session-only saving. */ }
    controller = createController(ctx.theme, storage, OVERRIDES, ART_OVERRIDES);
    return () => controller.dispose();
  });
  ctx.on('theme/change', () => controller.syncTheme());
  ctx.effect(() => installHeroCopy(controller));
  ctx.effect(() => installFooterAlignment());
  ctx.effect(() => {
    const onStorage = event => { if (storage && event.storageArea === storage && (event.key === STORAGE_KEY || event.key === null)) controller.syncStorage(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  });
  ctx.effect(() => {
    const style = document.createElement('style');
    style.dataset.plugin = 'dsh-fellowmoon-theme';
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  });
  ctx.effect(() => {
    const body = document.body;
    const previous = body.getAttribute('data-yuexin-art');
    const previousStickers = body.getAttribute('data-yuexin-stickers');
    const materialManager=createMessageMaterialManager();
    const sync = () => {
      const state=controller.getSnapshot();
      if (state.enabled && state.wallpaper) body.setAttribute('data-yuexin-art',state.scheme);
      else body.removeAttribute('data-yuexin-art');
      body.toggleAttribute('data-yuexin-stickers',state.enabled && state.stickers);
      materialManager.sync(state);
    };
    const artStyle=document.createElement('style');
    // Keep large inline artwork out of CSS variable substitution limits.
    const bytes=Uint8Array.from(atob(assets.wallpaper.split(',')[1]),ch=>ch.charCodeAt(0));
    const imageUrl=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
    const stickerBytes=Uint8Array.from(atob(assets.stickers.split(',')[1]),ch=>ch.charCodeAt(0));
    const stickerUrl=URL.createObjectURL(new Blob([stickerBytes],{type:'image/webp'}));
    const individualUrls=assets.individual.map(data=>URL.createObjectURL(new Blob([Uint8Array.from(atob(data.split(',')[1]),ch=>ch.charCodeAt(0))],{type:'image/webp'})));
    const emblemBytes=Uint8Array.from(atob(assets.emblem.split(',')[1]),ch=>ch.charCodeAt(0));
    const emblemUrl=URL.createObjectURL(new Blob([emblemBytes],{type:'image/webp'}));
    const sidebarBytes=Uint8Array.from(atob(assets.sidebar.split(',')[1]),ch=>ch.charCodeAt(0));
    const sidebarUrl=URL.createObjectURL(new Blob([sidebarBytes],{type:'image/webp'}));
    const markLightUrl=URL.createObjectURL(new Blob([Uint8Array.from(atob(assets['mark-light'].split(',')[1]),ch=>ch.charCodeAt(0))],{type:'image/webp'}));
    const markDarkUrl=URL.createObjectURL(new Blob([Uint8Array.from(atob(assets['mark-dark'].split(',')[1]),ch=>ch.charCodeAt(0))],{type:'image/webp'}));
    artStyle.dataset.plugin='dsh-fellowmoon-theme-art';
    // Desktop's Windows frame has an opaque sidebar fill underneath centerCol.
    // Target the CSS-module role observed in both installed layout versions,
    // without coupling to its changing hash or changing native panel geometry.
    artStyle.textContent=artCss(imageUrl,stickerUrl,individualUrls,emblemUrl,sidebarUrl,markLightUrl,markDarkUrl)+joinedMaterialCss()+liquidGlassCss()+gaussianGlassCss();
    document.head.appendChild(artStyle);
    const disposePreviews=installButtonPreviews(controller,individualUrls);
    sync();
    const unsubscribe=controller.subscribe(sync);
    return () => {unsubscribe();materialManager.dispose();disposePreviews();artStyle.remove();URL.revokeObjectURL(imageUrl);URL.revokeObjectURL(stickerUrl);URL.revokeObjectURL(emblemUrl);URL.revokeObjectURL(sidebarUrl);individualUrls.forEach(url=>URL.revokeObjectURL(url));if(previous===null)body.removeAttribute('data-yuexin-art');else body.setAttribute('data-yuexin-art',previous);if(previousStickers===null)body.removeAttribute('data-yuexin-stickers');else body.setAttribute('data-yuexin-stickers',previousStickers);};
  });
  ctx.effect(() => ctx.locale.register('settings.fellowmoon', dictionaries));
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name:'settings.general.item', id:'fellowmoon-theme', order:12, locale:'settings.fellowmoon', inject:() => ({ controller })
  }, makeCard(React, assets)));
}

