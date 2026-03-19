import { P } from './palette.js';
import { getSprite } from './spriteLoader.js';

// ─── Utility ───
export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color; ctx.fillRect(x|0, y|0, w|0, h|0);
}

// ─── Room Base (enhanced with wall texture + floor grain) ───
export function drawRoomBase(ctx, r, wallColor, floorColor) {
  const wallH = Math.round(r.h * 0.32);
  // Ceiling shadow
  rect(ctx, r.x, r.y, r.w, 6, P.border);
  // Wall
  rect(ctx, r.x, r.y+6, r.w, wallH-6, wallColor);
  // Wall highlight strip
  rect(ctx, r.x, r.y+6, r.w, 2, P.wallTealLight);
  // Wall texture (subtle vertical grain)
  for (let wx = r.x+12; wx < r.x+r.w; wx += 24) {
    rect(ctx, wx, r.y+10, 2, wallH-16, P.wallTealDark);
  }
  // Baseboard (thicker, darker)
  rect(ctx, r.x, r.y+wallH-6, r.w, 6, P.deskDark);
  rect(ctx, r.x, r.y+wallH-8, r.w, 2, P.deskWood);
  // Floor
  rect(ctx, r.x, r.y+wallH, r.w, r.h-wallH, floorColor);
  // Wood plank lines (staggered)
  for (let py = r.y+wallH+16; py < r.y+r.h; py += 16) {
    rect(ctx, r.x, py, r.w, 2, P.floorWoodPlank);
    // Stagger joints
    const offset = ((py - r.y) % 32 === 0) ? 60 : 140;
    rect(ctx, r.x+offset, py-8, 2, 8, P.floorWoodDark);
    rect(ctx, r.x+offset+120, py-8, 2, 8, P.floorWoodDark);
  }
  // Floor edge shadow at baseboard
  rect(ctx, r.x, r.y+wallH, r.w, 4, P.floorWoodDark);
}

// ─── Room Walls (thin brown border with door opening) ───
export function drawRoomWalls(ctx, r) {
  const T = 6;  // wall thickness (was 3)
  const doorW = 36; // door opening width (was 18)
  const d = r.door;
  if (!d) return;

  // Calculate door gap position
  const gapCenter = d.side === 'top' || d.side === 'bottom'
    ? r.x + Math.round(r.w * d.pos)
    : r.y + Math.round(r.h * d.pos);
  const gapHalf = Math.floor(doorW / 2);

  // Top wall
  if (d.side === 'top') {
    rect(ctx, r.x, r.y, gapCenter - gapHalf - r.x, T, P.wallBrown);
    rect(ctx, gapCenter + gapHalf, r.y, r.x + r.w - gapCenter - gapHalf, T, P.wallBrown);
    rect(ctx, gapCenter - gapHalf - 2, r.y, 2, T, P.wallBrownLight);
    rect(ctx, gapCenter + gapHalf, r.y, 2, T, P.wallBrownLight);
  } else {
    rect(ctx, r.x, r.y, r.w, T, P.wallBrown);
  }

  // Bottom wall
  if (d.side === 'bottom') {
    rect(ctx, r.x, r.y + r.h - T, gapCenter - gapHalf - r.x, T, P.wallBrown);
    rect(ctx, gapCenter + gapHalf, r.y + r.h - T, r.x + r.w - gapCenter - gapHalf, T, P.wallBrown);
    rect(ctx, gapCenter - gapHalf - 2, r.y + r.h - T, 2, T, P.wallBrownLight);
    rect(ctx, gapCenter + gapHalf, r.y + r.h - T, 2, T, P.wallBrownLight);
  } else {
    rect(ctx, r.x, r.y + r.h - T, r.w, T, P.wallBrown);
  }

  // Left wall
  if (d.side === 'left') {
    rect(ctx, r.x, r.y, T, gapCenter - gapHalf - r.y, P.wallBrown);
    rect(ctx, r.x, gapCenter + gapHalf, T, r.y + r.h - gapCenter - gapHalf, P.wallBrown);
    rect(ctx, r.x, gapCenter - gapHalf - 2, T, 2, P.wallBrownLight);
    rect(ctx, r.x, gapCenter + gapHalf, T, 2, P.wallBrownLight);
  } else {
    rect(ctx, r.x, r.y, T, r.h, P.wallBrown);
  }

  // Right wall
  if (d.side === 'right') {
    rect(ctx, r.x + r.w - T, r.y, T, gapCenter - gapHalf - r.y, P.wallBrown);
    rect(ctx, r.x + r.w - T, gapCenter + gapHalf, T, r.y + r.h - gapCenter - gapHalf, P.wallBrown);
    rect(ctx, r.x + r.w - T, gapCenter - gapHalf - 2, T, 2, P.wallBrownLight);
    rect(ctx, r.x + r.w - T, gapCenter + gapHalf, T, 2, P.wallBrownLight);
  } else {
    rect(ctx, r.x + r.w - T, r.y, T, r.h, P.wallBrown);
  }

  // Highlight on top edge of all walls (3D depth effect)
  if (d.side !== 'top') {
    rect(ctx, r.x, r.y, r.w, 2, P.wallBrownLight);
  }
  if (d.side !== 'left') {
    rect(ctx, r.x, r.y, 2, r.h, P.wallBrownLight);
  }
}

// ─── Desk (L-shaped with drawers, keyboard, depth) ───
export function drawDesk(ctx, x, y, w, h, facing='right') {
  // Legs (shadows)
  rect(ctx, x+4, y+h+4, 4, 4, P.deskDark);
  rect(ctx, x+w-8, y+h+4, 4, 4, P.deskDark);
  // Desktop surface
  rect(ctx, x, y, w, h, P.deskWood);
  rect(ctx, x+2, y+2, w-4, h-6, P.deskLight);
  // Wood grain
  rect(ctx, x+8, y+4, w-16, 2, P.deskWood);
  rect(ctx, x+12, y+h-8, w-24, 2, P.deskWood);
  // Front face (depth)
  rect(ctx, x, y+h, w, 6, P.deskDark);
  rect(ctx, x+2, y+h, w-4, 2, P.deskWood);
  // Drawer
  rect(ctx, x+w/2-12, y+h, 24, 6, P.deskDark);
  rect(ctx, x+w/2-2, y+h+2, 4, 2, P.cabinetGray);
  // L extension
  if (facing === 'right') {
    rect(ctx, x+w-24, y-28, 24, 28, P.deskWood);
    rect(ctx, x+w-22, y-26, 20, 24, P.deskLight);
    rect(ctx, x+w-24, y, 24, 4, P.deskDark);
  } else {
    rect(ctx, x, y-28, 24, 28, P.deskWood);
    rect(ctx, x+2, y-26, 20, 24, P.deskLight);
    rect(ctx, x, y, 24, 4, P.deskDark);
  }
  // Keyboard on desk
  const kx = x + (facing === 'right' ? 16 : w-40);
  rect(ctx, kx, y+h-12, 24, 8, P.monitorGray);
  rect(ctx, kx+2, y+h-10, 20, 4, P.cabinetDark);
  // Mouse
  rect(ctx, kx+28, y+h-10, 6, 6, P.monitorGray);
}

// ─── Monitor (bigger, with screen glow) ───
export function drawMonitor(ctx, x, y, screenColor) {
  const sc = screenColor || P.screenBlue;
  // Stand base
  rect(ctx, x+6, y+24, 12, 4, P.monitorGray);
  rect(ctx, x+2, y+26, 20, 4, P.cabinetDark);
  // Stand neck
  rect(ctx, x+10, y+20, 4, 6, P.monitorGray);
  // Screen bezel
  rect(ctx, x, y, 24, 22, P.monitorGray);
  rect(ctx, x, y, 24, 2, P.cabinetDark); // top edge
  // Screen
  rect(ctx, x+2, y+2, 20, 16, sc);
  // Screen content (more detail at 2x)
  rect(ctx, x+4, y+4, 6, 2, P.textWhite);
  rect(ctx, x+4, y+8, 10, 2, '#80d0a0');
  rect(ctx, x+4, y+12, 8, 2, P.screenGreen);
  rect(ctx, x+14, y+6, 4, 8, P.bookYellow);
  // Screen reflection
  ctx.globalAlpha = 0.15;
  rect(ctx, x+14, y+2, 6, 6, P.textWhite);
  ctx.globalAlpha = 1;
}

// ─── Chair (detailed, with wheels visible) ───
export function drawChair(ctx, x, y, color) {
  const c = color || P.chairBrown;
  // Wheels
  rect(ctx, x+2, y+16, 4, 4, P.cabinetDark);
  rect(ctx, x+10, y+16, 4, 4, P.cabinetDark);
  // Seat base
  rect(ctx, x, y+6, 16, 10, c);
  rect(ctx, x+2, y+8, 12, 6, P.chairDark);
  // Backrest
  rect(ctx, x+2, y, 12, 8, c);
  rect(ctx, x+4, y+2, 8, 4, P.chairDark);
  // Armrests
  rect(ctx, x-2, y+4, 4, 8, c);
  rect(ctx, x+14, y+4, 4, 8, c);
}

// ─── Filing Cabinet (detailed with label) ───
export function drawFilingCabinet(ctx, x, y) {
  // Shadow
  rect(ctx, x+2, y+46, 28, 4, P.border);
  // Body
  rect(ctx, x, y, 28, 46, P.cabinetGray);
  // Top edge
  rect(ctx, x, y, 28, 4, P.floorTileLight);
  // Side shadow
  rect(ctx, x+26, y, 2, 46, P.cabinetDark);
  // Drawers
  for (let i = 0; i < 3; i++) {
    const dy = y+6+i*14;
    rect(ctx, x+2, dy, 24, 12, P.cabinetDark);
    rect(ctx, x+4, dy+2, 20, 8, P.cabinetGray);
    // Handle
    rect(ctx, x+10, dy+4, 8, 4, P.floorTileLight);
    rect(ctx, x+12, dy+4, 4, 2, P.textWhite);
  }
  // Label slot on top drawer
  rect(ctx, x+6, y+8, 12, 4, P.textWhite);
}

// ─── Bookshelf (richer, with varying book sizes) ───
export function drawBookshelf(ctx, x, y) {
  // Shadow
  rect(ctx, x+2, y+60, 44, 4, P.border);
  // Frame
  rect(ctx, x, y, 44, 60, P.shelfWood);
  rect(ctx, x+2, y+2, 40, 56, P.shelfDark);
  // Top
  rect(ctx, x, y, 44, 4, P.deskLight);
  const bookColors = [P.bookRed, P.bookBlue, P.bookGreen, P.bookYellow, 
    '#6a4488', '#884444', P.bookBlue, P.bookRed, '#448844'];
  // 3 shelves of books
  for (let s = 0; s < 3; s++) {
    const sy = y + 6 + s*18;
    // Shelf board
    rect(ctx, x+2, sy+14, 40, 4, P.shelfWood);
    // Books (varied widths and heights)
    let bx = x+4;
    for (let b = 0; b < 6 && bx < x+40; b++) {
      const bw = 4 + (b % 3 === 0 ? 2 : 0);
      const bh = 10 + (b % 2)*2;
      rect(ctx, bx, sy+(14-bh), bw, bh, bookColors[(s*6+b) % bookColors.length]);
      // Spine highlight
      rect(ctx, bx, sy+(14-bh), 2, bh, P.textWhite);
      ctx.globalAlpha = 0.15;
      rect(ctx, bx, sy+(14-bh), 2, bh, P.textWhite);
      ctx.globalAlpha = 1;
      bx += bw + 2;
    }
  }
}

// ─── Plant (lush, multi-leaf, with shadow) ───
export function drawPlant(ctx, x, y, size) {
  const s = size || 1;
  // Shadow
  ctx.globalAlpha = 0.3;
  rect(ctx, x+2*s, y+28*s, 16*s, 4*s, P.border);
  ctx.globalAlpha = 1;
  // Pot
  rect(ctx, x+4*s, y+16*s, 12*s, 12*s, P.potBrown);
  rect(ctx, x+6*s, y+16*s, 8*s, 2, P.potDark);
  rect(ctx, x+2*s, y+26*s, 16*s, 4*s, P.potDark);
  // Pot rim
  rect(ctx, x+2*s, y+16*s, 16*s, 2*s, '#8a6a40');
  // Soil
  rect(ctx, x+6*s, y+16*s+2, 8*s, 2*s, P.deskDark);
  // Main foliage
  rect(ctx, x+4*s, y+4*s, 12*s, 12*s, P.plantGreen);
  rect(ctx, x+2*s, y+6*s, 16*s, 8*s, P.plantGreen);
  // Highlights
  rect(ctx, x+6*s, y+2*s, 8*s, 4*s, P.plantLight);
  rect(ctx, x+10*s, y+6*s, 4*s, 4*s, P.plantLight);
  // Darker leaves
  rect(ctx, x, y+8*s, 4*s, 6*s, P.plantDark);
  rect(ctx, x+16*s, y+8*s, 4*s, 6*s, P.plantDark);
  rect(ctx, x+8*s, y+12*s, 4*s, 4*s, P.plantDark);
  // Top leaves
  rect(ctx, x+8*s, y, 4*s, 4*s, P.plantLight);
  rect(ctx, x+4*s, y+2*s, 2*s, 4*s, P.plantGreen);
  rect(ctx, x+14*s, y+4*s, 2*s, 4*s, P.plantGreen);
}

// ─── Window (with curtains, sky gradient, cloud) ───
export function drawWindow(ctx, x, y, w, h) {
  w = w||44; h = h||36;
  // Window frame
  rect(ctx, x-2, y-2, w+4, h+4, P.windowFrame);
  rect(ctx, x, y, w, h, P.windowFrame);
  // Glass panes
  rect(ctx, x+4, y+4, w-8, h-8, P.skyBlue);
  // Sky gradient
  rect(ctx, x+4, y+4, w-8, 6, '#9cc8e8');
  // Dividers
  rect(ctx, x+w/2-2, y, 4, h, P.windowFrame);
  rect(ctx, x, y+h/2-2, w, 4, P.windowFrame);
  // Trees + hills outside
  rect(ctx, x+6, y+h/2+4, 12, h/2-8, P.treesGreen);
  rect(ctx, x+w/2+4, y+h/2+4, 10, h/2-8, '#509040');
  rect(ctx, x+20, y+h/2+2, 8, h/2-6, '#60a050');
  // Cloud
  rect(ctx, x+8, y+6, 8, 4, P.textWhite);
  rect(ctx, x+6, y+8, 12, 2, P.textWhite);
  // Curtains (small side drapes)
  rect(ctx, x, y, 4, h, '#7a5a3a');
  rect(ctx, x+w-4, y, 4, h, '#7a5a3a');
  // Windowsill
  rect(ctx, x-2, y+h, w+4, 4, P.windowFrame);
}

// ─── Whiteboard (with sketch content) ───
export function drawWhiteboard(ctx, x, y, w, h) {
  rect(ctx, x-2, y-2, w+4, h+4, P.wbFrame);
  rect(ctx, x, y, w, h, P.whiteboard);
  // Content lines
  for (let i = 0; i < 4; i++) {
    const lw = w-28 - (i%2)*16;
    rect(ctx, x+8, y+8+i*8, lw, 2, P.cabinetGray);
  }
  // Bullet dots
  rect(ctx, x+6, y+8, 2, 2, P.shirtRed);
  rect(ctx, x+6, y+16, 2, 2, P.shirtBlue);
  rect(ctx, x+6, y+24, 2, 2, P.shirtGreen);
  // Marker tray
  rect(ctx, x+4, y+h-4, w-8, 4, P.cabinetDark);
  rect(ctx, x+8, y+h-6, 8, 2, P.shirtRed);
  rect(ctx, x+20, y+h-6, 8, 2, P.shirtBlue);
}

// ─── Presentation Screen (with pie chart + bar chart) ───
export function drawPresScreen(ctx, x, y, w, h) {
  // Frame
  rect(ctx, x-2, y-2, w+4, h+4, P.wbFrame);
  rect(ctx, x, y, w, h, '#e8e8e8');
  // Title bar
  rect(ctx, x, y, w, 6, P.wbFrame);
  // Bar chart
  const colors = [P.shirtBlue, P.shirtGreen, P.shirtRed, P.bookYellow, '#6a4488'];
  const startX = x + 8;
  for (let i = 0; i < 5; i++) {
    const bh = 8 + ((i+1)*6) % 28;
    rect(ctx, startX+i*10, y+h-8-bh, 8, bh, colors[i]);
  }
  // Pie chart (simple quadrant approximation)
  const cx = x+w-24, cy = y+20;
  rect(ctx, cx, cy, 8, 8, P.shirtBlue);
  rect(ctx, cx+8, cy, 8, 8, P.shirtGreen);
  rect(ctx, cx, cy+8, 8, 8, P.shirtRed);
  rect(ctx, cx+8, cy+8, 8, 8, P.bookYellow);
  // Trend line
  for (let i = 0; i < 8; i++) {
    rect(ctx, startX+i*6, y+h-12-((i*4)%16), 4, 2, P.plantDark);
  }
}

// ─── Couch (with pillows and texture) ───
export function drawCouch(ctx, x, y) {
  // Shadow
  ctx.globalAlpha = 0.3;
  rect(ctx, x+2, y+28, 56, 4, P.border);
  ctx.globalAlpha = 1;
  // Back
  rect(ctx, x, y-10, 56, 12, P.couchDark);
  rect(ctx, x+4, y-8, 48, 8, P.couchRed);
  // Main body
  rect(ctx, x, y, 56, 24, P.couchRed);
  // Front face
  rect(ctx, x, y+24, 56, 4, P.couchDark);
  // Arms
  rect(ctx, x-4, y-6, 6, 32, P.couchDark);
  rect(ctx, x+54, y-6, 6, 32, P.couchDark);
  // Cushion divider
  rect(ctx, x+26, y+2, 4, 20, P.couchDark);
  // Cushion highlights
  rect(ctx, x+6, y+4, 16, 4, '#a05040');
  rect(ctx, x+34, y+4, 16, 4, '#a05040');
  // Throw pillows
  rect(ctx, x+6, y+2, 10, 8, P.bookYellow);
  rect(ctx, x+40, y+2, 10, 8, P.shirtBlue);
}

// ─── Table (with wood grain) ───
export function drawTable(ctx, x, y, w, h) {
  // Legs
  rect(ctx, x+4, y+h+2, 4, 6, P.tableDark);
  rect(ctx, x+w-8, y+h+2, 4, 6, P.tableDark);
  // Surface
  rect(ctx, x, y, w, h, P.tableWood);
  rect(ctx, x+2, y+2, w-4, h-4, P.deskLight);
  // Grain
  rect(ctx, x+6, y+4, w-12, 2, P.tableWood);
  rect(ctx, x+10, y+h-6, w-20, 2, P.tableWood);
  // Front edge
  rect(ctx, x, y+h, w, 4, P.tableDark);
}

// ─── Boardroom Table (large with depth + paper details) ───
export function drawBoardTable(ctx, x, y, w, h) {
  // Table shadow
  ctx.globalAlpha = 0.25;
  rect(ctx, x+6, y+h+4, w, 8, P.border);
  ctx.globalAlpha = 1;
  // Rounded rectangle body
  const r = 16;
  rect(ctx, x+r, y, w-r*2, h, P.tableWood);
  rect(ctx, x, y+r, w, h-r*2, P.tableWood);
  // Surface highlight
  rect(ctx, x+6, y+6, w-12, h-12, P.deskLight);
  // Wood grain
  for (let gy = y+12; gy < y+h-8; gy += 12) {
    rect(ctx, x+10, gy, w-20, 2, P.tableWood);
  }
  // Front edge depth
  rect(ctx, x+r, y+h, w-r*2, 8, P.tableDark);
  rect(ctx, x+4, y+h-2, r, 8, P.tableDark);
  rect(ctx, x+w-r-4, y+h-2, r, 8, P.tableDark);
  // Papers
  rect(ctx, x+24, y+16, 16, 12, P.textWhite);
  rect(ctx, x+26, y+18, 12, 2, P.cabinetGray);
  rect(ctx, x+w-44, y+20, 16, 12, P.textWhite);
  rect(ctx, x+w/2-10, y+10, 20, 14, P.textWhite);
  rect(ctx, x+w/2-8, y+12, 16, 2, P.cabinetGray);
  rect(ctx, x+w/2-8, y+16, 12, 2, P.cabinetGray);
  // Coffee cups
  rect(ctx, x+48, y+12, 6, 6, P.textWhite);
  rect(ctx, x+48, y+10, 6, 2, P.cabinetGray);
  rect(ctx, x+w-28, y+16, 6, 6, P.textWhite);
}

// ─── Character (enhanced: uses AI sprite if available, else rect fallback) ───
export function drawCharacter(ctx, x, y, config, frame, agentKey) {
  // Try using AI-generated sprite
  const sprite = agentKey ? getSprite(agentKey) : null;
  if (sprite) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, x-8, y-8, 32, 32);
    ctx.imageSmoothingEnabled = false;
    // Idle animation — subtle breathing pulse
    if (frame && frame % 80 < 40) {
      ctx.globalAlpha = 0.06;
      ctx.drawImage(sprite, x-8, y-9, 32, 32);
      ctx.globalAlpha = 1;
    }
    return;
  }
  // Rect fallback
  const { hair, shirt } = config;
  const hairC = P[hair] || P.hairBrown;
  const shirtC = P[shirt] || P.shirtBlue;
  // Head shadow on body
  rect(ctx, x+2, y+10, 12, 2, P.skinDark);
  // Head
  rect(ctx, x+2, y+2, 12, 10, P.skin);
  rect(ctx, x+4, y, 8, 2, P.skin);
  // Skin shading
  rect(ctx, x+2, y+8, 2, 4, P.skinDark);
  rect(ctx, x+12, y+8, 2, 4, P.skinDark);
  // Hair
  rect(ctx, x+2, y, 12, 4, hairC);
  rect(ctx, x+4, y-2, 8, 2, hairC);
  // Side hair
  rect(ctx, x, y+2, 2, 6, hairC);
  rect(ctx, x+14, y+2, 2, 6, hairC);
  // Eyes
  rect(ctx, x+4, y+6, 2, 2, P.hairBlack);
  rect(ctx, x+10, y+6, 2, 2, P.hairBlack);
  // Eye whites
  rect(ctx, x+4, y+6, 1, 1, P.textWhite);
  rect(ctx, x+10, y+6, 1, 1, P.textWhite);
  // Mouth
  rect(ctx, x+6, y+8, 4, 2, P.skinDark);
  // Body / shirt
  rect(ctx, x, y+12, 16, 12, shirtC);
  // Collar
  rect(ctx, x+4, y+12, 8, 2, P.textWhite);
  // Shirt shading
  rect(ctx, x, y+12, 2, 12, P.border);
  ctx.globalAlpha = 0.2;
  rect(ctx, x, y+12, 2, 12, P.border);
  ctx.globalAlpha = 1;
  rect(ctx, x+14, y+12, 2, 12, P.border);
  ctx.globalAlpha = 0.15;
  rect(ctx, x+14, y+12, 2, 12, P.border);
  ctx.globalAlpha = 1;
  // Arms
  rect(ctx, x-2, y+12, 2, 10, shirtC);
  rect(ctx, x+16, y+12, 2, 10, shirtC);
  // Hands
  rect(ctx, x-2, y+20, 2, 4, P.skin);
  rect(ctx, x+16, y+20, 2, 4, P.skin);
  // Idle animation - subtle head bob
  if (frame && frame % 80 < 40) {
    rect(ctx, x+4, y-4, 8, 2, hairC);
  }
}

// ─── Character sitting at desk ───
export function drawSeatedChar(ctx, x, y, config, frame, agentKey) {
  // Try using AI-generated sprite
  const sprite = agentKey ? getSprite(agentKey) : null;
  if (sprite) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, x-8, y-8, 32, 32);
    ctx.imageSmoothingEnabled = false;
    if (frame && frame % 80 < 40) {
      ctx.globalAlpha = 0.06;
      ctx.drawImage(sprite, x-8, y-9, 32, 32);
      ctx.globalAlpha = 1;
    }
    return;
  }
  drawCharacter(ctx, x, y, config, frame);
  // Pants visible below body
  rect(ctx, x+2, y+24, 6, 6, P.pants);
  rect(ctx, x+8, y+24, 6, 6, P.pants);
  // Shoes
  rect(ctx, x, y+28, 6, 2, P.hairBlack);
  rect(ctx, x+10, y+28, 6, 2, P.hairBlack);
}

// ─── Boardroom character (from above, with chair indication) ───
export function drawBoardChar(ctx, x, y, config, facing, frame) {
  const { hair, shirt } = config;
  const hairC = P[hair] || P.hairBrown;
  const shirtC = P[shirt] || P.shirtBlue;
  // Body (seen from slightly above)
  rect(ctx, x, y+8, 12, 10, shirtC);
  // Collar
  rect(ctx, x+4, y+8, 4, 2, P.textWhite);
  // Head
  rect(ctx, x+2, y, 8, 8, P.skin);
  // Hair
  rect(ctx, x+2, y, 8, 4, hairC);
  rect(ctx, x, y+2, 2, 2, hairC);
  rect(ctx, x+10, y+2, 2, 2, hairC);
  // Eyes (only for forward-facing)
  if (facing !== 'up') {
    rect(ctx, x+2, y+4, 2, 2, P.hairBlack);
    rect(ctx, x+8, y+4, 2, 2, P.hairBlack);
  }
  // Arms reaching to table
  rect(ctx, x-2, y+10, 2, 6, shirtC);
  rect(ctx, x+12, y+10, 2, 6, shirtC);
  rect(ctx, x-2, y+14, 2, 2, P.skin);
  rect(ctx, x+12, y+14, 2, 2, P.skin);
  // Animation
  if (frame && frame % 90 < 45) {
    rect(ctx, x+4, y-2, 4, 2, hairC);
  }
}

// ─── Wall Sconce / Light (with glow) ───
export function drawSconce(ctx, x, y, frame) {
  rect(ctx, x+2, y, 6, 10, P.deskWood);
  rect(ctx, x, y-4, 10, 6, P.bookYellow);
  rect(ctx, x+2, y-6, 6, 4, '#e0c060');
  // Glow
  const pulse = frame ? Math.sin(frame*0.03)*0.1+0.15 : 0.15;
  ctx.globalAlpha = pulse;
  rect(ctx, x-4, y-10, 18, 20, '#ffe880');
  ctx.globalAlpha = 1;
}

// ─── Wall Frame / Art (with scene inside) ───
export function drawWallArt(ctx, x, y, w, h) {
  rect(ctx, x-2, y-2, w+4, h+4, P.deskDark);
  rect(ctx, x, y, w, h, P.deskWood);
  rect(ctx, x+2, y+2, w-4, h-4, P.skyBlue);
  // Landscape inside frame
  rect(ctx, x+4, y+h-10, w-8, 6, P.treesGreen);
  rect(ctx, x+6, y+h-14, 6, 6, '#509040');
  // Sun
  rect(ctx, x+w-10, y+4, 4, 4, P.bookYellow);
}

// ─── Rug (with pattern) ───
export function drawRug(ctx, x, y, w, h) {
  rect(ctx, x, y, w, h, P.rugBorder);
  rect(ctx, x+4, y+4, w-8, h-8, P.rugPurple);
  rect(ctx, x+8, y+8, w-16, h-16, P.rugLight);
  // Inner pattern
  rect(ctx, x+12, y+12, w-24, h-24, P.rugPurple);
  rect(ctx, x+16, y+16, w-32, h-32, P.rugLight);
  // Corner decorations
  rect(ctx, x+6, y+6, 4, 4, P.bookYellow);
  rect(ctx, x+w-10, y+6, 4, 4, P.bookYellow);
  rect(ctx, x+6, y+h-10, 4, 4, P.bookYellow);
  rect(ctx, x+w-10, y+h-10, 4, 4, P.bookYellow);
}

// ─── Tile floor (checkered with grout lines) ───
export function drawTileFloor(ctx, x, y, w, h) {
  for (let ty = 0; ty < h; ty += 16) {
    for (let tx = 0; tx < w; tx += 16) {
      const light = (Math.floor(tx/16) + Math.floor(ty/16)) % 2 === 0;
      rect(ctx, x+tx, y+ty, 16, 16, light ? P.floorTileLight : P.floorTileDark);
      // Grout lines
      rect(ctx, x+tx, y+ty, 16, 2, '#a0a0a8');
      rect(ctx, x+tx, y+ty, 2, 16, '#a0a0a8');
    }
  }
}

// ─── Status dot (pulsing glow) ───
export function drawStatusDot(ctx, x, y, status, frame) {
  const colors = { working: '#4caf50', idle: '#ff9800', meeting: '#2196f3' };
  const c = colors[status] || colors.working;
  const pulse = Math.sin((frame||0) * 0.06) * 0.3 + 0.7;
  // Outer glow
  ctx.globalAlpha = pulse * 0.3;
  rect(ctx, x-4, y-4, 16, 16, c);
  ctx.globalAlpha = pulse;
  rect(ctx, x-2, y-2, 12, 12, c);
  ctx.globalAlpha = 1;
  rect(ctx, x, y, 8, 8, c);
  // Center highlight
  rect(ctx, x, y, 4, 4, P.textWhite);
  ctx.globalAlpha = 0.4;
  rect(ctx, x, y, 4, 4, P.textWhite);
  ctx.globalAlpha = 1;
}

// ─── Water cooler ───
export function drawWaterCooler(ctx, x, y) {
  // Base
  rect(ctx, x+2, y+28, 12, 8, P.cabinetGray);
  // Body
  rect(ctx, x, y+8, 16, 20, P.floorTileLight);
  rect(ctx, x+2, y+10, 12, 16, '#b0c8e0');
  // Water jug
  rect(ctx, x+2, y, 12, 10, '#90b8d8');
  rect(ctx, x+4, y-2, 8, 4, '#a0c8e0');
  // Spout
  rect(ctx, x+6, y+20, 4, 4, P.cabinetDark);
  // Cup holder
  rect(ctx, x-2, y+16, 4, 8, P.textWhite);
}

// ─── Coffee mug ───
export function drawMug(ctx, x, y, color) {
  rect(ctx, x, y, 8, 8, color||P.textWhite);
  rect(ctx, x, y, 8, 2, P.cabinetGray);
  rect(ctx, x+8, y+2, 2, 4, color||P.textWhite);
}

// ─── Wall clock ───
export function drawClock(ctx, x, y, frame) {
  rect(ctx, x, y, 16, 16, P.deskWood);
  rect(ctx, x+2, y+2, 12, 12, P.textWhite);
  // Center dot
  rect(ctx, x+6, y+6, 4, 4, P.hairBlack);
  // Hour hand
  rect(ctx, x+8, y+2, 2, 6, P.hairBlack);
  // Minute hand (animated)
  const angle = ((frame||0) % 360);
  if (angle < 90) rect(ctx, x+8, y+8, 4, 2, P.cabinetGray);
  else if (angle < 180) rect(ctx, x+8, y+8, 2, 4, P.cabinetGray);
  else if (angle < 270) rect(ctx, x+4, y+8, 4, 2, P.cabinetGray);
  else rect(ctx, x+8, y+4, 2, 4, P.cabinetGray);
}

// ─── Trash can ───
export function drawTrashCan(ctx, x, y) {
  rect(ctx, x, y, 12, 16, P.cabinetGray);
  rect(ctx, x+2, y+2, 8, 12, P.cabinetDark);
  rect(ctx, x-2, y, 16, 4, P.cabinetGray);
}

// ─── Pixel text ───
export function drawLabel(ctx, text, x, y, size, color, shadow) {
  ctx.font = `${size||6}px 'Press Start 2P', monospace`;
  ctx.textAlign = 'center';
  if (shadow !== false) {
    ctx.fillStyle = P.textShadow;
    ctx.fillText(text, x+2, y+2);
  }
  ctx.fillStyle = color || P.textCream;
  ctx.fillText(text, x, y);
}

// ─── Label with background ───
export function drawLabelBg(ctx, text, x, y, size, color) {
  ctx.font = `${size||6}px 'Press Start 2P', monospace`;
  ctx.textAlign = 'center';
  const tw = ctx.measureText(text).width;
  rect(ctx, x-tw/2-8, y-size-6, tw+16, size+14, P.labelBg);
  rect(ctx, x-tw/2-6, y-size-4, tw+12, size+10, '#1a1932');
  ctx.fillStyle = color || P.textCream;
  ctx.fillText(text, x, y);
}
