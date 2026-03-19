import { P } from './palette.js';

// ─── Utility ───
export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color; ctx.fillRect(x|0, y|0, w|0, h|0);
}

// ─── Room Base (enhanced with wall texture + floor grain) ───
export function drawRoomBase(ctx, r, wallColor, floorColor) {
  const wallH = Math.round(r.h * 0.32);
  // Ceiling shadow
  rect(ctx, r.x, r.y, r.w, 3, P.border);
  // Wall
  rect(ctx, r.x, r.y+3, r.w, wallH-3, wallColor);
  // Wall highlight strip
  rect(ctx, r.x, r.y+3, r.w, 1, P.wallTealLight);
  // Wall texture (subtle vertical grain)
  for (let wx = r.x+6; wx < r.x+r.w; wx += 12) {
    rect(ctx, wx, r.y+5, 1, wallH-8, P.wallTealDark);
  }
  // Baseboard (thicker, darker)
  rect(ctx, r.x, r.y+wallH-3, r.w, 3, P.deskDark);
  rect(ctx, r.x, r.y+wallH-4, r.w, 1, P.deskWood);
  // Floor
  rect(ctx, r.x, r.y+wallH, r.w, r.h-wallH, floorColor);
  // Wood plank lines (staggered)
  for (let py = r.y+wallH+8; py < r.y+r.h; py += 8) {
    rect(ctx, r.x, py, r.w, 1, P.floorWoodPlank);
    // Stagger joints
    const offset = ((py - r.y) % 16 === 0) ? 30 : 70;
    rect(ctx, r.x+offset, py-4, 1, 4, P.floorWoodDark);
    rect(ctx, r.x+offset+60, py-4, 1, 4, P.floorWoodDark);
  }
  // Floor edge shadow at baseboard
  rect(ctx, r.x, r.y+wallH, r.w, 2, P.floorWoodDark);
}

// ─── Room Walls (thin brown border with door opening) ───
export function drawRoomWalls(ctx, r) {
  const T = 3;  // wall thickness
  const doorW = 18; // door opening width
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
    // Door frame edges
    rect(ctx, gapCenter - gapHalf - 1, r.y, 1, T, P.wallBrownLight);
    rect(ctx, gapCenter + gapHalf, r.y, 1, T, P.wallBrownLight);
  } else {
    rect(ctx, r.x, r.y, r.w, T, P.wallBrown);
  }

  // Bottom wall
  if (d.side === 'bottom') {
    rect(ctx, r.x, r.y + r.h - T, gapCenter - gapHalf - r.x, T, P.wallBrown);
    rect(ctx, gapCenter + gapHalf, r.y + r.h - T, r.x + r.w - gapCenter - gapHalf, T, P.wallBrown);
    rect(ctx, gapCenter - gapHalf - 1, r.y + r.h - T, 1, T, P.wallBrownLight);
    rect(ctx, gapCenter + gapHalf, r.y + r.h - T, 1, T, P.wallBrownLight);
  } else {
    rect(ctx, r.x, r.y + r.h - T, r.w, T, P.wallBrown);
  }

  // Left wall
  if (d.side === 'left') {
    rect(ctx, r.x, r.y, T, gapCenter - gapHalf - r.y, P.wallBrown);
    rect(ctx, r.x, gapCenter + gapHalf, T, r.y + r.h - gapCenter - gapHalf, P.wallBrown);
    rect(ctx, r.x, gapCenter - gapHalf - 1, T, 1, P.wallBrownLight);
    rect(ctx, r.x, gapCenter + gapHalf, T, 1, P.wallBrownLight);
  } else {
    rect(ctx, r.x, r.y, T, r.h, P.wallBrown);
  }

  // Right wall
  if (d.side === 'right') {
    rect(ctx, r.x + r.w - T, r.y, T, gapCenter - gapHalf - r.y, P.wallBrown);
    rect(ctx, r.x + r.w - T, gapCenter + gapHalf, T, r.y + r.h - gapCenter - gapHalf, P.wallBrown);
    rect(ctx, r.x + r.w - T, gapCenter - gapHalf - 1, T, 1, P.wallBrownLight);
    rect(ctx, r.x + r.w - T, gapCenter + gapHalf, T, 1, P.wallBrownLight);
  } else {
    rect(ctx, r.x + r.w - T, r.y, T, r.h, P.wallBrown);
  }

  // Highlight on top edge of all walls (3D depth effect)
  if (d.side !== 'top') {
    rect(ctx, r.x, r.y, r.w, 1, P.wallBrownLight);
  }
  if (d.side !== 'left') {
    rect(ctx, r.x, r.y, 1, r.h, P.wallBrownLight);
  }
}

// ─── Desk (L-shaped with drawers, keyboard, depth) ───
export function drawDesk(ctx, x, y, w, h, facing='right') {
  // Legs (shadows)
  rect(ctx, x+2, y+h+2, 2, 2, P.deskDark);
  rect(ctx, x+w-4, y+h+2, 2, 2, P.deskDark);
  // Desktop surface
  rect(ctx, x, y, w, h, P.deskWood);
  rect(ctx, x+1, y+1, w-2, h-3, P.deskLight);
  // Wood grain
  rect(ctx, x+4, y+2, w-8, 1, P.deskWood);
  rect(ctx, x+6, y+h-4, w-12, 1, P.deskWood);
  // Front face (depth)
  rect(ctx, x, y+h, w, 3, P.deskDark);
  rect(ctx, x+1, y+h, w-2, 1, P.deskWood);
  // Drawer
  rect(ctx, x+w/2-6, y+h, 12, 3, P.deskDark);
  rect(ctx, x+w/2-1, y+h+1, 2, 1, P.cabinetGray);
  // L extension
  if (facing === 'right') {
    rect(ctx, x+w-12, y-14, 12, 14, P.deskWood);
    rect(ctx, x+w-11, y-13, 10, 12, P.deskLight);
    rect(ctx, x+w-12, y, 12, 2, P.deskDark);
  } else {
    rect(ctx, x, y-14, 12, 14, P.deskWood);
    rect(ctx, x+1, y-13, 10, 12, P.deskLight);
    rect(ctx, x, y, 12, 2, P.deskDark);
  }
  // Keyboard on desk
  const kx = x + (facing === 'right' ? 8 : w-20);
  rect(ctx, kx, y+h-6, 12, 4, P.monitorGray);
  rect(ctx, kx+1, y+h-5, 10, 2, P.cabinetDark);
  // Mouse
  rect(ctx, kx+14, y+h-5, 3, 3, P.monitorGray);
}

// ─── Monitor (bigger, with screen glow) ───
export function drawMonitor(ctx, x, y, screenColor) {
  const sc = screenColor || P.screenBlue;
  // Stand base
  rect(ctx, x+3, y+12, 6, 2, P.monitorGray);
  rect(ctx, x+1, y+13, 10, 2, P.cabinetDark);
  // Stand neck
  rect(ctx, x+5, y+10, 2, 3, P.monitorGray);
  // Screen bezel
  rect(ctx, x, y, 12, 11, P.monitorGray);
  rect(ctx, x, y, 12, 1, P.cabinetDark); // top edge
  // Screen
  rect(ctx, x+1, y+1, 10, 8, sc);
  // Screen content
  rect(ctx, x+2, y+2, 3, 1, P.textWhite);
  rect(ctx, x+2, y+4, 5, 1, '#80d0a0');
  rect(ctx, x+2, y+6, 4, 1, P.screenGreen);
  rect(ctx, x+7, y+3, 2, 4, P.bookYellow);
  // Screen reflection
  ctx.globalAlpha = 0.15;
  rect(ctx, x+7, y+1, 3, 3, P.textWhite);
  ctx.globalAlpha = 1;
}

// ─── Chair (detailed, with wheels visible) ───
export function drawChair(ctx, x, y, color) {
  const c = color || P.chairBrown;
  // Wheels
  rect(ctx, x+1, y+8, 2, 2, P.cabinetDark);
  rect(ctx, x+5, y+8, 2, 2, P.cabinetDark);
  // Seat base
  rect(ctx, x, y+3, 8, 5, c);
  rect(ctx, x+1, y+4, 6, 3, P.chairDark);
  // Backrest
  rect(ctx, x+1, y, 6, 4, c);
  rect(ctx, x+2, y+1, 4, 2, P.chairDark);
  // Armrests
  rect(ctx, x-1, y+2, 2, 4, c);
  rect(ctx, x+7, y+2, 2, 4, c);
}

// ─── Filing Cabinet (detailed with label) ───
export function drawFilingCabinet(ctx, x, y) {
  // Shadow
  rect(ctx, x+1, y+23, 14, 2, P.border);
  // Body
  rect(ctx, x, y, 14, 23, P.cabinetGray);
  // Top edge
  rect(ctx, x, y, 14, 2, P.floorTileLight);
  // Side shadow
  rect(ctx, x+13, y, 1, 23, P.cabinetDark);
  // Drawers
  for (let i = 0; i < 3; i++) {
    const dy = y+3+i*7;
    rect(ctx, x+1, dy, 12, 6, P.cabinetDark);
    rect(ctx, x+2, dy+1, 10, 4, P.cabinetGray);
    // Handle
    rect(ctx, x+5, dy+2, 4, 2, P.floorTileLight);
    rect(ctx, x+6, dy+2, 2, 1, P.textWhite);
  }
  // Label slot on top drawer
  rect(ctx, x+3, y+4, 6, 2, P.textWhite);
}

// ─── Bookshelf (richer, with varying book sizes) ───
export function drawBookshelf(ctx, x, y) {
  // Shadow
  rect(ctx, x+1, y+30, 22, 2, P.border);
  // Frame
  rect(ctx, x, y, 22, 30, P.shelfWood);
  rect(ctx, x+1, y+1, 20, 28, P.shelfDark);
  // Top
  rect(ctx, x, y, 22, 2, P.deskLight);
  const bookColors = [P.bookRed, P.bookBlue, P.bookGreen, P.bookYellow, 
    '#6a4488', '#884444', P.bookBlue, P.bookRed, '#448844'];
  // 3 shelves of books
  for (let s = 0; s < 3; s++) {
    const sy = y + 3 + s*9;
    // Shelf board
    rect(ctx, x+1, sy+7, 20, 2, P.shelfWood);
    // Books (varied widths and heights)
    let bx = x+2;
    for (let b = 0; b < 6 && bx < x+20; b++) {
      const bw = 2 + (b % 3 === 0 ? 1 : 0);
      const bh = 5 + (b % 2);
      rect(ctx, bx, sy+(7-bh), bw, bh, bookColors[(s*6+b) % bookColors.length]);
      // Spine highlight
      rect(ctx, bx, sy+(7-bh), 1, bh, P.textWhite);
      ctx.globalAlpha = 0.15;
      rect(ctx, bx, sy+(7-bh), 1, bh, P.textWhite);
      ctx.globalAlpha = 1;
      bx += bw + 1;
    }
  }
}

// ─── Plant (lush, multi-leaf, with shadow) ───
export function drawPlant(ctx, x, y, size) {
  const s = size || 1;
  // Shadow
  ctx.globalAlpha = 0.3;
  rect(ctx, x+1*s, y+14*s, 8*s, 2*s, P.border);
  ctx.globalAlpha = 1;
  // Pot
  rect(ctx, x+2*s, y+8*s, 6*s, 6*s, P.potBrown);
  rect(ctx, x+3*s, y+8*s, 4*s, 1, P.potDark);
  rect(ctx, x+1*s, y+13*s, 8*s, 2*s, P.potDark);
  // Pot rim
  rect(ctx, x+1*s, y+8*s, 8*s, 1*s, '#8a6a40');
  // Soil
  rect(ctx, x+3*s, y+8*s+1, 4*s, 1*s, P.deskDark);
  // Main foliage
  rect(ctx, x+2*s, y+2*s, 6*s, 6*s, P.plantGreen);
  rect(ctx, x+1*s, y+3*s, 8*s, 4*s, P.plantGreen);
  // Highlights
  rect(ctx, x+3*s, y+1*s, 4*s, 2*s, P.plantLight);
  rect(ctx, x+5*s, y+3*s, 2*s, 2*s, P.plantLight);
  // Darker leaves
  rect(ctx, x, y+4*s, 2*s, 3*s, P.plantDark);
  rect(ctx, x+8*s, y+4*s, 2*s, 3*s, P.plantDark);
  rect(ctx, x+4*s, y+6*s, 2*s, 2*s, P.plantDark);
  // Top leaves
  rect(ctx, x+4*s, y, 2*s, 2*s, P.plantLight);
  rect(ctx, x+2*s, y+1*s, 1*s, 2*s, P.plantGreen);
  rect(ctx, x+7*s, y+2*s, 1*s, 2*s, P.plantGreen);
}

// ─── Window (with curtains, sky gradient, cloud) ───
export function drawWindow(ctx, x, y, w, h) {
  w = w||22; h = h||18;
  // Window frame
  rect(ctx, x-1, y-1, w+2, h+2, P.windowFrame);
  rect(ctx, x, y, w, h, P.windowFrame);
  // Glass panes
  rect(ctx, x+2, y+2, w-4, h-4, P.skyBlue);
  // Sky gradient
  rect(ctx, x+2, y+2, w-4, 3, '#9cc8e8');
  // Dividers
  rect(ctx, x+w/2-1, y, 2, h, P.windowFrame);
  rect(ctx, x, y+h/2-1, w, 2, P.windowFrame);
  // Trees + hills outside
  rect(ctx, x+3, y+h/2+2, 6, h/2-4, P.treesGreen);
  rect(ctx, x+w/2+2, y+h/2+2, 5, h/2-4, '#509040');
  rect(ctx, x+10, y+h/2+1, 4, h/2-3, '#60a050');
  // Cloud
  rect(ctx, x+4, y+3, 4, 2, P.textWhite);
  rect(ctx, x+3, y+4, 6, 1, P.textWhite);
  // Curtains (small side drapes)
  rect(ctx, x, y, 2, h, '#7a5a3a');
  rect(ctx, x+w-2, y, 2, h, '#7a5a3a');
  // Windowsill
  rect(ctx, x-1, y+h, w+2, 2, P.windowFrame);
}

// ─── Whiteboard (with sketch content) ───
export function drawWhiteboard(ctx, x, y, w, h) {
  rect(ctx, x-1, y-1, w+2, h+2, P.wbFrame);
  rect(ctx, x, y, w, h, P.whiteboard);
  // Content lines
  for (let i = 0; i < 4; i++) {
    const lw = w-14 - (i%2)*8;
    rect(ctx, x+4, y+4+i*4, lw, 1, P.cabinetGray);
  }
  // Bullet dots
  rect(ctx, x+3, y+4, 1, 1, P.shirtRed);
  rect(ctx, x+3, y+8, 1, 1, P.shirtBlue);
  rect(ctx, x+3, y+12, 1, 1, P.shirtGreen);
  // Marker tray
  rect(ctx, x+2, y+h-2, w-4, 2, P.cabinetDark);
  rect(ctx, x+4, y+h-3, 4, 1, P.shirtRed);
  rect(ctx, x+10, y+h-3, 4, 1, P.shirtBlue);
}

// ─── Presentation Screen (with pie chart + bar chart) ───
export function drawPresScreen(ctx, x, y, w, h) {
  // Frame
  rect(ctx, x-1, y-1, w+2, h+2, P.wbFrame);
  rect(ctx, x, y, w, h, '#e8e8e8');
  // Title bar
  rect(ctx, x, y, w, 3, P.wbFrame);
  // Bar chart
  const colors = [P.shirtBlue, P.shirtGreen, P.shirtRed, P.bookYellow, '#6a4488'];
  const startX = x + 4;
  for (let i = 0; i < 5; i++) {
    const bh = 4 + ((i+1)*3) % 14;
    rect(ctx, startX+i*5, y+h-4-bh, 4, bh, colors[i]);
  }
  // Pie chart (simple quadrant approximation)
  const cx = x+w-12, cy = y+10;
  rect(ctx, cx, cy, 4, 4, P.shirtBlue);
  rect(ctx, cx+4, cy, 4, 4, P.shirtGreen);
  rect(ctx, cx, cy+4, 4, 4, P.shirtRed);
  rect(ctx, cx+4, cy+4, 4, 4, P.bookYellow);
  // Trend line
  for (let i = 0; i < 8; i++) {
    rect(ctx, startX+i*3, y+h-6-((i*2)%8), 2, 1, P.plantDark);
  }
}

// ─── Couch (with pillows and texture) ───
export function drawCouch(ctx, x, y) {
  // Shadow
  ctx.globalAlpha = 0.3;
  rect(ctx, x+1, y+14, 28, 2, P.border);
  ctx.globalAlpha = 1;
  // Back
  rect(ctx, x, y-5, 28, 6, P.couchDark);
  rect(ctx, x+2, y-4, 24, 4, P.couchRed);
  // Main body
  rect(ctx, x, y, 28, 12, P.couchRed);
  // Front face
  rect(ctx, x, y+12, 28, 2, P.couchDark);
  // Arms
  rect(ctx, x-2, y-3, 3, 16, P.couchDark);
  rect(ctx, x+27, y-3, 3, 16, P.couchDark);
  // Cushion divider
  rect(ctx, x+13, y+1, 2, 10, P.couchDark);
  // Cushion highlights
  rect(ctx, x+3, y+2, 8, 2, '#a05040');
  rect(ctx, x+17, y+2, 8, 2, '#a05040');
  // Throw pillows
  rect(ctx, x+3, y+1, 5, 4, P.bookYellow);
  rect(ctx, x+20, y+1, 5, 4, P.shirtBlue);
}

// ─── Table (with wood grain) ───
export function drawTable(ctx, x, y, w, h) {
  // Legs
  rect(ctx, x+2, y+h+1, 2, 3, P.tableDark);
  rect(ctx, x+w-4, y+h+1, 2, 3, P.tableDark);
  // Surface
  rect(ctx, x, y, w, h, P.tableWood);
  rect(ctx, x+1, y+1, w-2, h-2, P.deskLight);
  // Grain
  rect(ctx, x+3, y+2, w-6, 1, P.tableWood);
  rect(ctx, x+5, y+h-3, w-10, 1, P.tableWood);
  // Front edge
  rect(ctx, x, y+h, w, 2, P.tableDark);
}

// ─── Boardroom Table (large with depth + paper details) ───
export function drawBoardTable(ctx, x, y, w, h) {
  // Table shadow
  ctx.globalAlpha = 0.25;
  rect(ctx, x+3, y+h+2, w, 4, P.border);
  ctx.globalAlpha = 1;
  // Rounded rectangle body
  const r = 8;
  rect(ctx, x+r, y, w-r*2, h, P.tableWood);
  rect(ctx, x, y+r, w, h-r*2, P.tableWood);
  // Surface highlight
  rect(ctx, x+3, y+3, w-6, h-6, P.deskLight);
  // Wood grain
  for (let gy = y+6; gy < y+h-4; gy += 6) {
    rect(ctx, x+5, gy, w-10, 1, P.tableWood);
  }
  // Front edge depth
  rect(ctx, x+r, y+h, w-r*2, 4, P.tableDark);
  rect(ctx, x+2, y+h-1, r, 4, P.tableDark);
  rect(ctx, x+w-r-2, y+h-1, r, 4, P.tableDark);
  // Papers
  rect(ctx, x+12, y+8, 8, 6, P.textWhite);
  rect(ctx, x+13, y+9, 6, 1, P.cabinetGray);
  rect(ctx, x+w-22, y+10, 8, 6, P.textWhite);
  rect(ctx, x+w/2-5, y+5, 10, 7, P.textWhite);
  rect(ctx, x+w/2-4, y+6, 8, 1, P.cabinetGray);
  rect(ctx, x+w/2-4, y+8, 6, 1, P.cabinetGray);
  // Coffee cups
  rect(ctx, x+24, y+6, 3, 3, P.textWhite);
  rect(ctx, x+24, y+5, 3, 1, P.cabinetGray);
  rect(ctx, x+w-14, y+8, 3, 3, P.textWhite);
}

// ─── Character (enhanced: 10x14px, shading, clothing detail) ───
export function drawCharacter(ctx, x, y, config, frame) {
  const { hair, shirt } = config;
  const hairC = P[hair] || P.hairBrown;
  const shirtC = P[shirt] || P.shirtBlue;
  // Head shadow on body
  rect(ctx, x+1, y+5, 6, 1, P.skinDark);
  // Head
  rect(ctx, x+1, y+1, 6, 5, P.skin);
  rect(ctx, x+2, y, 4, 1, P.skin);
  // Skin shading
  rect(ctx, x+1, y+4, 1, 2, P.skinDark);
  rect(ctx, x+6, y+4, 1, 2, P.skinDark);
  // Hair
  rect(ctx, x+1, y, 6, 2, hairC);
  rect(ctx, x+2, y-1, 4, 1, hairC);
  // Side hair
  rect(ctx, x, y+1, 1, 3, hairC);
  rect(ctx, x+7, y+1, 1, 3, hairC);
  // Eyes
  rect(ctx, x+2, y+3, 1, 1, P.hairBlack);
  rect(ctx, x+5, y+3, 1, 1, P.hairBlack);
  // Mouth
  rect(ctx, x+3, y+4, 2, 1, P.skinDark);
  // Body / shirt
  rect(ctx, x, y+6, 8, 6, shirtC);
  // Collar
  rect(ctx, x+2, y+6, 4, 1, P.textWhite);
  // Shirt shading
  rect(ctx, x, y+6, 1, 6, P.border);
  ctx.globalAlpha = 0.2;
  rect(ctx, x, y+6, 1, 6, P.border);
  ctx.globalAlpha = 1;
  rect(ctx, x+7, y+6, 1, 6, P.border);
  ctx.globalAlpha = 0.15;
  rect(ctx, x+7, y+6, 1, 6, P.border);
  ctx.globalAlpha = 1;
  // Arms
  rect(ctx, x-1, y+6, 1, 5, shirtC);
  rect(ctx, x+8, y+6, 1, 5, shirtC);
  // Hands
  rect(ctx, x-1, y+10, 1, 2, P.skin);
  rect(ctx, x+8, y+10, 1, 2, P.skin);
  // Idle animation - subtle head bob
  if (frame && frame % 80 < 40) {
    rect(ctx, x+2, y-2, 4, 1, hairC);
  }
}

// ─── Character sitting at desk ───
export function drawSeatedChar(ctx, x, y, config, frame) {
  drawCharacter(ctx, x, y, config, frame);
  // Pants visible below body
  rect(ctx, x+1, y+12, 3, 3, P.pants);
  rect(ctx, x+4, y+12, 3, 3, P.pants);
  // Shoes
  rect(ctx, x, y+14, 3, 1, P.hairBlack);
  rect(ctx, x+5, y+14, 3, 1, P.hairBlack);
}

// ─── Boardroom character (from above, with chair indication) ───
export function drawBoardChar(ctx, x, y, config, facing, frame) {
  const { hair, shirt } = config;
  const hairC = P[hair] || P.hairBrown;
  const shirtC = P[shirt] || P.shirtBlue;
  // Body (seen from slightly above)
  rect(ctx, x, y+4, 6, 5, shirtC);
  // Collar
  rect(ctx, x+2, y+4, 2, 1, P.textWhite);
  // Head
  rect(ctx, x+1, y, 4, 4, P.skin);
  // Hair
  rect(ctx, x+1, y, 4, 2, hairC);
  rect(ctx, x, y+1, 1, 1, hairC);
  rect(ctx, x+5, y+1, 1, 1, hairC);
  // Eyes (only for forward-facing)
  if (facing !== 'up') {
    rect(ctx, x+1, y+2, 1, 1, P.hairBlack);
    rect(ctx, x+4, y+2, 1, 1, P.hairBlack);
  }
  // Arms reaching to table
  rect(ctx, x-1, y+5, 1, 3, shirtC);
  rect(ctx, x+6, y+5, 1, 3, shirtC);
  rect(ctx, x-1, y+7, 1, 1, P.skin);
  rect(ctx, x+6, y+7, 1, 1, P.skin);
  // Animation
  if (frame && frame % 90 < 45) {
    rect(ctx, x+2, y-1, 2, 1, hairC);
  }
}

// ─── Wall Sconce / Light (with glow) ───
export function drawSconce(ctx, x, y, frame) {
  rect(ctx, x+1, y, 3, 5, P.deskWood);
  rect(ctx, x, y-2, 5, 3, P.bookYellow);
  rect(ctx, x+1, y-3, 3, 2, '#e0c060');
  // Glow
  const pulse = frame ? Math.sin(frame*0.03)*0.1+0.15 : 0.15;
  ctx.globalAlpha = pulse;
  rect(ctx, x-2, y-5, 9, 10, '#ffe880');
  ctx.globalAlpha = 1;
}

// ─── Wall Frame / Art (with scene inside) ───
export function drawWallArt(ctx, x, y, w, h) {
  rect(ctx, x-1, y-1, w+2, h+2, P.deskDark);
  rect(ctx, x, y, w, h, P.deskWood);
  rect(ctx, x+1, y+1, w-2, h-2, P.skyBlue);
  // Landscape inside frame
  rect(ctx, x+2, y+h-5, w-4, 3, P.treesGreen);
  rect(ctx, x+3, y+h-7, 3, 3, '#509040');
  // Sun
  rect(ctx, x+w-5, y+2, 2, 2, P.bookYellow);
}

// ─── Rug (with pattern) ───
export function drawRug(ctx, x, y, w, h) {
  rect(ctx, x, y, w, h, P.rugBorder);
  rect(ctx, x+2, y+2, w-4, h-4, P.rugPurple);
  rect(ctx, x+4, y+4, w-8, h-8, P.rugLight);
  // Inner pattern
  rect(ctx, x+6, y+6, w-12, h-12, P.rugPurple);
  rect(ctx, x+8, y+8, w-16, h-16, P.rugLight);
  // Corner decorations
  rect(ctx, x+3, y+3, 2, 2, P.bookYellow);
  rect(ctx, x+w-5, y+3, 2, 2, P.bookYellow);
  rect(ctx, x+3, y+h-5, 2, 2, P.bookYellow);
  rect(ctx, x+w-5, y+h-5, 2, 2, P.bookYellow);
}

// ─── Tile floor (checkered with grout lines) ───
export function drawTileFloor(ctx, x, y, w, h) {
  for (let ty = 0; ty < h; ty += 8) {
    for (let tx = 0; tx < w; tx += 8) {
      const light = (Math.floor(tx/8) + Math.floor(ty/8)) % 2 === 0;
      rect(ctx, x+tx, y+ty, 8, 8, light ? P.floorTileLight : P.floorTileDark);
      // Grout lines
      rect(ctx, x+tx, y+ty, 8, 1, '#a0a0a8');
      rect(ctx, x+tx, y+ty, 1, 8, '#a0a0a8');
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
  rect(ctx, x-2, y-2, 8, 8, c);
  ctx.globalAlpha = pulse;
  rect(ctx, x-1, y-1, 6, 6, c);
  ctx.globalAlpha = 1;
  rect(ctx, x, y, 4, 4, c);
  // Center highlight
  rect(ctx, x, y, 2, 2, P.textWhite);
  ctx.globalAlpha = 0.4;
  rect(ctx, x, y, 2, 2, P.textWhite);
  ctx.globalAlpha = 1;
}

// ─── Water cooler ───
export function drawWaterCooler(ctx, x, y) {
  // Base
  rect(ctx, x+1, y+14, 6, 4, P.cabinetGray);
  // Body
  rect(ctx, x, y+4, 8, 10, P.floorTileLight);
  rect(ctx, x+1, y+5, 6, 8, '#b0c8e0');
  // Water jug
  rect(ctx, x+1, y, 6, 5, '#90b8d8');
  rect(ctx, x+2, y-1, 4, 2, '#a0c8e0');
  // Spout
  rect(ctx, x+3, y+10, 2, 2, P.cabinetDark);
  // Cup holder
  rect(ctx, x-1, y+8, 2, 4, P.textWhite);
}

// ─── Coffee mug ───
export function drawMug(ctx, x, y, color) {
  rect(ctx, x, y, 4, 4, color||P.textWhite);
  rect(ctx, x, y, 4, 1, P.cabinetGray);
  rect(ctx, x+4, y+1, 1, 2, color||P.textWhite);
}

// ─── Wall clock ───
export function drawClock(ctx, x, y, frame) {
  rect(ctx, x, y, 8, 8, P.deskWood);
  rect(ctx, x+1, y+1, 6, 6, P.textWhite);
  // Center dot
  rect(ctx, x+3, y+3, 2, 2, P.hairBlack);
  // Hour hand
  rect(ctx, x+4, y+1, 1, 3, P.hairBlack);
  // Minute hand (animated)
  const angle = ((frame||0) % 360);
  if (angle < 90) rect(ctx, x+4, y+4, 2, 1, P.cabinetGray);
  else if (angle < 180) rect(ctx, x+4, y+4, 1, 2, P.cabinetGray);
  else if (angle < 270) rect(ctx, x+2, y+4, 2, 1, P.cabinetGray);
  else rect(ctx, x+4, y+2, 1, 2, P.cabinetGray);
}

// ─── Trash can ───
export function drawTrashCan(ctx, x, y) {
  rect(ctx, x, y, 6, 8, P.cabinetGray);
  rect(ctx, x+1, y+1, 4, 6, P.cabinetDark);
  rect(ctx, x-1, y, 8, 2, P.cabinetGray);
}

// ─── Pixel text ───
export function drawLabel(ctx, text, x, y, size, color, shadow) {
  ctx.font = `${size||6}px 'Press Start 2P', monospace`;
  ctx.textAlign = 'center';
  if (shadow !== false) {
    ctx.fillStyle = P.textShadow;
    ctx.fillText(text, x+1, y+1);
  }
  ctx.fillStyle = color || P.textCream;
  ctx.fillText(text, x, y);
}

// ─── Label with background ───
export function drawLabelBg(ctx, text, x, y, size, color) {
  ctx.font = `${size||6}px 'Press Start 2P', monospace`;
  ctx.textAlign = 'center';
  const tw = ctx.measureText(text).width;
  rect(ctx, x-tw/2-4, y-size-3, tw+8, size+7, P.labelBg);
  rect(ctx, x-tw/2-3, y-size-2, tw+6, size+5, '#1a1932');
  ctx.fillStyle = color || P.textCream;
  ctx.fillText(text, x, y);
}
