#!/usr/bin/env node
// Reference capture tool. Copy into the game project as scripts/shoot.mjs and
// adapt the ready-signal / API names to what ARCHITECTURE.md declares.
//
//   node scripts/shoot.mjs --showcase <module> --preset close --time 18.5 \
//        --scenario <name> --seed 7 --out docs/shots/<module>/r3-close-1830 \
//        [--headful] [--unfrozen] [--settle 1500]
//
// Writes <out>.png and <out>.json. Requires: npm i -D puppeteer
import puppeteer from 'puppeteer'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]?.startsWith('--') || arr[i + 1] === undefined ? true : arr[i + 1]])
  return acc
}, []))

const base = process.env.GAME_URL ?? 'http://localhost:5173/'
const q = new URLSearchParams()
for (const k of ['showcase', 'preset', 'scenario', 'time', 'seed']) if (args[k] !== undefined) q.set(k, String(args[k]))
if (!args.unfrozen) q.set('freeze', '1')
const url = `${base}?${q}`
const out = args.out ?? `shots/${args.showcase ?? 'game'}-${Date.now()}`
const width = 1920, height = 1080
const headful = Boolean(args.headful)

await mkdir(dirname(out), { recursive: true })

const browser = await puppeteer.launch({
  headless: headful ? false : 'new',
  args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', `--window-size=${width},${height}`],
})
const page = await browser.newPage()
await page.setViewport({ width, height, deviceScaleFactor: 1 })

const errors = [], rejections = [], consoleErrors = []
let warnings = 0, contextLost = false
page.on('pageerror', e => errors.push(String(e?.stack ?? e)))
page.on('console', m => {
  const t = m.type(), text = m.text()
  if (t === 'error') consoleErrors.push(text)
  if (t === 'warning' || t === 'warn') warnings++
  if (/context lost/i.test(text)) contextLost = true
})
await page.evaluateOnNewDocument(() => {
  window.addEventListener('unhandledrejection', e => {
    ;(window.__REJECTIONS__ ??= []).push(String(e.reason?.stack ?? e.reason))
  })
})

const t0 = Date.now()
await page.goto(url, { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.__GAME_READY__ === true, { timeout: 60_000 })
const readyMs = Date.now() - t0

const settleMs = Number(args.settle ?? 1500)
await new Promise(r => setTimeout(r, settleMs))

const info = await page.evaluate(() => {
  const g = window.__GAME__ ?? {}
  const stats = typeof g.stats === 'function' ? g.stats() : null
  let renderer = null
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') ?? c.getContext('webgl')
    const dbg = gl?.getExtension('WEBGL_debug_renderer_info')
    renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null
  } catch {}
  return { stats, renderer, rejections: window.__REJECTIONS__ ?? [], three: window.__THREE_VERSION__ ?? null }
})
rejections.push(...info.rejections)

await page.screenshot({ path: `${out}.png`, type: 'png' })

const headlessGpu = !headful || /swiftshader|llvmpipe/i.test(info.renderer ?? '')
const log = {
  url, showcase: args.showcase ?? null, preset: args.preset ?? null, scenario: args.scenario ?? null,
  time: args.time !== undefined ? Number(args.time) : null, seed: args.seed !== undefined ? Number(args.seed) : null,
  frozen: !args.unfrozen, readyMs, settleMs,
  errors, consoleErrors, rejections, contextLost, warnings,
  stats: info.stats ? { ...info.stats, fps: headlessGpu ? null : info.stats.fps } : null,
  gpu: { renderer: info.renderer, headless: headlessGpu },
  viewport: [width, height], threeVersion: info.three, takenAt: new Date().toISOString(),
}
await writeFile(`${out}.json`, JSON.stringify(log, null, 2))
await browser.close()

const gate = errors.length === 0 && rejections.length === 0 && !contextLost
console.log(`${gate ? 'OK ' : 'ERR'} ${out}.png  errors=${errors.length} rejections=${rejections.length} warnings=${warnings} fps=${log.stats?.fps ?? 'n/a'} drawCalls=${log.stats?.drawCalls ?? 'n/a'}`)
process.exit(gate ? 0 : 1)
