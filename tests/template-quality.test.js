const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('index.html');
const scripts = read('static/js/scripts.js');
const mainCss = read('static/css/main.css');
const config = read('contents/config.yml');
const gitignore = read('.gitignore');

const { load } = require('../static/js/js-yaml.min.js');
const { parse } = require('../static/js/marked.min.js');
const projectConfig = load(config);
const projectBase = new URL('https://gwenstadii.github.io/monohair-io/');

assert.equal(index.includes('polyfill.io'), false, 'polyfill.io must not be loaded');
assert.doesNotMatch(index, /<(?:script|link)\b[^>]*(?:src|href)="https?:\/\//, 'page should not depend on external scripts or styles');
assert.equal(
  /<link[^>]+static\/css\/styles\.css/.test(index) && /@import\s+["']\.\/styles\.css["']/.test(mainCss),
  false,
  'styles.css should not be loaded both directly and through main.css'
);
assert.equal(index.includes(' mt5 '), false, 'invalid mt5 class should not be used');
assert.equal(index.includes(' md5'), false, 'invalid md5 class should not be used');
assert.match(index, /role="img" aria-label="[^"]+"/, 'comparison should have a text equivalent');
assert.match(index, /<label for="specimen-split">/, 'comparison slider should have a visible label');
assert.equal([...index.matchAll(/name="specimen-view"/g)].length, 3, 'comparison should offer three views');
assert.equal(mainCss.includes('background-size: fill'), false, 'background-size: fill is invalid CSS');
assert.equal(index.includes('github.com/senli1073'), false, 'template should not hard-code the original author GitHub URL');
assert.equal(/<section[^>]+class="top-section"[^>]+style=/.test(index), false, 'hero background should not be defined with inline styles');
assert.ok(fs.existsSync(path.join(root, '.nojekyll')), 'GitHub Pages should serve static files as-is');
assert.match(scripts, /function\s+initBackgroundSlideshow/, 'background slideshow should be initialized from JS');
assert.match(mainCss, /prefers-reduced-motion:\s*reduce/, 'slideshow should respect reduced motion preferences');
assert.doesNotMatch(index, /static\/assets\/img\/photo\.png/, 'template avatar should not appear on the project site');
assert.match(gitignore, /^\.superpowers\/$/m, '.superpowers companion artifacts should be ignored');
assert.equal(/getElementById\(key\)\.innerHTML\s*=\s*yml\[key\]/.test(scripts), false, 'YAML config values should not be injected with innerHTML');
assert.match(scripts, /typesetPromise/, 'MathJax should be invoked with typesetPromise');
assert.equal(/MathJax\.typeset\(\)/.test(scripts), false, 'MathJax.typeset() should not be called repeatedly per section');
assert.equal(/const\s+section_names\s*=/.test(scripts), false, 'section list should come from configuration instead of a JS constant');
assert.equal(/^nav:\s*$/m.test(config), false, 'navigation should be derived from sections instead of a separate nav list');
assert.deepEqual(projectConfig.sections.map(({ id }) => id), ['planning', 'demos', 'results', 'home']);
assert.equal(/sections:\n(?:\s+-\s+\w+\n?)+$/m.test(config), false, 'sections should not be a plain string list');
assert.equal(/<ul class="navbar-nav ms-auto me-4 my-3 my-lg-0">\s*<li/s.test(index), false, 'navigation items should be rendered from configuration');
assert.match(index, /<main id="sections"[^>]*><\/main>/, 'content sections should be rendered into a single sections container');
assert.equal(/<section[^>]+id="home"/.test(index), false, 'home section should not be hard-coded in index.html');
assert.equal(/<section[^>]+id="publications"/.test(index), false, 'publications section should not be hard-coded in index.html');
assert.equal(/<section[^>]+id="awards"/.test(index), false, 'awards section should not be hard-coded in index.html');
const rendered = projectConfig.sections.map(({ id, nav, title }) => {
  assert.ok(nav && title, `missing display text for ${id}`);
  return parse(read(`contents/${id}.md`), { mangle: false, headerIds: false });
});
assert.equal([...rendered[1].matchAll(/<video\b[^>]*\bcontrols\b/g)].length, 2, 'both demos should have playback controls');
assert.match(rendered[2], /<table>/, 'results should render as a table');
const planning = rendered[0];
assert.match(planning, /<img[^>]*planning-method\.svg[^>]*alt="[^"]+"/, 'method figure should include a text alternative');
assert.deepEqual([...planning.matchAll(/<meter[^>]*value="([\d.]+)"/g)].map((match) => match[1]), ['0.452', '0.588', '0.632', '0.758', '0.846', '0.943']);
assert.match(planning, /0\.919 不是可执行的理发方案/, 'constrained evaluation should distinguish the shortcut score');
for (const [, asset] of [index, ...rendered].join('\n').matchAll(/\b(?:src|href|poster)="([^"#:]+)"/g)) {
  const resolved = new URL(asset, projectBase);
  assert.ok(resolved.href.startsWith(projectBase.href), `${asset} must resolve inside the project site`);
  assert.ok(fs.statSync(path.join(root, resolved.href.slice(projectBase.href.length))).size > 0, `${asset} should exist`);
}
assert.match(scripts, /function\s+renderSections/, 'sections should be generated from configuration');
assert.match(scripts, /bg-gradient-primary-to-secondary-light/, 'generated sections should include light background styling');
assert.match(scripts, /bg-gradient-primary-to-secondary-gray/, 'generated sections should include gray background styling');
assert.equal(/['"]mt-5['"]/.test(scripts), false, 'generated sections should not add extra top margins');
assert.equal(/['"]mb-5['"]/.test(scripts), false, 'generated sections should not add extra bottom margins');
assert.match(index, /<body[^>]*class="site-loading"/, 'page should start in a loading state before async content is ready');
assert.match(index, /id="page-skeleton"/, 'page should include skeleton placeholders for initial async loading');
assert.match(mainCss, /@keyframes\s+skeleton-shimmer/, 'skeleton placeholders should use a shimmer animation');
assert.match(mainCss, /animation:\s*skeleton-shimmer/, 'skeleton placeholders should show a moving shimmer while loading');
assert.match(mainCss, /prefers-reduced-motion:\s*reduce[\s\S]*\.skeleton-block/, 'skeleton animation should respect reduced motion preferences');
assert.match(scripts, /function\s+markSiteReady/, 'JS should expose a loading completion transition');
assert.match(scripts, /\.finally\(\(\)\s*=>\s*markSiteReady\(\)\)/, 'site should leave loading state even if content loading fails');
assert.doesNotMatch(index, /skeleton-nav/, 'navbar should not use skeleton placeholders');
assert.doesNotMatch(index, /skeleton-hero/, 'hero text should not use skeleton placeholder markup');
assert.doesNotMatch(index, /skeleton-avatar/, 'avatar should not use skeleton placeholders');
assert.doesNotMatch(mainCss, /\.skeleton-nav\b/, 'navbar skeleton CSS should not be kept');
assert.doesNotMatch(mainCss, /\.skeleton-hero\b/, 'hero text skeleton CSS should not be kept');
assert.doesNotMatch(mainCss, /\.skeleton-avatar\b/, 'avatar skeleton CSS should not be kept');
assert.match(mainCss, /\.page-skeleton\s*\{[\s\S]*top:\s*25rem/, 'section skeleton should start below the real hero area');
assert.match(mainCss, /\.page-skeleton\s*\{[\s\S]*padding-top:\s*2\.4rem/, 'section skeleton placeholders should sit one text line lower');
assert.match(mainCss, /\.site-loading \.top-section\s*\{[\s\S]*linear-gradient/, 'hero background should keep a loading placeholder');
assert.match(mainCss, /\.site-loading \.top-section::after\s*\{[\s\S]*animation:\s*skeleton-shimmer/, 'hero background placeholder should shimmer while loading');
assert.match(index, /id="page-top-title"[^>]*>MonoHair 复现<\/a>/, 'navbar brand should identify the project before config loads');
assert.match(mainCss, /\.page-skeleton\s*\{[\s\S]*z-index:\s*8000/, 'section skeleton should stay below the avatar layer');
assert.match(mainCss, /#avatar\s*\{[\s\S]*z-index:\s*9000/, 'avatar should stay above the section skeleton while loading');
assert.match(mainCss, /\.skeleton-block\s*\{[\s\S]*max-width:\s*100%/, 'skeleton blocks should never overflow their container');
assert.match(mainCss, /\.skeleton-line-long\s*\{[\s\S]*width:\s*100%/, 'long skeleton lines should shrink with the content container');
assert.match(mainCss, /\.skeleton-line-short\s*\{[\s\S]*width:\s*68%/, 'short skeleton lines should use proportional width for narrow screens');

console.log('template quality checks passed');
