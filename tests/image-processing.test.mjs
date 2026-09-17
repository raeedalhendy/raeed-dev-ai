import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { optimizeImage, MAX_IMAGE_BYTES } from "../app/_lib/image-processing.ts";

test("lossless image compression preserves dimensions and decoded pixels", async () => {
  const input = await sharp({create:{width:400,height:300,channels:3,background:"#1745ff"}}).png({compressionLevel:0}).toBuffer();
  const result = await optimizeImage(input);
  assert.ok(result.data.length < input.length);
  assert.equal(result.width,400);
  assert.equal(result.height,300);
  assert.deepEqual(await sharp(result.data).raw().toBuffer(), await sharp(input).raw().toBuffer());
});
test("transparent PNG remains transparent with exact pixels", async () => {
  const input = await sharp({create:{width:100,height:100,channels:4,background:{r:15,g:80,b:150,alpha:0.5}}}).png().toBuffer();
  const result = await optimizeImage(input);
  assert.ok(result.data.length <= input.length);
  assert.deepEqual(await sharp(result.data).ensureAlpha().raw().toBuffer(),await sharp(input).ensureAlpha().raw().toBuffer());
});
test("JPEG output never increases size", async () => {
  const input = await sharp({create:{width:140,height:80,channels:3,background:"#395172"}}).jpeg().toBuffer();
  const result = await optimizeImage(input);
  assert.ok(result.data.length <= input.length);
  assert.deepEqual(await sharp(result.data).raw().toBuffer(),await sharp(input).raw().toBuffer());
});
test("rejects corrupt data, oversized uploads and SVG", async () => {
  await assert.rejects(optimizeImage(Buffer.from("not an image")));
  await assert.rejects(optimizeImage(Buffer.alloc(MAX_IMAGE_BYTES+1)));
  await assert.rejects(optimizeImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>')));
});
