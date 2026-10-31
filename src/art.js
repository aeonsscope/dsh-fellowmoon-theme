// CSS-module roles verified against Desktop 0.2.0-rc.2. Match complete
// class tokens rather than a build-specific hash. No DOM or event replacement.
function role(name) {
  return `:is([class$="_${name}"],[class*="_${name} "])`;
}

export function artCss(wallpaperUrl, stickersUrl, individualUrls, emblemUrl, sidebarUrl, markLightUrl, markDarkUrl) {
  // Conversation viewports also have a "frame" role: only the shell owns art.
  const sidebar = ':is([data-slot="sidebar"],[class*="sidebarCol"])', frame = `${role('frame')}:has(> ${sidebar})`;
  const canvas = `${role('centerCol')},${role('rightbarCol')}`;
  const newIcon = `button${role('newSession')} ${role('newSessionContent')}`;
  const send = `button${role('primary')}:is([aria-label^="发送"],[aria-label^="Send"])`;
  const stop = `button${role('primary')}:is([aria-label="停止生成"],[aria-label^="Stop"])`;
  const hello = role('fishHitbox');
  const sticker = index => `background-image:url("${individualUrls[index]}");background-size:contain;background-repeat:no-repeat;background-position:center;pointer-events:none`;
  return `
body[data-yuexin-art] :is([class$="_composerSeat"],[class*="_composerSeat "]):not(:is([class$="_composerHero"],[class*="_composerHero "])){isolation:isolate;background:none}
body[data-yuexin-art] :is([class$="_composerSeat"],[class*="_composerSeat "]):not(:is([class$="_composerHero"],[class*="_composerHero "]))::before{content:"";position:absolute;left:0;right:0;bottom:0;top:var(--yuexin-footer-top,calc(100% - 28px));z-index:-1;pointer-events:none;background:var(--yuexin-glass);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
@media(prefers-reduced-transparency:reduce){body[data-yuexin-art] :is([class$="_composerSeat"],[class*="_composerSeat "]):not(:is([class$="_composerHero"],[class*="_composerHero "]))::before{background:var(--dsw-alias-bg-module-platform);backdrop-filter:none}}
body[data-yuexin-personal] ${stop}{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary-inverted);width:34px;height:34px;min-width:34px;border-radius:50%;border:1px solid var(--dsw-alias-brand-primary);box-shadow:none;box-sizing:border-box;display:grid;place-items:center}
body[data-yuexin-personal] ${stop}>svg{width:16px;height:16px}
body[data-yuexin-personal] ${stop}:hover{background:var(--dsw-alias-button-primary-hover)}
body[data-yuexin-art="dark"]{background-color:#0E1722;--yuexin-scene:linear-gradient(90deg,rgba(13,21,31,.68),rgba(13,21,31,.62)),url("${wallpaperUrl}");--yuexin-glass:rgba(13,21,31,.22)}
body[data-yuexin-art="light"]{background-color:#F7F4EE;--yuexin-scene:linear-gradient(90deg,rgba(247,244,238,.84),rgba(247,244,238,.78)),url("${wallpaperUrl}");--yuexin-glass:rgba(247,244,238,.34)}
body[data-yuexin-art]{background-image:var(--yuexin-scene);background-size:cover;background-position:center;background-attachment:fixed}
body[data-yuexin-art] ${frame}{background-image:var(--yuexin-scene);background-size:cover;background-position:center;background-color:transparent}
body[data-yuexin-art] :is(${canvas}){background:transparent}
body[data-yuexin-art] ${sidebar}{background:transparent;position:relative;isolation:isolate}
body[data-yuexin-art] ${sidebar}::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:var(--yuexin-glass);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
body[data-yuexin-art] ${sidebar} ${role('root')}{background:transparent}
body[data-yuexin-art] ${frame}::before{background:var(--yuexin-glass);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
body[data-yuexin-art] ${role('rightbarCol')}{background:var(--yuexin-glass);backdrop-filter:blur(8px)}
body[data-yuexin-art="dark"]{--yuexin-input-glass:rgba(13,21,31,.92)}
body[data-yuexin-art="light"]{--yuexin-input-glass:rgba(247,244,238,.95)}
body[data-yuexin-art] ${role('card')}:has(${role('input')}){background:var(--yuexin-input-glass);background-image:none;border:1px solid var(--dsw-alias-border-l2)}
body[data-yuexin-personal] ${role('card')}:has(${role('input')}){background-image:url("${emblemUrl}");background-repeat:no-repeat;background-position:50% calc(100% - 4px);background-size:min(72px,36%) auto;background-blend-mode:normal}
/* 个人侧栏背景：组长.jpg 铺满侧栏，蒙一层主题色让文字保持清晰 */
body[data-yuexin-personal]{--yuexin-sidebar-veil:rgba(247,244,238,.82)}
body[data-yuexin-art="dark"]{--yuexin-sidebar-veil:rgba(13,21,31,.76)}
body[data-yuexin-art="light"]{--yuexin-sidebar-veil:rgba(247,244,238,.82)}
body[data-yuexin-personal][data-ds-dark-theme],html[data-ds-dark-theme] body[data-yuexin-personal]{--yuexin-sidebar-veil:rgba(13,21,31,.76)}
body[data-yuexin-personal] ${sidebar}{position:relative;isolation:isolate;background-image:linear-gradient(var(--yuexin-sidebar-veil),var(--yuexin-sidebar-veil)),url("${sidebarUrl}")!important;background-size:cover!important;background-position:center top!important;background-repeat:no-repeat!important;background-color:transparent!important}
body[data-yuexin-personal] ${sidebar}>div,body[data-yuexin-personal] ${sidebar} ${role("root")}{background-color:transparent!important;background-image:none!important}
body[data-yuexin-personal] ${sidebar}::before{content:none!important;background:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important}
body[data-yuexin-personal] ${sidebar} [class*="fade"]{background:transparent!important}
@media(prefers-reduced-transparency:reduce){body[data-yuexin-personal] ${sidebar}{background-image:none!important;background-color:var(--dsw-alias-bg-module-platform)!important}}
body[data-yuexin-art] select,body[data-yuexin-art] option{background-color:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
body[data-yuexin-art] ${role('frame')}:not(:has(> ${sidebar})){background-image:none;background-color:transparent}
body[data-yuexin-personal] ${role('menu')}:has([role="listbox"]){background:var(--dsw-specific-menu);background-image:none;backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:0 8px 28px rgba(0,0,0,.24)}
body[data-yuexin-art] ${role('root')}:has(> ${role('stack')}>${role('headline')}){justify-content:flex-start;align-items:center}
body[data-yuexin-personal] ${role('headline')}:has(${hello}){justify-content:flex-start;text-align:left;gap:12px;font-size:22px;line-height:1.5}
body[data-yuexin-personal] ${role('titleGroup')}:has(> ${role('previewBadge')}){justify-content:flex-start;flex:1;min-width:0}
body[data-yuexin-personal] ${role('titleGroup')}>${role('previewBadge')}{display:none}
body[data-yuexin-personal] ${role('stack')}:has(>${role('headline')}){margin-right:auto;max-width:min(620px,100%);gap:18px}
body[data-yuexin-personal] ${role('root')}:has(> ${role('stack')}){padding-left:clamp(24px,4vw,56px);padding-right:24px;position:relative;isolation:isolate}
body[data-yuexin-personal]{--yuexin-mark:url("${markLightUrl}");--yuexin-mark-opacity:.26}
body[data-yuexin-personal][data-ds-dark-theme],html[data-ds-dark-theme] body[data-yuexin-personal]{--yuexin-mark:url("${markDarkUrl}");--yuexin-mark-opacity:.20}
body[data-yuexin-personal]:has(${role('headline')})::after{content:"";position:fixed;right:clamp(16px,2.4vw,40px);bottom:clamp(16px,2.4vh,36px);width:min(42%,480px);aspect-ratio:1;background:var(--yuexin-mark) center/contain no-repeat;opacity:var(--yuexin-mark-opacity);pointer-events:none;z-index:1}
body[data-yuexin-personal] ${role('composerStack')}${role('composerHero')}{width:45%;min-width:min(360px,calc(100% - 48px));max-width:calc(100% - 48px);align-self:flex-start;margin-left:clamp(24px,3vw,56px);container-type:inline-size}
body[data-yuexin-personal] ${role('composerHero')} ${role('card')}:has(${role('input')}){width:100%;max-width:none;box-sizing:border-box}
body[data-yuexin-personal] ${role('composerHero')} ${role('input')}{min-height:clamp(52px,10cqw,160px)}
body[data-yuexin-personal] ${role('composerHero')} ${role('root')}:has(> ${role('stack')}){width:100%;box-sizing:border-box;padding:0}
body[data-yuexin-stickers] ${newIcon}{gap:8px;justify-content:flex-start;width:100%}
body[data-yuexin-stickers] ${newIcon}::before{content:"";width:36px;height:36px;flex:none;${sticker(0)};background-size:150%;background-position:50% 35%;border-radius:50%;background-color:var(--dsw-specific-menu);box-shadow:0 0 0 1px var(--dsw-alias-border-l2)}
body[data-yuexin-stickers] ${newIcon}>svg{display:none}
body[data-yuexin-stickers] ${send}{position:relative;width:88px;height:46px;border-radius:12px}
body[data-yuexin-stickers] ${send}>svg{visibility:hidden}
body[data-yuexin-stickers] ${send}::before{content:"";position:absolute;left:3px;top:3px;width:40px;height:40px;${sticker(5)};background-size:145%;background-position:55% 75%;border-radius:50%;background-color:var(--dsw-specific-menu)}
body[data-yuexin-stickers] ${send}::after{content:"发送";position:absolute;right:8px;top:50%;transform:translateY(-50%);font:500 13px/20px sans-serif;color:var(--dsw-alias-label-primary);pointer-events:none}
body[data-yuexin-stickers] ${send}:disabled{opacity:.72}
body[data-yuexin-stickers] button${role('newSession')}{height:48px}
body[data-yuexin-stickers] ${role('collapsed')} button${role('newSession')}{width:42px;height:42px}
body[data-yuexin-stickers] ${role('collapsed')} ${newIcon}::before{width:36px;height:36px}
body[data-yuexin-stickers] button${role('add')}[aria-label="添加文件或调用指令"]{position:relative;width:32px;height:32px}
body[data-yuexin-stickers] button${role('add')}[aria-label="添加文件或调用指令"]::before{content:"";position:absolute;left:-16px;bottom:calc(100% + 8px);width:64px;height:64px;${sticker(2)};opacity:0;visibility:hidden}
body[data-yuexin-stickers] button${role('add')}[aria-label="添加文件或调用指令"]:not([aria-expanded="true"]):is(:hover,:focus-visible)::before{opacity:1;visibility:visible}
body[data-yuexin-stickers] ${role('card')}:has(${role('menu')} [role="listbox"]) button${role('add')}::before{opacity:0;visibility:hidden}
body[data-yuexin-stickers] button:is([aria-label="好的回答"],[aria-label="有问题的回答"]){position:relative;width:28px;height:28px}
body[data-yuexin-stickers] button:is([aria-label="好的回答"],[aria-label="有问题的回答"])::before{content:"";position:absolute;left:-18px;bottom:calc(100% + 8px);width:64px;height:64px;opacity:0;visibility:hidden}
body[data-yuexin-stickers] button[aria-label="好的回答"]::before{${sticker(4)}}
body[data-yuexin-stickers] button[aria-label="有问题的回答"]::before{${sticker(3)}}
body[data-yuexin-stickers] button:is([aria-label="好的回答"],[aria-label="有问题的回答"]):is(:hover,:focus-visible)::before{opacity:1;visibility:visible}
body[data-yuexin-stickers] ${hello}{width:84px;height:84px;position:relative}
body[data-yuexin-stickers] ${hello} svg{display:none}
body[data-yuexin-stickers] ${hello}::before{content:"";position:absolute;inset:0;${sticker(1)}}
.yuexin-button-preview{position:fixed;z-index:10000;width:80px;height:80px;padding:6px;box-sizing:content-box;background:var(--dsw-specific-menu);border:1px solid var(--dsw-alias-border-l2);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.24);pointer-events:none}
.yuexin-button-preview[hidden],body:not([data-yuexin-stickers]) .yuexin-button-preview{display:none}
.yuexin-button-preview img{width:100%;height:100%;object-fit:contain}
@media(prefers-reduced-transparency:reduce){body[data-yuexin-art] ${sidebar}::before,body[data-yuexin-art] ${frame}::before,body[data-yuexin-art] ${role('rightbarCol')},body[data-yuexin-art] ${role('card')}:has(${role('input')}){background:var(--dsw-alias-bg-module-platform);backdrop-filter:none}}
@media(max-width:600px){body[data-yuexin-art],body[data-yuexin-art] ${frame}{background-position:70% center}body[data-yuexin-stickers] ${hello}{width:64px;height:64px}body[data-yuexin-stickers] ${send}{width:84px}}
`;
}

// One decorative preview shared by both buttons. Delegation survives React
// navigation; no button content, click handlers or disabled state is changed.
export function installButtonPreviews(controller, individualUrls) {
  const preview=document.createElement('div');
  preview.className='yuexin-button-preview';preview.hidden=true;
  preview.setAttribute('aria-hidden','true');
  const image=document.createElement('img');image.alt='';preview.appendChild(image);
  document.body.appendChild(preview);
  const selector=`button${role('newSession')},button${role('primary')}:is([aria-label^="发送"],[aria-label^="Send"])`;
  let active;
  const hide=()=>{preview.hidden=true;active=null;};
  const identify=target=>target instanceof Element?target.closest(selector):null;
  const show=event=>{
    const button=identify(event.target),state=controller.getSnapshot();
    if(!button||!state.enabled||!state.stickers)return;
    if(active===button&&!preview.hidden)return;
    active=button;
    const send=button.matches(role('primary'));
    image.src=individualUrls[send?5:0];
    const rect=button.getBoundingClientRect(),size=94;
    const left=send?rect.right-size:rect.right+10;
    const top=send?rect.top-size-10:rect.top+(rect.height-size)/2;
    preview.style.left=Math.max(8,Math.min(left,innerWidth-size-8))+'px';
    preview.style.top=Math.max(8,Math.min(top,innerHeight-size-8))+'px';
    preview.hidden=false;
  };
  const leave=event=>{if(active===identify(event.target)&&active!==identify(event.relatedTarget))hide();};
  document.addEventListener('pointerover',show,true);document.addEventListener('pointerout',leave,true);
  document.addEventListener('focusin',show,true);document.addEventListener('focusout',leave,true);
  document.addEventListener('scroll',hide,true);document.addEventListener('keydown',hide,true);
  window.addEventListener('resize',hide);window.addEventListener('blur',hide);
  const unsubscribe=controller.subscribe(hide);
  return()=>{unsubscribe();preview.remove();document.removeEventListener('pointerover',show,true);document.removeEventListener('pointerout',leave,true);document.removeEventListener('focusin',show,true);document.removeEventListener('focusout',leave,true);document.removeEventListener('scroll',hide,true);document.removeEventListener('keydown',hide,true);window.removeEventListener('resize',hide);window.removeEventListener('blur',hide);};
}

// The host locale registry disallows overrides of existing namespaces. Change
// only the verified hero text node, retaining React's element and restoring it
// on disable/unload. Reconcile after navigation and host rerenders.
export function installHeroCopy(controller) {
  const original = new Map();
  const selector = `${role('headline')}:has(${role('fishHitbox')}) ${role('titleGroup')}>span:first-child`;
  const sentence = '超实体从不停歇，超管局亦是。';
  const patch = () => {
    for (const el of document.querySelectorAll(selector)) {
      if (!original.has(el)) original.set(el,el.textContent);
      if (el.textContent !== sentence) el.textContent=sentence;
    }
    for (const el of original.keys()) if (!el.isConnected) original.delete(el);
  };
  const observer = new MutationObserver(patch);
  const previous = document.body.getAttribute('data-yuexin-personal');
  const sync = () => {
    observer.disconnect();
    const enabled=controller.getSnapshot().enabled;
    document.body.toggleAttribute('data-yuexin-personal',enabled);
    if (enabled) {patch();observer.observe(document.body,{subtree:true,childList:true,characterData:true});}
    else {for(const[el,text]of original)if(el.isConnected)el.textContent=text;original.clear();}
  };
  sync();
  const unsubscribe=controller.subscribe(sync);
  return () => {
    unsubscribe();observer.disconnect();
    for(const[el,text]of original)if(el.isConnected)el.textContent=text;
    original.clear();
    if(previous===null)document.body.removeAttribute('data-yuexin-personal');else document.body.setAttribute('data-yuexin-personal',previous);
  };
}


// Align the footer backing to the real input-card bottom as its height changes.
export function installFooterAlignment(){
 const selector=role('composerSeat')+':not('+role('composerHero')+')';
 const entries=new Map();let timer=0,disposed=false;
 const update=seat=>{const entry=entries.get(seat);if(!entry)return;const a=seat.getBoundingClientRect(),b=entry.card.getBoundingClientRect();if(a.height>0&&b.height>0)seat.style.setProperty('--yuexin-footer-top',Math.max(0,b.bottom-a.top)+'px')};
 const release=seat=>{const e=entries.get(seat);if(!e)return;resize.unobserve(seat);resize.unobserve(e.card);if(e.old)seat.style.setProperty('--yuexin-footer-top',e.old,e.priority);else seat.style.removeProperty('--yuexin-footer-top');entries.delete(seat)};
 const resize=new ResizeObserver(()=>{for(const seat of entries.keys())update(seat)});
 const scan=()=>{timer=0;if(disposed)return;for(const seat of document.querySelectorAll(selector)){const card=[...seat.querySelectorAll(role('card'))].find(x=>x.querySelector(role('input')));if(!card)continue;if(entries.get(seat)?.card!==card){release(seat);entries.set(seat,{card,old:seat.style.getPropertyValue('--yuexin-footer-top'),priority:seat.style.getPropertyPriority('--yuexin-footer-top')});resize.observe(seat);resize.observe(card)}update(seat)}for(const seat of entries.keys())if(!seat.isConnected||!seat.matches(selector))release(seat)};
 const mutations=new MutationObserver(()=>{if(!timer)timer=setTimeout(scan,80)});mutations.observe(document.body,{childList:true,subtree:true});scan();return()=>{disposed=true;clearTimeout(timer);mutations.disconnect();for(const seat of [...entries.keys()])release(seat);resize.disconnect()};
}

// Both surfaces sample a fixed wallpaper plane, so the corner has no material seam.
export function joinedMaterialCss(){return `body[data-yuexin-art] :is(:is([class$="_sidebarCol"],[class*="_sidebarCol "]),:is([class$="_composerSeat"],[class*="_composerSeat "]):not(:is([class$="_composerHero"],[class*="_composerHero "])))::before{background-color:transparent;background-image:linear-gradient(var(--yuexin-glass),var(--yuexin-glass)),var(--yuexin-scene);background-size:cover;background-position:center;background-attachment:fixed;backdrop-filter:none;-webkit-backdrop-filter:none;filter:blur(8px);clip-path:inset(16px)}
body[data-yuexin-art] :is([class$="_sidebarCol"],[class*="_sidebarCol "])::before{inset:-16px}
body[data-yuexin-art] :is([class$="_composerSeat"],[class*="_composerSeat "]):not(:is([class$="_composerHero"],[class*="_composerHero "]))::before{left:-16px;right:-16px;bottom:-16px;top:calc(var(--yuexin-footer-top,calc(100% - 28px)) - 16px)}
@media(prefers-reduced-transparency:reduce){body[data-yuexin-art] :is(:is([class$="_sidebarCol"],[class*="_sidebarCol "]),:is([class$="_composerSeat"],[class*="_composerSeat "]):not(:is([class$="_composerHero"],[class*="_composerHero "])))::before{filter:none;background-image:none;background-color:var(--dsw-alias-bg-module-platform)}}

@media(max-width:600px){body[data-yuexin-art] :is([class$="_sidebarCol"],[class$="_composerSeat"])::before{background-position:70% center}}

`;}
