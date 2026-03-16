import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import CartManager from '../src/managers/CartManager.js';

describe('CartManager', () => {
  let cm;
  let tmpFile;

  beforeEach(async () => {
    tmpFile = path.join(os.tmpdir(), `carts-${Date.now()}.json`);
    cm = new CartManager(tmpFile);
    await cm.initialize();
  });

  afterEach(async () => {
    try { await fs.unlink(tmpFile); } catch {}
  });

  test('createCart returns new cart', async () => {
    const cart = await cm.createCart();
    assert.ok(cart.id !== undefined);
    assert.deepStrictEqual(cart.products, []);
  });

  test('addProductToCart increments quantity', async () => {
    const cart = await cm.createCart();
    await cm.addProductToCart(cart.id, 100, 1);
    await cm.addProductToCart(cart.id, 100, 2);
    const updated = await cm.getCartById(cart.id);
    assert.deepStrictEqual(updated.products, [{product:100,quantity:3}]);
  });

  test('addProductToCart invalid quantity throws', async () => {
    const cart = await cm.createCart();
    await assert.rejects(() => cm.addProductToCart(cart.id, 1, 0));
    await assert.rejects(() => cm.addProductToCart(cart.id, 1, -1));
  });
});