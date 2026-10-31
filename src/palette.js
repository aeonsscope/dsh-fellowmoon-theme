// 超管局主题配色 —— 取自《新月同行》超现象管理局的颜色语言：
//   橙 = 一线/中坚（外勤特工橙色风衣）     → 品牌主色 accent
//   白 = 中层领导（特战组长/分局长白制服） → 浅色底 base
//   黑 = 经验/精锐（特战小组成员黑衣）     → 深色底 base
//   深蓝 = 高层（月球总局核心）             → 文字/侧栏冷调
export const PALETTES = Object.freeze({
  light: Object.freeze({ base:'#F7F4EE', surface:'#FFFFFF', sidebar:'#EFE7D9', raised:'#FBF8F1', elevated:'#FFFFFF', text:'#16212B', secondary:'#3D4C5A', tertiary:'#5C6B79', muted:'#5F6E7B', accent:'#E2570A', accentHover:'#F06A1C', accentSoft:'#FBE4D2', onAccent:'#1A1005', border:'#DDD3C3', hover:'#F3ECDF', code:'#F1EADB', pink:'#C4524F', gold:'#B8932E', lilac:'#8A6FA8' }),
  dark: Object.freeze({ base:'#0D151F', surface:'#131E2A', sidebar:'#0F1822', raised:'#182634', elevated:'#203040', text:'#F2F3F1', secondary:'#C2CED8', tertiary:'#9FB0BE', muted:'#8B9DAB', accent:'#FF8A2B', accentHover:'#FFA44D', accentSoft:'#3A2614', onAccent:'#1A1005', border:'#2C3E4F', hover:'#1C2A38', code:'#0A121A', pink:'#E07A72', gold:'#D4B35C', lilac:'#B49CD6' })
});

function tokens(p) {
  const t = {};
  const assign = (value, ...names) => names.forEach(name => { t['--dsw-alias-' + name] = value; });
  assign(p.base, 'bg-base');
  assign(p.surface, 'bg-layer-1', 'button-floating-fill');
  assign(p.raised, 'bg-layer-2', 'bg-document-preview', 'button-elevated-fill', 'button-info-fill', 'markdown-code-block-banner');
  assign(p.elevated, 'bg-layer-3', 'bg-overlay');
  assign(p.sidebar, 'bg-module-platform');
  assign(p.text, 'label-primary', 'label-primary-bluish', 'label-document-preview', 'menu-icon');
  assign(p.secondary, 'label-secondary', 'label-caption');
  assign(p.tertiary, 'label-tertiary');
  assign(p.muted, 'label-dimmed', 'label-primary-dimmed', 'markdown-placeholder');
  assign(p.accent, 'brand-primary', 'brand-primary-invert', 'brand-primary-new-colorprimary-new-color', 'brand-text', 'button-primary-fill', 'button-contrast-fill', 'link', 'state-business-primary');
  assign(p.accentHover, 'button-primary-hover');
  assign(p.onAccent, 'label-primary-inverted', 'label-primary-foreground');
  assign(p.border, 'border-l1', 'border-l2', 'border-l2-darkmode-thin', 'border-l3', 'border-l4', 'button-ghost-active-border');
  assign(p.hover, 'interactive-bg-hover', 'interactive-bg-hover-solid', 'button-floating-hover', 'button-info-hover', 'button-tool-bar-hover', 'button-ghost-active-hover');
  assign(p.accentSoft, 'interactive-bg-active', 'interactive-bg-hover-accent', 'bg-multi-select', 'button-ghost-active-fill', 'button-primary-dimmed', 'markdown-citation', 'markdown-tag', 'markdown-code-segment-selected');
  assign(p.code, 'markdown-code-block', 'markdown-inline-code', 'markdown-code-segment-unselected');
  assign(p.raised, 'bg-skeleton', 'button-tool-bar-fill');
  assign(p.border, 'scrollbar-bg-l1', 'scrollbar-bg-l2');
  assign(p.tertiary, 'scrollbar-hover-l1', 'scrollbar-hover-l2');
  // Error, warning, success and diff tokens retain the platform's meanings.
  t['--yuexin-pink'] = p.pink;
  t['--yuexin-gold'] = p.gold;
  t['--yuexin-lilac'] = p.lilac;
  t['--yuexin-on-accent'] = p.onAccent;
  // Background images and illustrated controls can extend the theme later.
  t['--yuexin-selection'] = p.accentSoft;
  t['--dsw-specific-sidebar-fill'] = p.sidebar;
  t['--dsw-specific-input-major'] = p.surface;
  t['--dsw-specific-bubble'] = p.raised;
  t['--dsw-specific-menu'] = p.elevated;
  t['--dsw-menu-backdrop-filter'] = 'none';
  return Object.freeze(t);
}

export const TOKENS = Object.freeze({ light: tokens(PALETTES.light), dark: tokens(PALETTES.dark) });
export const OVERRIDES = Object.freeze(Object.fromEntries(Object.keys(TOKENS.light).map(name => [name, Object.freeze({ light:TOKENS.light[name], dark:TOKENS.dark[name] })])));
// Content cards retain opaque colors. Only the page canvas reveals wallpaper.
export const ART_OVERRIDES = Object.freeze({ ...OVERRIDES,
  '--dsw-alias-bg-base': Object.freeze({light:'transparent',dark:'transparent'}),
  // Desktop's preload also reads this token to color native caption buttons.
  '--dsw-specific-sidebar-fill': Object.freeze({light:'transparent',dark:'transparent'}),
  '--dsw-specific-bubble': Object.freeze({light:'transparent',dark:'transparent'})
});
