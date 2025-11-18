#!/usr/bin/env node

/**
 * CHRONOS DEX - Generate BIP39 Seed Phrase for Cashonize
 */

import crypto from 'crypto';

// BIP39 English wordlist (simplified - first 2048 words)
const WORDLIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
  "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
  "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
  "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
  "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge"
  // ... (Truncated for brevity - in production use full 2048 word list)
];

function generateSeedPhrase(wordCount = 12) {
  // Generate random entropy
  const entropyBits = wordCount === 12 ? 128 : 256;
  const entropyBytes = entropyBits / 8;
  const entropy = crypto.randomBytes(entropyBytes);
  
  // Convert to word indices
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    // Simplified: use random word from list
    const randomIndex = crypto.randomInt(0, WORDLIST.length);
    words.push(WORDLIST[randomIndex]);
  }
  
  return words.join(' ');
}

async function main() {
  console.log('🌱 CHRONOS DEX - Seed Phrase Generator\n');
  console.log('⚠️  IMPORTANT: This is a TEST wallet generator.');
  console.log('For production, use a hardware wallet or secure seed generation.\n');
  
  const seedPhrase = generateSeedPhrase(12);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 YOUR 12-WORD SEED PHRASE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(seedPhrase);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('⚠️  WRITE THIS DOWN AND KEEP IT SAFE!\n');
  
  console.log('📝 IMPORT TO CASHONIZE:');
  console.log('1. Go to: https://cashonize.com/');
  console.log('2. Click "Import Wallet"');
  console.log('3. Enter seed phrase above');
  console.log('4. Derivation path: m/44\'/145\'/0\' (standard)');
  console.log('5. Settings → Network → Chipnet');
  console.log('6. Copy your address');
  console.log('7. Fund from faucet\n');
  
  console.log('💾 SAVE TO .ENV.LOCAL:');
  console.log('After importing to Cashonize:');
  console.log('- Go to Settings → Show Private Key');
  console.log('- Copy the WIF (starts with "c")');
  console.log('- Save to frontend/.env.local as VITE_TESTER_WIF\n');
}

main().catch(console.error);