import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import ProductManager from '../src/managers/ProductManager.js';
import { ValidationError, DuplicateError } from '../src/utils/errors.js';

describe('ProductManager', () => {
  let pm;
  let tmpFile;

  beforeEach(async () => {
    tmpFile = path.join(os.tmpdir(), `products-${Date.now()}.json`);
    pm = new ProductManager(tmpFile);
    await pm.initialize();
  });

  afterEach(async () => {
    try { await fs.unlink(tmpFile); } catch {}
  });

  test('addProduct enforces required fields', async () => {
    await assert.rejects(() => pm.addProduct({}), ValidationError);
  });

  test('addProduct checks price and stock types', async () => {
    await assert.rejects(() => pm.addProduct({ title:'a', description:'b', code:'c', price:-1, stock:1 }), ValidationError);
    await assert.rejects(() => pm.addProduct({ title:'a', description:'b', code:'c', price:1, stock:-1 }), ValidationError);
  });

  test('addProduct prevents duplicate codes', async () => {
    const p = await pm.addProduct({ title:'t', description:'d', code:'C01', price:1, stock:1 });
    await assert.rejects(() => pm.addProduct({ title:'x', description:'y', code:'C01', price:2, stock:2 }), DuplicateError);
  });

  test('updateProduct validates and enforces unique code', async () => {
    const p1 = await pm.addProduct({ title:'t1', description:'d1', code:'A', price:1, stock:1 });
    const p2 = await pm.addProduct({ title:'t2', description:'d2', code:'B', price:2, stock:2 });
    await assert.rejects(() => pm.updateProduct(p1.id, { price:-5 }), ValidationError);
    await assert.rejects(() => pm.updateProduct(p1.id, { code:'B' }), DuplicateError);
  });

  test('getProductById returns correct item', async () => {
    const p = await pm.addProduct({ title:'x', description:'y', code:'Z', price:1, stock:1 });
    const found = await pm.getProductById(p.id);
    assert.deepStrictEqual(found, p);
  });

  test('deleteProduct removes item', async () => {
    const p = await pm.addProduct({ title:'x', description:'y', code:'Z2', price:1, stock:1 });
    await pm.deleteProduct(p.id);
    const found = await pm.getProductById(p.id);
    assert.strictEqual(found, undefined);
  });
});