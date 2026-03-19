// Room layout definitions - all coordinates in game pixels (1280x912 native, Tier 2 double resolution)
export const GAME_W = 1280;
export const GAME_H = 912;
export const SCALE = 1;
export const GAP = 8; // border thickness (was 4)

// Column widths (all ×2 from v1)
const LW = 300, HW = 52, CW = 528, RW = 300;
// Row heights (all ×2 from v1)
const TH = 220, HH = 52, MH = 288, BH = 220;
// Column X positions
const C1 = GAP, HL = C1+LW+GAP, C2 = HL+HW+GAP, HR = C2+CW+GAP, C3 = HR+HW+GAP;
// Row Y positions
const TITLE_H = 32; // space for banner (was 16)
const R1 = GAP+TITLE_H, HT = R1+TH+GAP, R2 = HT+HH+GAP, HB = R2+MH+GAP, R3 = HB+HH+GAP;

export const ROOMS = {
  isaac:    { x:C1, y:R1, w:LW, h:TH, type:'office',     door:{ side:'bottom', pos:0.5 } },
  billy:    { x:C2, y:R1, w:CW, h:TH, type:'office',     door:{ side:'bottom', pos:0.5 } },
  patrick:  { x:C3, y:R1, w:RW, h:TH, type:'office',     door:{ side:'bottom', pos:0.5 } },
  hallT:    { x:HL, y:HT, w:CW+HW*2+GAP*2, h:HH, type:'hallway' },
  hallL:    { x:HL, y:HT, w:HW, h:MH+HH*2+GAP*2, type:'hallway' },
  hallR:    { x:HR, y:HT, w:HW, h:MH+HH*2+GAP*2, type:'hallway' },
  hallB:    { x:HL, y:HB, w:CW+HW*2+GAP*2, h:HH, type:'hallway' },
  marcos:   { x:C1, y:R2, w:LW, h:MH, type:'office',     door:{ side:'right',  pos:0.4 } },
  board:    { x:C2, y:R2, w:CW, h:MH, type:'boardroom',  door:{ side:'left',   pos:0.4 } },
  sandra:   { x:C3, y:R2, w:RW, h:MH, type:'office',     door:{ side:'left',   pos:0.4 } },
  charlie:  { x:C1, y:R3, w:LW, h:BH, type:'office',     door:{ side:'right',  pos:0.6 } },
  breakRm:  { x:C2, y:R3, w:240, h:BH, type:'breakroom',  door:{ side:'top',    pos:0.3 } },
  wc1:      { x:C2+240+GAP, y:R3, w:132, h:BH, type:'wc',  door:{ side:'left',   pos:0.5 } },
  wc2:      { x:C2+240+GAP+132+GAP, y:R3, w:128, h:BH, type:'wc', door:{ side:'right', pos:0.5 } },
  wendy:    { x:C3, y:R3, w:RW, h:BH, type:'office',     door:{ side:'left',   pos:0.7 } },
};

export const AGENTS = {
  billy:   { name:'BILLY',   role:'CEO',               hair:'hairGray',   shirt:'shirtWhite', status:'working' },
  isaac:   { name:'ISAAC',   role:'DEVELOPMENT',       hair:'hairBrown',  shirt:'shirtBlue',  status:'working' },
  patrick: { name:'PATRICK', role:'CFO',               hair:'hairBlack',  shirt:'shirtGreen', status:'working' },
  marcos:  { name:'MARCOS',  role:'LAWYER',            hair:'hairBlack',  shirt:'shirtBlue',  status:'idle' },
  sandra:  { name:'SANDRA',  role:'LINE PRODUCER',     hair:'hairRed',    shirt:'shirtGreen', status:'working' },
  charlie: { name:'CHARLIE', role:'DESIGNER',          hair:'hairBlonde', shirt:'shirtOrange',status:'idle' },
  wendy:   { name:'WENDY',   role:'PERFORMANCE COACH', hair:'hairBrown',  shirt:'shirtPurple',status:'meeting' },
};
