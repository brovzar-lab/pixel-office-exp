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

  // Floor (carpet with rug)
  S.rect(ctx, r.x, r.y+wallH, r.w, r.h-wallH, P.floorCarpet);
  S.drawRug(ctx, r.x+28, r.y+wallH+8, r.w-56, r.h-wallH-28);

  // Presentation screen + whiteboard on wall
  S.drawPresScreen(ctx, r.x+72, r.y+8, 88, 56);
  S.drawWhiteboard(ctx, r.x+r.w-160, r.y+12, 76, 48);

  // Wall sconces
  S.drawSconce(ctx, r.x+36, r.y+16, frame);
  S.drawSconce(ctx, r.x+r.w-44, r.y+16, frame);

  // Large boardroom table
  const tx = r.x + 100, ty = r.y + wallH + 40;
  const tw = r.w - 200, th = r.h - wallH - 100;
  S.drawBoardTable(ctx, tx, ty, tw, th);

  // Empty chairs around the table (no agents)
  // Top side chairs
  for (let i = 0; i < 3; i++) {
    const ax = tx + 28 + i * Math.floor(tw/3);
    S.rect(ctx, ax-2, ty-8, 16, 8, P.chairBrown);
    S.rect(ctx, ax, ty-6, 12, 4, P.chairDark);
  }
  // Bottom side chairs
  for (let i = 0; i < 3; i++) {
    const ax = tx + 28 + i * Math.floor(tw/3);
    S.rect(ctx, ax-2, ty+th+2, 16, 8, P.chairBrown);
    S.rect(ctx, ax, ty+th+4, 12, 4, P.chairDark);
  }
  // Right side chair
  S.rect(ctx, tx+tw+4, ty+th/2-6, 8, 16, P.chairBrown);
  S.rect(ctx, tx+tw+6, ty+th/2-4, 4, 12, P.chairDark);

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

// ─── Break room ───
function drawBreakRoom(ctx, frame) {
  const r = ROOMS.breakRm;
  const wallH = Math.round(r.h * 0.32);

  S.rect(ctx, r.x, r.y, r.w, 6, P.border);
  S.rect(ctx, r.x, r.y+6, r.w, wallH-6, P.wallBeige);
  S.rect(ctx, r.x, r.y+wallH-6, r.w, 6, P.deskDark);
  S.drawTileFloor(ctx, r.x, r.y+wallH, r.w, r.h-wallH);

  // Wall decorations
  S.drawClock(ctx, r.x+20, r.y+16, frame);
  S.drawWallArt(ctx, r.x+48, r.y+16, 28, 20);

  // Table + chairs
  S.drawTable(ctx, r.x+28, r.y+wallH+24, 68, 36);
  S.drawChair(ctx, r.x+36, r.y+wallH+68, P.chairBrown);
  S.drawChair(ctx, r.x+68, r.y+wallH+68, P.chairBrown);

  // Couch
  S.drawCouch(ctx, r.x+r.w-76, r.y+wallH+56);

  S.drawLabelBg(ctx, 'BREAK ROOM', r.x+r.w/2, r.y+r.h-16, 8, P.textCream);
}

// ─── WC rooms ───
function drawWC(ctx, key) {
  const r = ROOMS[key];
  const wallH = Math.round(r.h * 0.32);

  S.rect(ctx, r.x, r.y, r.w, 6, P.border);
  S.rect(ctx, r.x, r.y+6, r.w, wallH-6, P.wallCream);
  S.rect(ctx, r.x, r.y+wallH-6, r.w, 6, P.deskDark);
  // Distinct bathroom floor (light blue/white ceramic)
  for (let ty = 0; ty < r.h - wallH; ty += 12) {
    for (let tx = 0; tx < r.w; tx += 12) {
      const light = (Math.floor(tx/12) + Math.floor(ty/12)) % 2 === 0;
      S.rect(ctx, r.x+tx, r.y+wallH+ty, 12, 12, light ? '#c8dce8' : '#a8bcc8');
      S.rect(ctx, r.x+tx, r.y+wallH+ty, 12, 2, '#b0c4d0');
      S.rect(ctx, r.x+tx, r.y+wallH+ty, 2, 12, '#b0c4d0');
    }
  }

  // Stall partitions
  S.rect(ctx, r.x+8, r.y+wallH+8, r.w-16, 36, P.whiteboard);
  S.rect(ctx, r.x+8, r.y+wallH+8, r.w-16, 4, P.cabinetGray);
  S.rect(ctx, r.x+r.w/2, r.y+wallH+8, 2, 36, P.cabinetGray);
  // Sink
  S.rect(ctx, r.x+r.w/2-12, r.y+wallH+56, 24, 12, P.floorTileLight);
  S.rect(ctx, r.x+r.w/2-8, r.y+wallH+58, 16, 8, '#a0c0d0');
  // Mirror
  S.rect(ctx, r.x+r.w/2-10, r.y+16, 20, 28, P.cabinetGray);
  S.rect(ctx, r.x+r.w/2-8, r.y+18, 16, 24, '#c0d8e8');

  S.drawLabelBg(ctx, 'WC', r.x+r.w/2, r.y+r.h-16, 10, P.textCream);

  // Brown walls with door opening
  S.drawRoomWalls(ctx, ROOMS[key]);
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

  drawBreakRoom(ctx, frame);
  drawWC(ctx, 'wc1');
  drawWC(ctx, 'wc2');
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
