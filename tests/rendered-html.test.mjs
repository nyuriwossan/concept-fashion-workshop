import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished workshop", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="ja">/i);
  assert.match(html, /<title>コンセプトファッション工房<\/title>/i);
  assert.match(html, /ひらめきを/);
  assert.match(html, /衣装だけ/);
  assert.match(html, /衣装＋ポーズ/);
  assert.match(html, /完成プロンプト/);
  assert.match(html, /おすすめを読み込む/);
  assert.match(html, /完全リセット/);
  assert.match(html, /<strong>未選択<\/strong>/);
  assert.doesNotMatch(html, /aria-pressed="true"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/i);
});

test("keeps the mobile and interaction contracts in source", async () => {
  const [page, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /type="range"/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /navigator\.clipboard/);
  assert.match(page, /buildPrompt/);
  assert.match(css, /--tap:\s*44px/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(css, /@media \(max-width:\s*560px\)/);
  assert.match(layout, /title:\s*"コンセプトファッション工房"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
