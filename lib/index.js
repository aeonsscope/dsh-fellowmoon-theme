/**
 * 超管局主题 · Host 半侧
 * ---------------------------------------------------------------------------
 * 只做一件事：把开机动画（启动序列）在界面挂载之前挂到 index.html 上。
 *   · 注册 /cpo-startup/splash.css、/cpo-startup/splash.js、/cpo-startup/asset/*
 *   · 用 webServer.tapIndex(html) 注入黑幕节点 + 配置 + 9 秒兜底脚本
 *
 * 外观（配色 / 侧栏图 / 文案）仍然全部在浏览器半侧 lib/client.js，这里不碰 DOM 样式。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DSH_HOME = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
const CONFIG_FILE = path.join(DSH_HOME, 'cpo-startup.json')
const NS = 'dsh-fellowmoon-theme'
const ROUTE_BASE = '/cpo-startup'
const ASSET_DIR = path.join(PACKAGE_ROOT, 'lib', 'startup', 'assets')
const ASSET_NAME = /^[a-z0-9._-]+\.(mp3|webp)$/i

const PLUGIN_VERSION = (() => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'))
    return String(pkg.version || '').trim() || '0.0.0'
  } catch (err) { return '0.0.0' }
})()

/* 与 lib/startup/splash.js 的 DEFAULTS 保持一致（那边只做兜底，这边是权威值） */
const DEFAULTS = {
  enabled: true,
  mode: 'session',
  theme: 'dark',
  speed: 1,
  requireInteraction: true,
  allowSkip: true,
  sound: true,
  soundVolume: 0.5,
  voice: true,
  voiceLang: 'zh-CN',
  voiceName: '',
  voiceRate: 0.88,
  voicePitch: 0.85,
  voiceVolume: 0.9,
  voiceCue: true,
  sfx: 'audio',
  voiceSource: 'asset',
  voiceLead: 240,
  identity: '橙刀锋特战组组长',
  identityId: 'CPO-0666',
  accessLevel: '4',
  brand1: 'CPO',
  brand2: 'COUNCIL OF PRETERNATURAL OBJECTS',
  brand3a: 'FIELD',
  brand3b: 'DIVISION',
  orgZh: '超现象管理局',
  orgEn: 'CPO',
  orgSub: 'COUNCIL OF PRETERNATURAL OBJECTS',
  welcomeBox: '超现象管理局',
  footer: '超实体从不停歇 · 超管局亦是',
  welcomeLine: '组长 欢迎归来',
  accent: '#ff7500',
  glitchA: '#ff3b30',
  glitchB: '#2971b8'
}

function readConfig() {
  const out = { ...DEFAULTS }
  try {
    const saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
    for (const key of Object.keys(DEFAULTS)) {
      if (saved && saved[key] !== undefined && saved[key] !== null) out[key] = saved[key]
    }
  } catch (err) { /* 没有配置文件就用默认值 */ }
  return out
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '')
}

/* 首屏兜底：界面挂载前先把窗口盖住，避免闪出本体 */
const CRITICAL_CSS = [
  'html.cpo-lock,html.cpo-lock body{overflow:hidden!important}',
  '#cpo-startup-root.cpo-boot{position:fixed;inset:0;z-index:2147483000;background:#000}'
].join('')

const BOOTSTRAP_JS = '(function(){try{' +
  'var c=window.__CPO_STARTUP__||{};' +
  "var root=document.getElementById('cpo-startup-root');" +
  'var off=!c.enabled;' +
  "if(!off&&c.mode==='session'&&sessionStorage.getItem('cpo-startup:shown')==='1')off=true;" +
  "if(!off&&c.mode==='daily'&&localStorage.getItem('cpo-startup:day')===new Date().toISOString().slice(0,10))off=true;" +
  'if(off){window.__CPO_STARTUP_SKIP__=true;if(root&&root.parentNode)root.parentNode.removeChild(root);}' +
  "else{document.documentElement.classList.add('cpo-lock');setTimeout(function(){try{" +
  'if(window.__CPO_STARTUP_RUNNING__===true)return;' +
  "var r=document.getElementById('cpo-startup-root');" +
  'if(r&&r.parentNode)r.parentNode.removeChild(r);' +
  "document.documentElement.classList.remove('cpo-lock');" +
  "if(document.body)document.body.style.overflow='';" +
  'window.__CPO_STARTUP_FAILED__=true;}catch(e){}},9000);}' +
  '}catch(e){}})()'

const name = NS
const inject = ['webServer', 'connection']

function resolveWebServer(ctx) {
  try {
    const viaGet = typeof ctx.get === 'function' ? ctx.get('webServer') : undefined
    if (viaGet) return viaGet
  } catch (err) { /* noop */ }
  return ctx.webServer
}

function hasRoutes(server) {
  return !!server && typeof server.register === 'function' && typeof server.tapIndex === 'function'
}

function apply(ctx) {
  const disposers = []
  const webServer = resolveWebServer(ctx)

  /* 桌面端若走 file:// + IPC 下发前端，就没有 webServer：不注册路由，插件照样 APPLIED，
     只少一段开机动画（本体外观不受影响）。 */
  if (!hasRoutes(webServer)) {
    try {
      ctx.logger?.warn?.(`[${NS}] 当前 profile 没有可用的 webServer，跳过开机动画的首屏注入。`)
    } catch (err) { /* noop */ }
    return
  }

  function rejected(req, res) {
    try {
      const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
      if (!conn || typeof conn.requestRejection !== 'function') return false
      const code = conn.requestRejection(req)
      if (code === undefined || code === null || code === false) return false
      res.statusCode = typeof code === 'number' ? code : 403
      res.end()
      return true
    } catch (err) { return false }
  }

  function registerRoute(route) {
    const inner = route?.handler
    const wrapped = Object.assign({}, route, {
      handler: async (req, res) => {
        if (rejected(req, res)) return
        return inner(req, res)
      }
    })
    return webServer.register(wrapped)
  }

  function sendText(res, type, text) {
    const body = Buffer.from(text, 'utf8')
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-store',
      'Content-Length': String(body.length)
    })
    res.end(body)
  }

  function readStatic(rel) {
    return fs.readFileSync(path.join(PACKAGE_ROOT, rel), 'utf8')
  }

  disposers.push(registerRoute({
    kind: 'exact',
    path: `${ROUTE_BASE}/splash.css`,
    handler: (req, res) => sendText(res, 'text/css; charset=utf-8', readStatic('lib/startup/splash.css'))
  }))

  disposers.push(registerRoute({
    kind: 'exact',
    path: `${ROUTE_BASE}/splash.js`,
    handler: (req, res) => sendText(res, 'application/javascript; charset=utf-8', readStatic('lib/startup/splash.js'))
  }))

  /* 终幕欢迎语候选名单：只回 lib/startup/assets/ 里的 mp3 文件名，
     形状是 {ok:true, names:['line-6.mp3',…]}。不放路径、不做目录列举以外的事。 */
  disposers.push(registerRoute({
    kind: 'exact',
    path: `${ROUTE_BASE}/voices`,
    handler: (req, res) => {
      let names = []
      try {
        names = fs.readdirSync(ASSET_DIR).filter((n) => /^[a-z0-9._-]+\.mp3$/i.test(n))
      } catch (e) { names = [] }
      sendText(res, 'application/json; charset=utf-8', JSON.stringify({ ok: true, names }))
    }
  }))

  /* 素材：徽标 webp + 台词/音效 mp3。白名单 + basename，杜绝目录穿越。 */
  disposers.push(registerRoute({
    kind: 'prefix',
    path: `${ROUTE_BASE}/asset`,
    handler: (req, res) => {
      const rawName = path.basename(decodeURIComponent((req.url || '').split('?')[0]))
      if (!ASSET_NAME.test(rawName) || rawName.includes('..')) {
        res.writeHead(404); res.end(); return
      }
      let bytes
      try { bytes = fs.readFileSync(path.join(ASSET_DIR, rawName)) } catch (err) {
        res.writeHead(404); res.end(); return
      }
      const type = rawName.toLowerCase().endsWith('.webp') ? 'image/webp' : 'audio/mpeg'
      res.writeHead(200, {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': String(bytes.length)
      })
      res.end(bytes)
    }
  }))

  disposers.push(webServer.tapIndex((html) => {
    if (!html || html.includes(`${ROUTE_BASE}/splash.js`)) return html
    const cfg = readConfig()
    const head =
      `<link rel="stylesheet" href="${ROUTE_BASE}/splash.css">` +
      '<style id="cpo-startup-critical">' + CRITICAL_CSS + '</style>'
    const body =
      '<div id="cpo-startup-root" class="cpo-root cpo-boot"></div>' +
      '<script>window.__CPO_STARTUP_BOOT__="index";window.__CPO_STARTUP_VERSION__=' +
      safeJson(PLUGIN_VERSION) + ';window.__CPO_STARTUP__=' + safeJson(cfg) + ';' + BOOTSTRAP_JS + '</script>' +
      `<script defer src="${ROUTE_BASE}/splash.js"></script>`

    let out = html
    if (out.includes('</head>')) out = out.replace('</head>', head + '</head>')
    else out = head + out
    if (out.includes('<body>')) out = out.replace('<body>', '<body>' + body)
    else if (out.includes('</body>')) out = out.replace('</body>', body + '</body>')
    else out = out + body
    return out
  }))

  ctx.effect(() => () => {
    for (const dispose of disposers) {
      try { dispose() } catch (err) { /* noop */ }
    }
  })
}

export { apply, inject, name }
