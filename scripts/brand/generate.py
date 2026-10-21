"""
Генератор фирменной графики BayBol Visa.

Создаёт SVG-логотипы (текст переведён в контуры — выглядят одинаково везде),
favicon и SVG-исходник og-картинки. PNG делает scripts/brand/render.mjs (sharp).

Запуск (нужен Python 3 + fonttools + brotli):
    python3 scripts/brand/generate.py && node scripts/brand/render.mjs
"""

import glob
import os
import random
import re

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
FONTS = os.path.join(os.path.dirname(__file__), 'fonts')
ASSETS = os.path.join(ROOT, 'src', 'assets', 'logo')
PUBLIC = os.path.join(ROOT, 'public')
BUILD = os.path.join(os.path.dirname(__file__), 'build')

GOLD = {'neon': '#F4C46A', 'glow': '#FFE2A8', 'deep': '#C8932E'}
SKY = {'neon': '#6CC3FF', 'glow': '#BFE6FF', 'deep': '#2E8FD6'}

# ---------- шрифты ----------
_fonts = {}


def fonts(weight):
    if weight not in _fonts:
        # weight — число (Geologica) или префикс файла, например 'Literata-300'
        prefix = f'Geologica-{weight}' if isinstance(weight, int) else weight
        _fonts[weight] = [TTFont(p) for p in sorted(glob.glob(os.path.join(FONTS, f'{prefix}-*.woff2')))]
    return _fonts[weight]


def text_path(text, weight, size, x, y, tracking=0.0):
    """Переводит строку в SVG path. Возвращает (d, ширина)."""
    d_parts = []
    cursor = 0.0
    for ch in text:
        for f in fonts(weight):
            cmap = f.getBestCmap()
            if ord(ch) in cmap:
                break
        else:
            raise ValueError(f'Нет глифа {ch!r}')
        upm = f['head'].unitsPerEm
        scale = size / upm
        name = cmap[ord(ch)]
        gs = f.getGlyphSet()
        pen = SVGPathPen(gs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x + cursor, y))
        gs[name].draw(tpen)
        d_parts.append(pen.getCommands())
        cursor += f['hmtx'][name][0] * scale + tracking * size
    width = cursor - tracking * size
    return ' '.join(p for p in d_parts if p), width


# ---------- знаки (viewBox 0 0 64 64) ----------
PLANE = ('M9 0 C9 -.9 7.6 -1.4 5 -1.4 L1.6 -1.4 L-2.6 -7.6 L-5 -7.6 L-2.4 -1.4 L-5.6 -1.4 L-7.6 -4 L-9.2 -4 '
         'L-8 0 L-9.2 4 L-7.6 4 L-5.6 1.4 L-2.4 1.4 L-5 7.6 L-2.6 7.6 L1.6 1.4 L5 1.4 C7.6 1.4 9 .9 9 0 Z')


def gold_gradient(pid, light):
    stops = (GOLD['glow'], GOLD['neon'], GOLD['deep']) if not light else (GOLD['neon'], '#DDA94A', GOLD['deep'])
    return (
        f'<radialGradient id="{pid}g" cx="34%" cy="28%" r="80%">'
        f'<stop offset="0" stop-color="{stops[0]}"/><stop offset=".55" stop-color="{stops[1]}"/>'
        f'<stop offset="1" stop-color="{stops[2]}"/></radialGradient>'
    )


def mark_coin(pid='c', light=False):
    """Вариант 1: золотая монета + голубая траектория полёта, выходящая за край."""
    blue = SKY['deep'] if light else SKY['neon']
    arc = 'M5 55 Q20 23 46.5 15'
    return (
        f'<defs>{gold_gradient(pid, light)}'
        f'<mask id="{pid}m" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">'
        f'<rect width="64" height="64" fill="#fff"/>'
        f'<path d="{arc}" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round"/></mask></defs>'
        f'<circle cx="28" cy="37" r="19" fill="url(#{pid}g)" mask="url(#{pid}m)"/>'
        f'<path d="{arc}" fill="none" stroke="{blue}" stroke-width="3.6" stroke-linecap="round"/>'
        f'<path d="{PLANE}" fill="{blue}" transform="translate(54.5 12.2) rotate(-17) scale(.95)"/>'
    )


def mark_monogram(pid='b', light=False):
    """Вариант 2: буква B — верхняя петля золотая, нижняя — голубая линия полёта с самолётом."""
    gold = GOLD['deep'] if light else GOLD['neon']
    blue = SKY['deep'] if light else SKY['neon']
    return (
        f'<path d="M17 54 V10 H31 a10 10 0 0 1 0 20 H17" fill="none" stroke="{gold}" stroke-width="5.5" '
        f'stroke-linecap="round" stroke-linejoin="round"/>'
        f'<path d="M17 54 H33 C42 54 47 48 47 42 C47 35 42 30 33 30 H24" fill="none" stroke="{blue}" '
        f'stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<path d="M47 40 Q52 30 54 22" fill="none" stroke="{blue}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 4"/>'
        f'<path d="{PLANE}" fill="{blue}" transform="translate(55.5 15) rotate(-70) scale(.85)"/>'
    )


def mark_palm(pid='p', light=False):
    """Вариант 3: «ладонь мира» — золотой изгиб-ладонь, над ней голубая орбита с самолётом."""
    gold = GOLD['deep'] if light else GOLD['neon']
    blue = SKY['deep'] if light else SKY['neon']
    return (
        f'<defs>{gold_gradient(pid, light)}</defs>'
        f'<path d="M8 38 C11 52 26 57 40 53 C47 51 52 46 56 39" fill="none" stroke="{gold}" stroke-width="4.5" stroke-linecap="round"/>'
        f'<path d="M45 50 C46 44 50 41 55 40" fill="none" stroke="{gold}" stroke-width="3.2" stroke-linecap="round"/>'
        f'<circle cx="32" cy="30" r="9" fill="url(#{pid}g)"/>'
        f'<ellipse cx="32" cy="30" rx="21" ry="7.5" fill="none" stroke="{blue}" stroke-width="2.4" transform="rotate(-20 32 30)"/>'
        f'<path d="{PLANE}" fill="{blue}" transform="translate(50.5 21.5) rotate(-60) scale(.8)"/>'
    )


def svg(inner, w, h, extra=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"{extra}>{inner}</svg>\n'


# ---------- полный логотип ----------
SLOGAN = 'ӘЛЕМ СЕНІҢ ҚОЛЫҢДА'


def lockup(light=False, pid='L'):
    """Знак + «BayBol» золотом + «Visa» голубым + слоган. Возвращает (inner, w, h)."""
    gold = GOLD['deep'] if light else GOLD['neon']
    blue = SKY['deep'] if light else SKY['neon']
    grey = '#6B7489' if light else '#A9B3D1'
    size = 44
    x0 = 82
    d1, w1 = text_path('BayBol', 700, size, x0, 44)
    d2, w2 = text_path('Visa', 700, size, x0 + w1 + 9, 44)
    total = w1 + 9 + w2
    sd, sw = text_path(SLOGAN, 500, 10.5, 0, 0, tracking=0.34)
    sx = x0 + (total - sw) / 2 if sw < total else x0
    sd, _ = text_path(SLOGAN, 500, 10.5, sx, 66, tracking=0.34)
    glow = ''
    filt_g = filt_b = ''
    if False:  # неоновое свечение отключено — чище и спокойнее
        glow = (
            f'<defs><filter id="{pid}fg" x="-20%" y="-40%" width="140%" height="180%">'
            f'<feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="{GOLD["glow"]}" flood-opacity=".55"/></filter>'
            f'<filter id="{pid}fb" x="-20%" y="-40%" width="140%" height="180%">'
            f'<feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="{SKY["glow"]}" flood-opacity=".55"/></filter></defs>'
        )
        filt_g = f' filter="url(#{pid}fg)"'
        filt_b = f' filter="url(#{pid}fb)"'
    w = int(x0 + max(total, sw) + 4)
    inner = (
        glow
        + f'<g transform="translate(0 6)">{mark_coin(pid + "c", light)}</g>'
        + f'<path d="{d1}" fill="{gold}"{filt_g}/>'
        + f'<path d="{d2}" fill="{blue}"{filt_b}/>'
        + f'<path d="{sd}" fill="{grey}"/>'
    )
    return inner, w, 76


def favicon():
    # Два набора цветов: тёмная тема браузера — неон, светлая — тёмные оттенки
    dark = mark_coin('fd', light=False)
    light = mark_coin('fl', light=True)
    style = (
        '<style>.l{display:none}@media (prefers-color-scheme: light){.d{display:none}.l{display:inline}}</style>'
    )
    return svg(f'{style}<g class="d">{dark}</g><g class="l">{light}</g>', 64, 64)


def stars(n, w, h, seed=7):
    rnd = random.Random(seed)
    out = []
    for _ in range(n):
        x, y = rnd.random() * w, rnd.random() * h * 0.9
        r = rnd.choice([0.7, 0.9, 1.1, 1.4, 1.8])
        o = rnd.choice([0.25, 0.4, 0.6, 0.85])
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="#F5F7FF" opacity="{o}"/>')
    return ''.join(out)


def price_from_config():
    src = open(os.path.join(ROOT, 'src', 'config', 'site.ts'), encoding='utf-8').read()
    n = int(re.search(r'single:\s*(\d+)', src).group(1))
    return f'{n:,}'.replace(',', ' ') + ' ₸'


def og_image():
    """Картинка для соцсетей в стиле «Дорожные документы»: бумага, заголовок, посадочный талон."""
    W, H = 1200, 630
    paper, paper2, ink, ink2, gold, sky = '#F5F0E6', '#FBF8F2', '#14213A', '#5B6478', '#F4C46A', '#1F6FAE'
    logo, _, _ = lockup(True, 'og')
    t1, _ = text_path('Подадим анкету', 'Literata-300', 64, 72, 250)
    t2, _ = text_path('на грин-карту', 'Literata-300', 64, 72, 324)
    t3, _ = text_path('DV-2027', 'Literata-300', 64, 72, 398)
    sub, _ = text_path('Фото, анкета на всю семью, сбор $1 — всё в цене', 'PlexSans-400', 24, 72, 490)
    price = price_from_config()
    # талон справа
    tx, ty, tw, th, stub = 720, 160, 420, 290, 128
    cut = tx + tw - stub
    lab = lambda s, x, y: text_path(s, 'PlexMono-500', 13, x, y, tracking=0.08)[0]
    big = lambda s, x, y, size=40: text_path(s, 'PlexMono-500', size, x, y)[0]
    ala = big('ALA', tx + 28, ty + 128)
    usa_d, usa_w = text_path('USA', 'PlexMono-500', 40, 0, 0)
    usa = big('USA', cut - 28 - usa_w, ty + 128)
    pr_d, pr_w = text_path(price, 'PlexMono-500', 24, 0, 0)
    pr = text_path(price, 'PlexMono-500', 24, cut + (stub - pr_w) / 2, ty + 90)[0]
    bars = ''
    x, k = cut + 22, 0
    while x < tx + tw - 22:
        w = [1.5, 1.5, 3, 4.5][(k * 7) % 4]
        bars += f'<rect x="{x:.1f}" y="{ty + th - 92}" width="{w}" height="62" fill="{ink}"/>'
        x += w + [2, 3, 3, 4][(k * 5) % 4]
        k += 1
    ticket = (
        f'<defs><mask id="tm"><rect x="{tx}" y="{ty}" width="{tw}" height="{th}" fill="#fff"/>'
        f'<circle cx="{cut}" cy="{ty}" r="13" fill="#000"/><circle cx="{cut}" cy="{ty + th}" r="13" fill="#000"/></mask></defs>'
        f'<g transform="rotate(-3 {tx + tw / 2} {ty + th / 2})">'
        f'<rect x="{tx}" y="{ty}" width="{tw}" height="{th}" fill="{paper2}" stroke="{ink}" stroke-opacity=".35" mask="url(#tm)"/>'
        f'<line x1="{cut}" y1="{ty + 16}" x2="{cut}" y2="{ty + th - 16}" stroke="{ink}" stroke-opacity=".4" stroke-dasharray="4 4"/>'
        f'<path d="{lab("ПОСАДОЧНЫЙ ТАЛОН", tx + 28, ty + 42)}" fill="{ink2}"/>'
        f'<line x1="{tx + 28}" y1="{ty + 58}" x2="{cut - 28}" y2="{ty + 58}" stroke="{ink}" stroke-opacity=".25" stroke-dasharray="3 3"/>'
        f'<path d="{ala}" fill="{ink}"/><path d="{usa}" fill="{ink}"/>'
        f'<line x1="{tx + 118}" y1="{ty + 114}" x2="{cut - 118}" y2="{ty + 114}" stroke="{sky}" stroke-width="2" stroke-dasharray="5 4"/>'
        f'<path d="{lab("ПРОГРАММА", tx + 28, ty + 190)}" fill="{ink2}"/>'
        f'<path d="{text_path("DV-2027", "PlexMono-500", 20, tx + 28, ty + 218)[0]}" fill="{ink}"/>'
        f'<path d="{lab("МЕСТО", tx + 170, ty + 190)}" fill="{ink2}"/>'
        f'<path d="{text_path("ваше", "PlexMono-500", 20, tx + 170, ty + 218)[0]}" fill="{ink}"/>'
        f'<path d="{lab("ЦЕНА", cut + 22, ty + 42)}" fill="{ink2}"/>'
        f'<path d="{pr}" fill="{ink}"/>'
        + bars + '</g>'
    )
    inner = (
        f'<rect width="{W}" height="{H}" fill="{paper}"/>'
        f'<g transform="translate(72 64) scale(.95)">{logo}</g>'
        f'<line x1="72" y1="160" x2="{W - 72}" y2="160" stroke="{ink}" stroke-opacity=".18"/>'
        f'<path d="{t1}" fill="{ink}"/><path d="{t2}" fill="{ink}"/><path d="{t3}" fill="{ink}"/>'
        f'<path d="{sub}" fill="{ink2}"/>'
        f'<rect x="72" y="530" width="{text_path(price + " за анкету", "PlexSans-400", 24, 0, 0)[1] + 48}" height="54" fill="{gold}"/>'
        f'<path d="{text_path(price + " за анкету", "PlexSans-400", 24, 96, 566)[0]}" fill="{ink}"/>'
        + ticket
    )
    return svg(inner, W, H)


def touch_icon():
    inner = (
        '<rect width="180" height="180" fill="#F5F0E6"/>'
        f'<g transform="translate(26 24) scale(2)">{mark_coin("ti", True)}</g>'
    )
    return svg(inner, 180, 180)


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('  ✓', os.path.relpath(path, ROOT))


def main():
    # 3 варианта знака — для страницы /logo-preview
    for name, fn in (('coin', mark_coin), ('monogram', mark_monogram), ('palm', mark_palm)):
        write(os.path.join(ASSETS, f'mark-{name}.svg'), svg(fn(name[0]), 64, 64))
        write(os.path.join(ASSETS, f'mark-{name}-light.svg'), svg(fn(name[0] + 'l', True), 64, 64))

    # Выбранный знак — «Золотая монета + траектория»
    mark = svg(mark_coin('m'), 64, 64)
    full_dark = svg(*lockup(False, 'd'))
    full_light = svg(*lockup(True, 'l'))
    for base in (ASSETS, PUBLIC):
        write(os.path.join(base, 'logo-mark.svg'), mark)
        write(os.path.join(base, 'logo-full.svg'), full_dark)
        write(os.path.join(base, 'logo-full-light.svg'), full_light)
    write(os.path.join(PUBLIC, 'favicon.svg'), favicon())

    # Исходники для PNG
    write(os.path.join(BUILD, 'og-image.svg'), og_image())
    write(os.path.join(BUILD, 'apple-touch-icon.svg'), touch_icon())


if __name__ == '__main__':
    main()
