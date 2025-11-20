#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ElectrumNetworkProvider } from "cashscript";
import { binToHex } from "@bitauth/libauth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../frontend/.env.local");
if (!fs.existsSync(envPath)) {
  console.error(".env.local not found at frontend/.env.local");
  process.exit(1);
}
const env = fs.readFileSync(envPath, "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`${k}=(.+)`));
  return m ? m[1].trim() : "";
};
const tokenA = get("VITE_TOKEN_A_CATEGORY");
const tokenB = get("VITE_TOKEN_B_CATEGORY");
const lpToken = get("VITE_LP_TOKEN_CATEGORY");
const poolAddr = get("VITE_LIQUIDITY_POOL_ADDRESS");

if (!poolAddr) {
  console.error("VITE_LIQUIDITY_POOL_ADDRESS not set in .env.local");
  process.exit(1);
}

/**
 * Turn various possible representations into a Uint8Array suitable for binToHex.
 * Accepts:
 *  - hex string ("deadbeef" or "0xdeadbeef")
 *  - Buffer
 *  - Uint8Array / TypedArray
 *  - JS Array of numbers
 *  - { type: 'Buffer', data: [...] } (serialized Buffer)
 * Returns null if it can't convert.
 */
function normalizeCategoryToBytes(cat) {
  if (!cat && cat !== 0) return null;

  // hex string
  if (typeof cat === "string") {
    const s = cat.startsWith("0x") ? cat.slice(2) : cat;
    // if string looks like hex -> convert
    if (/^[0-9a-fA-F]+$/.test(s)) {
      // ensure even length
      const hex = s.length % 2 ? "0" + s : s;
      return Uint8Array.from(Buffer.from(hex, "hex"));
    }
    // otherwise it's some unexpected string
    return null;
  }

  // Buffer (Node) or Uint8Array / TypedArray
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(cat)) {
    return Uint8Array.from(cat);
  }
  if (ArrayBuffer.isView(cat)) {
    // Uint8Array, Int8Array, etc.
    return new Uint8Array(cat.buffer, cat.byteOffset, cat.byteLength);
  }

  // plain JS object that looks like { type: 'Buffer', data: [...] }
  if (cat && Array.isArray(cat.data)) {
    return Uint8Array.from(cat.data);
  }

  // plain array of bytes
  if (Array.isArray(cat) && cat.every((n) => typeof n === "number")) {
    return Uint8Array.from(cat);
  }

  return null;
}

(async () => {
  const provider = new ElectrumNetworkProvider("chipnet");
  console.log("Connected to Electrum provider...");
  const utxos = await provider.getUtxos(poolAddr);
  console.log(`\nUTXOs at pool address: ${poolAddr}`);
  if (!utxos || utxos.length === 0) {
    console.log("  (no UTXOs found)");
    process.exit(0);
  }
  for (const u of utxos) {
    const txid = u.txid || "<unknown>";
    const vout = u.vout ?? "<?>";
    const token = u.token || null;
    let cat = "(no-token)";

    if (token?.category) {
      const bytes = normalizeCategoryToBytes(token.category);
      if (bytes) {
        // binToHex expects something with reduce (Uint8Array works)
        cat = binToHex(bytes);
      } else {
        // fallback: try to JSON-stringify to aid debugging
        cat = `unrecognized-category-format: ${JSON.stringify(token.category).slice(0, 200)}`;
      }
    }

    const amount = token?.amount ? token.amount.toString() : "0";
    console.log(`- ${txid}:${vout}  category=${cat}  amount=${amount}  satoshis=${u.satoshis}`);
  }

  console.log("\nComparing with .env.local expected categories:");
  console.log("  Expected TKA: ", tokenA || "(missing)");
  console.log("  Expected TKB: ", tokenB || "(missing)");
  console.log("  Expected CLP: ", lpToken || "(missing)");
})();
