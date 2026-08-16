import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../gh-pages/", import.meta.url);

test("GitHub Pages build uses the repository base path", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");
  assert.match(html, /lang="ja"/);
  assert.match(html, /コンセプトファッション工房/);
  assert.match(html, /\/concept-fashion-workshop\/assets\//);
});

test("GitHub Pages bundle contains the interactive app and mobile styles", async () => {
  const files = await readdir(new URL("assets/", outputRoot));
  const jsFile = files.find((file) => file.endsWith(".js"));
  const cssFile = files.find((file) => file.endsWith(".css"));
  assert.ok(jsFile);
  assert.ok(cssFile);
  const [js, css] = await Promise.all([
    readFile(new URL(`assets/${jsFile}`, outputRoot), "utf8"),
    readFile(new URL(`assets/${cssFile}`, outputRoot), "utf8"),
  ]);
  assert.match(js, /衣装＋ポーズだけ/);
  assert.match(js, /完成プロンプト/);
  assert.match(js, /袖なし/);
  assert.match(js, /生脚/);
  assert.match(js, /完全リセット/);
  assert.match(js, /おすすめを読み込む/);
  assert.match(js, /旗袍（チャイナドレス）/);
  assert.match(css, /overflow-x:hidden/);
  assert.match(css, /(?:max-width:|width<=)560px/);
});
