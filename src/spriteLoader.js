// Sprite loader — preloads AI-generated character PNG sprites
// Falls back to rect-drawn characters if images haven't loaded

const sprites = {};
let loadedCount = 0;
const TOTAL_SPRITES = 7;

const SPRITE_NAMES = ['billy', 'isaac', 'patrick', 'marcos', 'sandra', 'charlie', 'wendy'];

// Preload all character sprites
export function preloadSprites() {
  return new Promise((resolve) => {
    let resolved = false;
    SPRITE_NAMES.forEach(name => {
      const img = new Image();
      img.onload = () => {
        sprites[name] = img;
        loadedCount++;
        if (loadedCount >= TOTAL_SPRITES && !resolved) {
          resolved = true;
          resolve();
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${name}`);
        loadedCount++;
        if (loadedCount >= TOTAL_SPRITES && !resolved) {
          resolved = true;
          resolve();
        }
      };
      img.src = `/sprites/${name}.png`;
    });
    // Timeout fallback — don't block rendering
    setTimeout(() => {
      if (!resolved) { resolved = true; resolve(); }
    }, 3000);
  });
}

// Get a loaded sprite image, or null if not available
export function getSprite(agentKey) {
  return sprites[agentKey] || null;
}

// Check if sprites are ready
export function spritesReady() {
  return loadedCount >= TOTAL_SPRITES;
}
