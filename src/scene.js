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
    S.drawWindow(ctx, r.x+10, r.y+6, 24, 20);
    S.drawWallArt(ctx, r.x+42, r.y+8, 14, 10);
    S.drawClock(ctx, r.x+62, r.y+8, frame);
    S.drawBookshelf(ctx, r.x+80, r.y+4);
    S.drawDesk(ctx, r.x+10, floorY+18, 44, 14, 'right');
    S.drawMonitor(ctx, r.x+16, floorY+4);
    S.drawMonitor(ctx, r.x+32, floorY+4, P.screenGreen);
    S.drawMug(ctx, r.x+48, floorY+20, P.shirtBlue);
    S.drawChair(ctx, r.x+24, floorY+36);
    S.drawSeatedChar(ctx, r.x+22, floorY+24, a, frame);
    S.drawFilingCabinet(ctx, r.x+r.w-20, floorY+4);
    S.drawPlant(ctx, r.x+r.w-16, floorY+38, 1);
    S.drawTrashCan(ctx, r.x+r.w-10, floorY+60);
  }

  // ─── Billy (CEO — executive desk, big windows, plant pair) ───
  if (key === 'billy') {
    S.drawWindow(ctx, r.x+24, r.y+6, 26, 20);
    S.drawWindow(ctx, r.x+r.w-54, r.y+6, 26, 20);
    S.drawWallArt(ctx, r.x+r.w/2-8, r.y+6, 16, 12);
    S.drawClock(ctx, r.x+r.w/2+14, r.y+8, frame);
    S.drawBookshelf(ctx, r.x+6, r.y+4);
    S.drawDesk(ctx, r.x+r.w/2-32, floorY+16, 64, 16, 'right');
    S.drawMonitor(ctx, r.x+r.w/2-8, floorY+2);
    S.drawMug(ctx, r.x+r.w/2+12, floorY+20, P.textWhite);
    S.drawChair(ctx, r.x+r.w/2-4, floorY+36);
    S.drawSeatedChar(ctx, r.x+r.w/2-6, floorY+24, a, frame);
    S.drawPlant(ctx, r.x+6, floorY+6, 2);
    S.drawPlant(ctx, r.x+r.w-20, floorY+6, 2);
    S.drawFilingCabinet(ctx, r.x+r.w-22, floorY+34);
    S.drawTrashCan(ctx, r.x+r.w/2+30, floorY+50);
  }

  // ─── Patrick (CFO — bookshelves, organized) ───
  if (key === 'patrick') {
    S.drawWindow(ctx, r.x+r.w-36, r.y+6, 24, 20);
    S.drawBookshelf(ctx, r.x+6, r.y+4);
    S.drawBookshelf(ctx, r.x+32, r.y+4);
    S.drawClock(ctx, r.x+60, r.y+8, frame);
    S.drawDesk(ctx, r.x+r.w-62, floorY+18, 44, 14, 'left');
    S.drawMonitor(ctx, r.x+r.w-52, floorY+4);
    S.drawMug(ctx, r.x+r.w-60, floorY+20, P.shirtGreen);
    S.drawChair(ctx, r.x+r.w-44, floorY+36);
    S.drawSeatedChar(ctx, r.x+r.w-46, floorY+24, a, frame);
    S.drawFilingCabinet(ctx, r.x+r.w-20, floorY+40);
    S.drawFilingCabinet(ctx, r.x+r.w-20, floorY+4);
    S.drawPlant(ctx, r.x+8, floorY+50, 1);
  }

  // ─── Marcos (Lawyer — lots of books, framed certificates) ───
  if (key === 'marcos') {
    S.drawWindow(ctx, r.x+10, r.y+6, 24, 20);
    S.drawWallArt(ctx, r.x+42, r.y+8, 12, 10);
    S.drawWallArt(ctx, r.x+58, r.y+8, 12, 10);
    S.drawBookshelf(ctx, r.x+80, r.y+4);
    S.drawBookshelf(ctx, r.x+106, r.y+4);
    S.drawClock(ctx, r.x+r.w-14, r.y+10, frame);
    S.drawDesk(ctx, r.x+10, floorY+24, 40, 14, 'right');
    S.drawMonitor(ctx, r.x+18, floorY+10);
    S.drawMug(ctx, r.x+36, floorY+26, P.shirtRed);
    S.drawChair(ctx, r.x+22, floorY+42);
    S.drawSeatedChar(ctx, r.x+20, floorY+30, a, frame);
    S.drawFilingCabinet(ctx, r.x+r.w-20, floorY+10);
    S.drawFilingCabinet(ctx, r.x+r.w-20, floorY+38);
    S.drawPlant(ctx, r.x+4, floorY+80, 1);
    S.drawTrashCan(ctx, r.x+62, floorY+80);
  }

  // ─── Sandra (Line Producer — organized, whiteboards) ───
  if (key === 'sandra') {
    S.drawWindow(ctx, r.x+r.w-36, r.y+6, 24, 20);
    S.drawWhiteboard(ctx, r.x+8, r.y+6, 28, 20);
    S.drawBookshelf(ctx, r.x+44, r.y+4);
    S.drawClock(ctx, r.x+r.w-14, r.y+10, frame);
    S.drawDesk(ctx, r.x+r.w-58, floorY+24, 40, 14, 'left');
    S.drawMonitor(ctx, r.x+r.w-48, floorY+10);
    S.drawMug(ctx, r.x+r.w-28, floorY+26, P.bookYellow);
    S.drawChair(ctx, r.x+r.w-42, floorY+42);
    S.drawSeatedChar(ctx, r.x+r.w-44, floorY+30, a, frame);
    S.drawFilingCabinet(ctx, r.x+6, floorY+10);
    S.drawFilingCabinet(ctx, r.x+6, floorY+38);
    S.drawPlant(ctx, r.x+r.w-16, floorY+80, 1);
    S.drawTrashCan(ctx, r.x+26, floorY+80);
  }

  // ─── Charlie (Designer — art on walls, drawing table, colorful) ───
  if (key === 'charlie') {
    S.drawWindow(ctx, r.x+10, r.y+6, 24, 20);
    S.drawWallArt(ctx, r.x+44, r.y+8, 18, 14);
    S.drawWallArt(ctx, r.x+68, r.y+10, 12, 10);
    S.drawWallArt(ctx, r.x+86, r.y+8, 10, 12);
    S.drawTable(ctx, r.x+60, floorY+14, 46, 22);
    S.drawDesk(ctx, r.x+10, floorY+16, 36, 12, 'right');
    S.drawMonitor(ctx, r.x+16, floorY+4, '#c090d0');
    S.drawMug(ctx, r.x+36, floorY+18, P.shirtOrange);
    S.drawChair(ctx, r.x+22, floorY+32);
    S.drawSeatedChar(ctx, r.x+20, floorY+20, a, frame);
    S.drawPlant(ctx, r.x+r.w-16, floorY+6, 1);
    S.drawTrashCan(ctx, r.x+r.w-10, floorY+52);
  }

  // ─── Wendy (Performance Coach — couch, zen plant, whiteboard) ───
  if (key === 'wendy') {
    S.drawWindow(ctx, r.x+r.w-36, r.y+6, 24, 20);
    S.drawWhiteboard(ctx, r.x+8, r.y+6, 24, 18);
    S.drawWallArt(ctx, r.x+38, r.y+10, 14, 10);
    S.drawClock(ctx, r.x+r.w-14, r.y+10, frame);
    S.drawDesk(ctx, r.x+r.w-58, floorY+16, 40, 14, 'left');
    S.drawMonitor(ctx, r.x+r.w-46, floorY+2);
    S.drawMug(ctx, r.x+r.w-56, floorY+18, P.shirtPurple);
    S.drawChair(ctx, r.x+r.w-40, floorY+34);
    S.drawSeatedChar(ctx, r.x+r.w-42, floorY+22, a, frame);
    S.drawFilingCabinet(ctx, r.x+6, floorY+6);
    S.drawCouch(ctx, r.x+38, floorY+48);
    S.drawTrashCan(ctx, r.x+r.w-10, floorY+52);
    S.drawPlant(ctx, r.x+r.w-16, floorY+50, 2);
  }

  // Agent name label as HEADER above the office
  S.drawLabelBg(ctx, a.name, r.x+r.w/2, r.y-10, 5, P.textWhite);
  S.drawLabel(ctx, a.role, r.x+r.w/2, r.y-2, 4, P.textCream);

  // Status indicator
  S.drawStatusDot(ctx, r.x+r.w-10, r.y+6, a.status, frame);

  // Brown walls with door opening
  S.drawRoomWalls(ctx, r);
}

// ─── Boardroom ───
function drawBoardroom(ctx, frame) {
  const r = ROOMS.board;
  const wallH = Math.round(r.h * 0.25);

  // Ceiling shadow
  S.rect(ctx, r.x, r.y, r.w, 3, P.border);
  // Wall
  S.rect(ctx, r.x, r.y+3, r.w, wallH-3, P.wallTeal);
  S.rect(ctx, r.x, r.y+3, r.w, 1, P.wallTealLight);
  // Wall texture
  for (let wx = r.x+8; wx < r.x+r.w; wx += 14) {
    S.rect(ctx, wx, r.y+5, 1, wallH-8, P.wallTealDark);
  }
  // Baseboard
  S.rect(ctx, r.x, r.y+wallH-3, r.w, 3, P.deskDark);
  S.rect(ctx, r.x, r.y+wallH-4, r.w, 1, P.deskWood);

  // Floor (carpet with rug)
  S.rect(ctx, r.x, r.y+wallH, r.w, r.h-wallH, P.floorCarpet);
  S.drawRug(ctx, r.x+14, r.y+wallH+4, r.w-28, r.h-wallH-14);

  // Presentation screen + whiteboard on wall
  S.drawPresScreen(ctx, r.x+36, r.y+4, 44, 28);
  S.drawWhiteboard(ctx, r.x+r.w-80, r.y+6, 38, 24);

  // Wall sconces
  S.drawSconce(ctx, r.x+18, r.y+8, frame);
  S.drawSconce(ctx, r.x+r.w-22, r.y+8, frame);

  // Large boardroom table
  const tx = r.x + 50, ty = r.y + wallH + 20;
  const tw = r.w - 100, th = r.h - wallH - 50;
  S.drawBoardTable(ctx, tx, ty, tw, th);

  // Empty chairs around the table (no agents)
  // Top side chairs
  for (let i = 0; i < 3; i++) {
    const ax = tx + 14 + i * Math.floor(tw/3);
    S.rect(ctx, ax-1, ty-4, 8, 4, P.chairBrown);
    S.rect(ctx, ax, ty-3, 6, 2, P.chairDark);
  }
  // Bottom side chairs
  for (let i = 0; i < 3; i++) {
    const ax = tx + 14 + i * Math.floor(tw/3);
    S.rect(ctx, ax-1, ty+th+1, 8, 4, P.chairBrown);
    S.rect(ctx, ax, ty+th+2, 6, 2, P.chairDark);
  }
  // Right side chair
  S.rect(ctx, tx+tw+2, ty+th/2-3, 4, 8, P.chairBrown);
  S.rect(ctx, tx+tw+3, ty+th/2-2, 2, 6, P.chairDark);


  // Water cooler
  S.drawWaterCooler(ctx, r.x+r.w-14, r.y+r.h-28);

  // Label as HEADER above the boardroom
  S.drawLabelBg(ctx, 'BOARD ROOM', r.x+r.w/2, r.y-10, 6, P.textWhite);

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
  S.drawPlant(ctx, hl.x+6, hl.y+4, 1);
  S.drawPlant(ctx, hr.x+6, hr.y+4, 1);
}

// ─── Break room ───
function drawBreakRoom(ctx, frame) {
  const r = ROOMS.breakRm;
  const wallH = Math.round(r.h * 0.32);

  S.rect(ctx, r.x, r.y, r.w, 3, P.border);
  S.rect(ctx, r.x, r.y+3, r.w, wallH-3, P.wallBeige);
  S.rect(ctx, r.x, r.y+wallH-3, r.w, 3, P.deskDark);
  S.drawTileFloor(ctx, r.x, r.y+wallH, r.w, r.h-wallH);

  // Wall decorations
  S.drawClock(ctx, r.x+10, r.y+8, frame);
  S.drawWallArt(ctx, r.x+24, r.y+8, 14, 10);

  // Table + chairs
  S.drawTable(ctx, r.x+14, r.y+wallH+12, 34, 18);
  S.drawChair(ctx, r.x+18, r.y+wallH+34, P.chairBrown);
  S.drawChair(ctx, r.x+34, r.y+wallH+34, P.chairBrown);

  // Couch
  S.drawCouch(ctx, r.x+r.w-38, r.y+wallH+28);



  S.drawLabelBg(ctx, 'BREAK ROOM', r.x+r.w/2, r.y+r.h-8, 4, P.textCream);
}

// ─── WC rooms ───
function drawWC(ctx, key) {
  const r = ROOMS[key];
  const wallH = Math.round(r.h * 0.32);

  S.rect(ctx, r.x, r.y, r.w, 3, P.border);
  S.rect(ctx, r.x, r.y+3, r.w, wallH-3, P.wallCream);
  S.rect(ctx, r.x, r.y+wallH-3, r.w, 3, P.deskDark);
  // Distinct bathroom floor (light blue/white ceramic)
  for (let ty = 0; ty < r.h - wallH; ty += 6) {
    for (let tx = 0; tx < r.w; tx += 6) {
      const light = (Math.floor(tx/6) + Math.floor(ty/6)) % 2 === 0;
      S.rect(ctx, r.x+tx, r.y+wallH+ty, 6, 6, light ? '#c8dce8' : '#a8bcc8');
      S.rect(ctx, r.x+tx, r.y+wallH+ty, 6, 1, '#b0c4d0');
      S.rect(ctx, r.x+tx, r.y+wallH+ty, 1, 6, '#b0c4d0');
    }
  }

  // Stall partitions
  S.rect(ctx, r.x+4, r.y+wallH+4, r.w-8, 18, P.whiteboard);
  S.rect(ctx, r.x+4, r.y+wallH+4, r.w-8, 2, P.cabinetGray);
  S.rect(ctx, r.x+r.w/2, r.y+wallH+4, 1, 18, P.cabinetGray);
  // Sink
  S.rect(ctx, r.x+r.w/2-6, r.y+wallH+28, 12, 6, P.floorTileLight);
  S.rect(ctx, r.x+r.w/2-4, r.y+wallH+29, 8, 4, '#a0c0d0');
  // Mirror
  S.rect(ctx, r.x+r.w/2-5, r.y+8, 10, 14, P.cabinetGray);
  S.rect(ctx, r.x+r.w/2-4, r.y+9, 8, 12, '#c0d8e8');

  S.drawLabelBg(ctx, 'WC', r.x+r.w/2, r.y+r.h-8, 5, P.textCream);

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
