import { P } from './palette.js';
import { ROOMS, AGENTS, GAP, GAME_W, GAME_H } from './layout.js';
import * as S from './sprites.js';

// ─── Draw individual office ───
function drawOffice(ctx, key, frame) {
  const r = ROOMS[key];
  const a = AGENTS[key];
  if (!r || !a) return;

  S.drawRoomBase(ctx, r, P.wallTeal, P.floorWood);
  const wallH = Math.round(r.h * 0.32);
  const floorY = r.y + wallH;

  // ─── Isaac (Development — dual monitors, messy desk) ───
  if (key === 'isaac') {
    S.drawWindow(ctx, r.x+20, r.y+12, 48, 40);
    S.drawWallArt(ctx, r.x+84, r.y+16, 28, 20);
    S.drawClock(ctx, r.x+124, r.y+16, frame);
    S.drawBookshelf(ctx, r.x+160, r.y+8);
    S.drawDesk(ctx, r.x+20, floorY+36, 88, 28, 'right');
    S.drawMonitor(ctx, r.x+32, floorY+8);
    S.drawMonitor(ctx, r.x+64, floorY+8, P.screenGreen);
    S.drawMug(ctx, r.x+96, floorY+40, P.shirtBlue);
    S.drawChair(ctx, r.x+48, floorY+72);
    S.drawSeatedChar(ctx, r.x+44, floorY+48, a, frame, key);
    S.drawFilingCabinet(ctx, r.x+r.w-40, floorY+8);
    S.drawPlant(ctx, r.x+r.w-32, floorY+76, 1);
    S.drawTrashCan(ctx, r.x+r.w-20, floorY+120);
  }

  // ─── Billy (CEO — executive desk, big windows, plant pair) ───
  if (key === 'billy') {
    S.drawWindow(ctx, r.x+48, r.y+12, 52, 40);
    S.drawWindow(ctx, r.x+r.w-108, r.y+12, 52, 40);
    S.drawWallArt(ctx, r.x+r.w/2-16, r.y+12, 32, 24);
    S.drawClock(ctx, r.x+r.w/2+28, r.y+16, frame);
    S.drawBookshelf(ctx, r.x+12, r.y+8);
    S.drawDesk(ctx, r.x+r.w/2-64, floorY+32, 128, 32, 'right');
    S.drawMonitor(ctx, r.x+r.w/2-16, floorY+4);
    S.drawMug(ctx, r.x+r.w/2+24, floorY+40, P.textWhite);
    S.drawChair(ctx, r.x+r.w/2-8, floorY+72);
    S.drawSeatedChar(ctx, r.x+r.w/2-12, floorY+48, a, frame, key);
    S.drawPlant(ctx, r.x+12, floorY+12, 2);
    S.drawPlant(ctx, r.x+r.w-40, floorY+12, 2);
    S.drawFilingCabinet(ctx, r.x+r.w-44, floorY+68);
    S.drawTrashCan(ctx, r.x+r.w/2+60, floorY+100);
  }

  // ─── Patrick (CFO — bookshelves, organized) ───
  if (key === 'patrick') {
    S.drawWindow(ctx, r.x+r.w-72, r.y+12, 48, 40);
    S.drawBookshelf(ctx, r.x+12, r.y+8);
    S.drawBookshelf(ctx, r.x+64, r.y+8);
    S.drawClock(ctx, r.x+120, r.y+16, frame);
    S.drawDesk(ctx, r.x+r.w-124, floorY+36, 88, 28, 'left');
    S.drawMonitor(ctx, r.x+r.w-104, floorY+8);
    S.drawMug(ctx, r.x+r.w-120, floorY+40, P.shirtGreen);
    S.drawChair(ctx, r.x+r.w-88, floorY+72);
    S.drawSeatedChar(ctx, r.x+r.w-92, floorY+48, a, frame, key);
    S.drawFilingCabinet(ctx, r.x+r.w-40, floorY+80);
    S.drawFilingCabinet(ctx, r.x+r.w-40, floorY+8);
    S.drawPlant(ctx, r.x+16, floorY+100, 1);
  }

  // ─── Marcos (Lawyer — lots of books, framed certificates) ───
  if (key === 'marcos') {
    S.drawWindow(ctx, r.x+20, r.y+12, 48, 40);
    S.drawWallArt(ctx, r.x+84, r.y+16, 24, 20);
    S.drawWallArt(ctx, r.x+116, r.y+16, 24, 20);
    S.drawBookshelf(ctx, r.x+160, r.y+8);
    S.drawBookshelf(ctx, r.x+212, r.y+8);
    S.drawClock(ctx, r.x+r.w-28, r.y+20, frame);
    S.drawDesk(ctx, r.x+20, floorY+48, 80, 28, 'right');
    S.drawMonitor(ctx, r.x+36, floorY+20);
    S.drawMug(ctx, r.x+72, floorY+52, P.shirtRed);
    S.drawChair(ctx, r.x+44, floorY+84);
    S.drawSeatedChar(ctx, r.x+40, floorY+60, a, frame, key);
    S.drawFilingCabinet(ctx, r.x+r.w-40, floorY+20);
    S.drawFilingCabinet(ctx, r.x+r.w-40, floorY+76);
    S.drawPlant(ctx, r.x+8, floorY+160, 1);
    S.drawTrashCan(ctx, r.x+124, floorY+160);
  }

  // ─── Sandra (Line Producer — organized, whiteboards) ───
  if (key === 'sandra') {
    S.drawWindow(ctx, r.x+r.w-72, r.y+12, 48, 40);
    S.drawWhiteboard(ctx, r.x+16, r.y+12, 56, 40);
    S.drawBookshelf(ctx, r.x+88, r.y+8);
    S.drawClock(ctx, r.x+r.w-28, r.y+20, frame);
    S.drawDesk(ctx, r.x+r.w-116, floorY+48, 80, 28, 'left');
    S.drawMonitor(ctx, r.x+r.w-96, floorY+20);
    S.drawMug(ctx, r.x+r.w-56, floorY+52, P.bookYellow);
    S.drawChair(ctx, r.x+r.w-84, floorY+84);
    S.drawSeatedChar(ctx, r.x+r.w-88, floorY+60, a, frame, key);
    S.drawFilingCabinet(ctx, r.x+12, floorY+20);
    S.drawFilingCabinet(ctx, r.x+12, floorY+76);
    S.drawPlant(ctx, r.x+r.w-32, floorY+160, 1);
    S.drawTrashCan(ctx, r.x+52, floorY+160);
  }

  // ─── Charlie (Designer — art on walls, drawing table, colorful) ───
  if (key === 'charlie') {
    S.drawWindow(ctx, r.x+20, r.y+12, 48, 40);
    S.drawWallArt(ctx, r.x+88, r.y+16, 36, 28);
    S.drawWallArt(ctx, r.x+136, r.y+20, 24, 20);
    S.drawWallArt(ctx, r.x+172, r.y+16, 20, 24);
    S.drawTable(ctx, r.x+120, floorY+28, 92, 44);
    S.drawDesk(ctx, r.x+20, floorY+32, 72, 24, 'right');
    S.drawMonitor(ctx, r.x+32, floorY+8, '#c090d0');
    S.drawMug(ctx, r.x+72, floorY+36, P.shirtOrange);
    S.drawChair(ctx, r.x+44, floorY+64);
    S.drawSeatedChar(ctx, r.x+40, floorY+40, a, frame, key);
    S.drawPlant(ctx, r.x+r.w-32, floorY+12, 1);
    S.drawTrashCan(ctx, r.x+r.w-20, floorY+104);
  }

  // ─── Wendy (Performance Coach — couch, zen plant, whiteboard) ───
  if (key === 'wendy') {
    S.drawWindow(ctx, r.x+r.w-72, r.y+12, 48, 40);
    S.drawWhiteboard(ctx, r.x+16, r.y+12, 48, 36);
    S.drawWallArt(ctx, r.x+76, r.y+20, 28, 20);
    S.drawClock(ctx, r.x+r.w-28, r.y+20, frame);
    S.drawDesk(ctx, r.x+r.w-116, floorY+32, 80, 28, 'left');
    S.drawMonitor(ctx, r.x+r.w-92, floorY+4);
    S.drawMug(ctx, r.x+r.w-112, floorY+36, P.shirtPurple);
    S.drawChair(ctx, r.x+r.w-80, floorY+68);
    S.drawSeatedChar(ctx, r.x+r.w-84, floorY+44, a, frame, key);
    S.drawFilingCabinet(ctx, r.x+12, floorY+12);
    S.drawCouch(ctx, r.x+76, floorY+96);
    S.drawTrashCan(ctx, r.x+r.w-20, floorY+104);
    S.drawPlant(ctx, r.x+r.w-32, floorY+100, 2);
  }

  // Agent name label as HEADER above the office
  S.drawLabelBg(ctx, a.name, r.x+r.w/2, r.y-20, 10, P.textWhite);
  S.drawLabel(ctx, a.role, r.x+r.w/2, r.y-4, 8, P.textCream);

  // Status indicator
  S.drawStatusDot(ctx, r.x+r.w-20, r.y+12, a.status, frame);

  // Brown walls with door opening
  S.drawRoomWalls(ctx, r);
}

// ─── Boardroom ───
function drawBoardroom(ctx, frame) {
  const r = ROOMS.board;
  const wallH = Math.round(r.h * 0.25);

  // Ceiling shadow
  S.rect(ctx, r.x, r.y, r.w, 6, P.border);
  // Wall
  S.rect(ctx, r.x, r.y+6, r.w, wallH-6, P.wallTeal);
  S.rect(ctx, r.x, r.y+6, r.w, 2, P.wallTealLight);
  // Wall texture
  for (let wx = r.x+16; wx < r.x+r.w; wx += 28) {
    S.rect(ctx, wx, r.y+10, 2, wallH-16, P.wallTealDark);
  }
  // Baseboard
  S.rect(ctx, r.x, r.y+wallH-6, r.w, 6, P.deskDark);
  S.rect(ctx, r.x, r.y+wallH-8, r.w, 2, P.deskWood);

  // Floor (charcoal wood planks — vertical)
  const fy = r.y + wallH;
  const fh = r.h - wallH;
  S.rect(ctx, r.x, fy, r.w, fh, '#2A2828');
  // Vertical plank lines
  for (let px = r.x + 20; px < r.x + r.w; px += 20) {
    S.rect(ctx, px, fy, 2, fh, '#1E1C1C');
    // Stagger horizontal joints
    const offset = ((px - r.x) % 40 === 0) ? 40 : 100;
    S.rect(ctx, px - 10, fy + offset, 10, 2, '#1E1C1C');
    S.rect(ctx, px - 10, fy + offset + 120, 10, 2, '#1E1C1C');
  }
  // Edge shadow at baseboard
  S.rect(ctx, r.x, fy, r.w, 4, '#1E1C1C');

  // Presentation screen + whiteboard on wall
  S.drawPresScreen(ctx, r.x+72, r.y+8, 88, 56);
  S.drawWhiteboard(ctx, r.x+r.w-160, r.y+12, 76, 48);

  // Wall sconces
  S.drawSconce(ctx, r.x+36, r.y+16, frame);
  S.drawSconce(ctx, r.x+r.w-44, r.y+16, frame);

  // Large boardroom table (20% smaller)
  const fullW = r.w - 200, fullH = r.h - wallH - 100;
  const tw = Math.round(fullW * 0.8), th = Math.round(fullH * 0.8);
  const tx = r.x + 100 + Math.round((fullW - tw) / 2);
  const ty = r.y + wallH + 40 + Math.round((fullH - th) / 2);
  S.drawBoardTable(ctx, tx, ty, tw, th);

  // Executive leather chairs around the table
  const cBrown = '#5C3A1E';   // leather brown
  const cDark  = '#3A2410';   // shadow/armrest
  const cSeat  = '#6B4828';   // seat cushion
  // Helper: draw executive chair facing direction
  function execChair(cx, cy, facing) {
    if (facing === 'down') {
      // Backrest (top)
      S.rect(ctx, cx-10, cy-4, 20, 6, cBrown);
      S.rect(ctx, cx-8, cy-2, 16, 2, cDark);
      // Seat cushion
      S.rect(ctx, cx-10, cy+2, 20, 14, cSeat);
      S.rect(ctx, cx-8, cy+4, 16, 10, cBrown);
      // Armrests
      S.rect(ctx, cx-12, cy, 4, 16, cDark);
      S.rect(ctx, cx+8, cy, 4, 16, cDark);
    } else if (facing === 'up') {
      // Seat cushion
      S.rect(ctx, cx-10, cy, 20, 14, cSeat);
      S.rect(ctx, cx-8, cy+2, 16, 10, cBrown);
      // Backrest (bottom)
      S.rect(ctx, cx-10, cy+14, 20, 6, cBrown);
      S.rect(ctx, cx-8, cy+16, 16, 2, cDark);
      // Armrests
      S.rect(ctx, cx-12, cy, 4, 18, cDark);
      S.rect(ctx, cx+8, cy, 4, 18, cDark);
    } else if (facing === 'left') {
      // Seat
      S.rect(ctx, cx, cy-8, 14, 18, cSeat);
      S.rect(ctx, cx+2, cy-6, 10, 14, cBrown);
      // Backrest (right side)
      S.rect(ctx, cx+14, cy-10, 6, 22, cBrown);
      S.rect(ctx, cx+16, cy-8, 2, 18, cDark);
      // Armrests
      S.rect(ctx, cx, cy-10, 14, 4, cDark);
      S.rect(ctx, cx, cy+8, 14, 4, cDark);
    }
  }
  // Top side chairs (facing down toward table)
  for (let i = 0; i < 3; i++) {
    const ax = tx + 28 + i * Math.floor(tw/3);
    execChair(ax, ty - 18, 'down');
  }
  // Bottom side chairs (facing up toward table)
  for (let i = 0; i < 3; i++) {
    const ax = tx + 28 + i * Math.floor(tw/3);
    execChair(ax, ty + th + 4, 'up');
  }
  // Right side chair (facing left toward table)
  execChair(tx + tw + 8, ty + th/2 - 2, 'left');

  // Water cooler
  S.drawWaterCooler(ctx, r.x+r.w-28, r.y+r.h-56);

  // Label as HEADER above the boardroom
  S.drawLabelBg(ctx, 'BOARD ROOM', r.x+r.w/2, r.y-20, 12, P.textWhite);

  // Brown walls with door opening
  S.drawRoomWalls(ctx, r);
}

// ─── Hallways (extended floor into gap areas for seamless corridors) ───
function drawHallways(ctx) {
  const ht = ROOMS.hallT;
  const hb = ROOMS.hallB;
  const hl = ROOMS.hallL;
  const hr = ROOMS.hallR;
  const G = GAP;

  // Extended horizontal corridor strips (bleed into gaps above/below)
  S.drawTileFloor(ctx, ht.x - G, ht.y - G, ht.w + G*2, ht.h + G*2);
  S.drawTileFloor(ctx, hb.x - G, hb.y - G, hb.w + G*2, hb.h + G*2);

  // Extended vertical corridor strips (bleed into gaps left/right)
  S.drawTileFloor(ctx, hl.x - G, hl.y - G, hl.w + G*2, hl.h + G*2);
  S.drawTileFloor(ctx, hr.x - G, hr.y - G, hr.w + G*2, hr.h + G*2);

  // Hallway decoration: potted plants at corners
  S.drawPlant(ctx, hl.x+12, hl.y+8, 1);
  S.drawPlant(ctx, hr.x+12, hr.y+8, 1);
}


// ─── Main scene draw ───
export function drawScene(ctx, w, h, frame) {
  S.rect(ctx, 0, 0, w, h, P.border);

  // Fill ENTIRE building area with tile floor (underneath everything)
  S.drawTileFloor(ctx, 0, 0, GAME_W, GAME_H);

  // Hallway labels and decorations (on top of base floor)
  drawHallways(ctx);

  // Rooms draw on top with their own walls and floors
  drawBoardroom(ctx, frame);

  ['isaac', 'billy', 'patrick', 'marcos', 'sandra', 'charlie', 'wendy'].forEach(key => {
    drawOffice(ctx, key, frame);
  });

}

// ─── Hit detection ───
export function hitTest(gx, gy) {
  for (const [key, r] of Object.entries(ROOMS)) {
    if (gx >= r.x && gx < r.x+r.w && gy >= r.y && gy < r.y+r.h) {
      return key;
    }
  }
  return null;
}
