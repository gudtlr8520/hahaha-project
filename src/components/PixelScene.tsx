"use client";
import { useEffect, useRef } from "react";
import type { Scene } from "@/lib/story";

// Original artwork, drawn on a deliberately low-resolution canvas.
// No downloaded artwork, image services, or remote assets are used.
export function paintScene(canvas: HTMLCanvasElement, scene: Scene, ally = false, node = "") {
  const c = canvas.getContext("2d");
  if (!c) return;
  c.imageSmoothingEnabled = false;
  let seed = 1408;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const rect = (x: number, y: number, w: number, h: number, color: string) => { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const poly = (p: number[][], color: string) => { c.fillStyle = color; c.beginPath(); p.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); };
  const line = (x: number, y: number, xx: number, yy: number, color: string, w = 1) => { c.strokeStyle = color; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.lineTo(xx, yy); c.stroke(); };
  const glow = (x: number, y: number, radius: number, color: string) => { const g = c.createRadialGradient(x, y, 1, x, y, radius); g.addColorStop(0, color); g.addColorStop(1, "transparent"); c.fillStyle = g; c.fillRect(x - radius, y - radius, radius * 2, radius * 2); };
  const label = (text: string, x: number, y: number, color = "#9b9b82", size = 7) => { c.font = `${size}px monospace`; c.fillStyle = color; c.fillText(text, x, y); };
  const person = (x: number, y: number, coat = "#667e75", facing = false) => {
    poly([[x-12,y+4],[x+11,y+4],[x+25,y+10],[x-5,y+12]],"#081111");
    rect(x-5,y-15,4,16,"#101d21"); rect(x+2,y-15,4,16,"#122127"); rect(x-7,y,6,3,"#090f13"); rect(x+2,y,7,3,"#090f13");
    rect(x-8,y-37,16,24,coat); rect(x-10,y-32,4,18,coat); rect(x+7,y-32,4,18,coat); rect(x-10,y-14,4,5,"#b5a28b"); rect(x+7,y-14,4,5,"#b5a28b");
    rect(x-5,y-48,11,13,"#aa9a84"); rect(x-7,y-50,14,7,"#172528"); rect(x-6,y-46,3,9,"#172528"); rect(x-4,y-52,10,4,"#1e2c2c");
    rect(x-4,y-36,8,3,"#243a36"); rect(x,y-31,6,12,"#263e39"); rect(x+5,y-29,2,8,"#8d9986");
    if (facing) { rect(x+3,y-43,2,2,"#22282a"); rect(x+7,y-18,9,4,"#101b1e"); rect(x+15,y-18,2,4,"#d8d6a9"); }
  };
  const door = (x: number, y: number, w: number, h: number, number: string, lit = false) => {
    rect(x-4,y-4,w+8,h+5,"#101c20"); rect(x-2,y-2,w+4,h+3,"#344341"); rect(x,y,w,h,"#162726"); rect(x+4,y+4,w-8,h-5,"#233530");
    rect(x+7,y+6,w-14,h-9,"#1c2b29"); rect(x+7,y+6,1,h-9,"#31413a"); rect(x+w-10,y+h*.56,3,3,"#9b8e66");
    rect(x+w/2-12,y+15,24,10,"#10201e"); label(number,x+w/2-10,y+22,"#9c9974"); rect(x+w/2,y+35,2,2,"#64735f");
    if (lit) { rect(x+2,y+h-1,w-4,2,"#f6b467"); poly([[x+2,y+h],[x+w-2,y+h],[x+w+54,y+h+47],[x-55,y+h+47]],"#b6803c26"); glow(x+w/2,y+h,60,"#bd7f3b37"); }
  };
  const city = (sunrise = false) => {
    rect(0,0,640,300,sunrise ? "#314749" : "#0e1b22");
    if (sunrise) { glow(460,95,280,"#d7b27e7a"); rect(440,80,20,20,"#d6b17c"); }
    for(let i=0;i<20;i++) { const x=i*36-12; const h=25+random()*70; rect(x,135-h,28,h,"#1c3034"); for(let yy=140-h; yy<128; yy+=9) for(let xx=x+4;xx<x+26;xx+=7) if(random()>.58)rect(xx,yy,2,3,sunrise?"#727764":"#446353"); }
    for(let i=0;i<10;i++) { const x=i*74; const h=30+random()*80; rect(x,180-h,54,h,"#14262c"); rect(x+7,175-h,38,3,"#273c3c"); for(let yy=187-h;yy<175;yy+=12)for(let xx=x+7;xx<x+49;xx+=10)if(random()>.5)rect(xx,yy,4,5,"#384a41"); }
  };
  c.clearRect(0,0,640,300);
  rect(0,0,640,300,"#101c20");
  if (scene === "room" || scene === "neighbor") {
    rect(0,0,640,180,"#20312f"); rect(0,112,640,68,"#192a28"); rect(0,110,640,3,"#465344");
    poly([[0,180],[640,180],[640,300],[0,300]],"#263532");
    for(let y=192;y<300;y+=17)line(0,y,640,y,"#162725");
    for(let row=0;row<7;row++)for(let x=-100;x<640;x+=99)line(x+(row%2)*47,180+row*17,x+(row%2)*47,197+row*17,"#172724");
    rect(0,173,640,7,"#0d1c1d"); rect(0,171,640,2,"#3b4940");
    // The window: distant apartment towers, rain and green emergency light.
    rect(61,30,135,112,"#0b171b"); rect(66,35,125,101,"#344746"); rect(71,39,115,94,"#0f232b");
    for(let b=0;b<5;b++){const x=75+b*24,h=25+random()*38;rect(x,125-h,20,h,"#1c3238");for(let y=130-h;y<120;y+=9)for(let xx=x+4;xx<x+18;xx+=7)if(random()>.4)rect(xx,y,2,3,"#5d7560");}
    for(let i=0;i<22;i++){const x=72+random()*112,y=41+random()*82;line(x,y,x-2,y+6,"#4b666044");}
    rect(125,37,5,98,"#43574f"); rect(70,83,115,4,"#43574f");rect(60,137,138,6,"#4c5c4e");
    poly([[65,143],[192,143],[320,255],[53,255]],"#68987b0d");
    rect(39,25,17,129,"#182528");rect(44,27,5,123,"#263532");rect(200,25,20,128,"#172626");rect(203,30,6,118,"#2d3c33");
    // Skirting, desk, paper, lamp, books and abandoned chair.
    rect(60,177,119,8,"#0f2021");rect(65,183,6,36,"#102120");rect(164,183,6,35,"#102120");rect(60,173,119,5,"#65705a");
    rect(74,165,25,8,"#2e443d");rect(75,164,21,2,"#6f765c");rect(105,169,19,3,"#b3b092");rect(109,166,22,3,"#7b8970");
    rect(145,151,3,22,"#71806a");poly([[133,154],[159,154],[151,140],[140,140]],"#8b9673");glow(145,165,45,"#b8bc5520");rect(140,172,16,2,"#697961");
    rect(110,191,27,6,"#344b40");rect(111,180,3,15,"#4b5e48");rect(134,180,3,18,"#4b5e48");rect(111,178,26,4,"#3e5447");rect(113,197,3,20,"#172a25");rect(131,197,3,20,"#172a25");
    // Corridor opening and the apartment door.
    rect(376,19,195,162,"#0a171c");rect(374,17,5,164,"#405045");rect(571,17,6,164,"#405045");rect(375,16,201,5,"#35483c");
    rect(383,24,182,118,"#182622"); poly([[383,142],[564,142],[571,181],[376,181]],"#30382a");
    door(442,46,66,107,"1408",true);rect(447,42,55,2,"#6b6343");
    rect(465,28,19,4,"#e1b270");glow(475,47,83,"#c38a4230");
    // Wall meter, poster and coat hooks.
    rect(320,70,25,34,"#122322");rect(323,73,19,24,"#3b4b3b");rect(326,77,13,6,"#1b2e2b");rect(327,79,3,2,"#a0ae7e");rect(326,91,5,2,"#a16c46");
    rect(255,61,28,39,"#102422");rect(259,65,20,29,"#636e54");rect(262,68,14,13,"#344b40");rect(264,83,11,2,"#9b9970");rect(263,88,13,1,"#8e8c65");
    line(290,30,290,155,"#2d4034",2);line(290,30,610,30,"#2d4034",2);
    // Foreground couch and moving boxes.
    rect(27,240,102,44,"#101e21");rect(32,234,91,35,"#2c3d35");rect(37,238,35,26,"#33463a");rect(77,238,38,26,"#2c4035");rect(23,255,15,34,"#1c302a");rect(117,255,16,34,"#1c302a");rect(39,268,77,13,"#20332e");
    rect(542,198,44,32,"#454733");rect(547,201,34,2,"#65664a");rect(561,199,7,30,"#68654a");rect(565,179,37,24,"#363c2d");rect(580,180,5,21,"#676247");
    rect(511,157,12,20,"#1f302b");poly([[508,158],[525,158],[522,176],[512,176]],"#414a34");for(let i=0;i<8;i++)line(516,158,505+random()*26,132+random()*20,"#466045",2);
    // Character with a cone of light.
    poly([[342,205],[449,166],[473,239]],"#d7cb780c");glow(372,210,74,"#d5c6870b");person(322,225,"#657b6e",true);
    if (ally || scene === "neighbor") person(365,201,"#9b8950");
    rect(0,0,640,15,"#09161b");rect(0,289,640,11,"#091619");rect(0,0,15,300,"#09161b");rect(622,0,18,300,"#09161b");
  } else if (scene === "corridor") {
    poly([[0,0],[640,0],[439,72],[207,72]],"#172827");poly([[0,0],[207,72],[207,196],[0,300]],"#263a33");poly([[640,0],[439,72],[439,196],[640,300]],"#1d302d");rect(207,72,232,124,"#122323");
    poly([[207,196],[439,196],[640,300],[0,300]],"#2a3b33");
    for(let y=205;y<300;y+=15)line(0,y,640,y,"#172a26");for(let x=-300;x<1000;x+=85)line(322,158,x,300,"#1b2d28");
    door(243,95,43,101,"1406");door(353,95,43,101,"1408",true);
    poly([[35,46],[107,68],[107,235],[35,272]],"#101f20");poly([[42,54],[99,72],[99,234],[42,261]],"#314138");line(48,60,48,253,"#475044");rect(81,151,4,4,"#a89864");
    poly([[532,66],[604,40],[604,273],[532,236]],"#0c1d20");poly([[539,72],[597,51],[597,261],[539,233]],"#243a31");rect(550,153,3,4,"#7d8c60");
    line(0,130,207,133,"#69705b",2);line(439,133,640,130,"#4c6350",2);line(0,140,207,137,"#0e2321",2);line(439,137,640,140,"#102522",2);
    rect(302,77,39,12,"#264638");label("EXIT →",307,86,"#a6c499",7);glow(322,90,55,"#75bc7a19");
    rect(280,27,82,5,"#829480");glow(322,45,105,"#829c6825");rect(287,30,68,2,"#b6bd8d");
    rect(461,121,12,20,"#764b35");rect(464,125,6,6,"#a97143");
    person(287,254,"#697c6c",true);if(ally)person(256,240,"#9b8950");
    poly([[313,239],[465,181],[482,270]],"#d2cc8c0a");
    for(let i=0;i<13;i++)rect(180+random()*280,240+random()*45,2+random()*5,1,"#6b7152");
  } else if (scene === "stairs") {
    rect(0,0,640,300,"#1c302e");rect(0,120,640,96,"#152926");line(0,119,640,119,"#4d6050",2);
    poly([[180,70],[390,70],[545,250],[335,250]],"#152522");
    for(let i=0;i<12;i++){const y=75+i*15,x=180+i*13;rect(x,y,210,8,"#465449");rect(x,y+8,210,7,"#24392e");rect(x,y,210,1,"#73806a");}
    for(let i=0;i<8;i++){line(181+i*20,80+i*23,181+i*20,28+i*23,"#0d2020",3);line(391+i*20,80+i*23,391+i*20,28+i*23,"#0d2020",3);}
    line(179,28,340,211,"#798370",3);line(390,28,551,211,"#657665",3);
    rect(54,68,60,30,"#263f34");label("12 F",61,89,"#9aa98b",19);rect(54,106,47,13,"#254a36");label("↓ EXIT",60,115,"#a6bb8a");
    rect(65,30,37,4,"#b5bf97");glow(82,36,100,"#87b18526");
    poly([[0,221],[180,195],[300,300],[0,300]],"#263c32");for(let i=0;i<18;i++)rect(random()*200,250+random()*30,10+random()*20,1,"#69817a44");
    person(128,244,"#697c6c",true);if(ally)person(93,250,"#9b8950");
    rect(582,0,6,300,"#344a3d");line(590,0,590,300,"#101e20",3);
  } else if (scene === "basement") {
    rect(0,0,640,300,"#112b2a");rect(0,188,640,112,"#112323");
    for(let x=20;x<640;x+=100){rect(x,0,12,190,"#344c3b");rect(x+3,0,3,190,"#59715a");rect(x-3,58,18,6,"#4b624a");rect(x-3,153,18,6,"#4b624a");}
    rect(0,31,640,16,"#364d3a");rect(0,34,640,3,"#637a55");rect(0,85,640,8,"#2a4232");
    rect(420,113,96,88,"#071a1e");rect(414,108,108,5,"#4a6752");for(let x=424;x<516;x+=9)rect(x,113,3,88,"#314c3b");
    rect(75,121,70,79,"#3a5140");rect(80,125,60,68,"#2d4437");rect(89,135,42,24,"#122f2b");rect(95,140,4,4,"#aacc7e");rect(104,140,4,4,"#dd8854");rect(89,169,31,5,"#5f7052");
    rect(322,72,9,5,"#9cc484");glow(327,94,130,"#92bd541c");label("EAST →",418,101,"#95ae83",10);
    for(let i=0;i<100;i++)rect(random()*640,212+random()*88,5+random()*32,1,"#53796a25");
    person(288,241,"#697c6c",true);if(ally)person(253,251,"#9b8950");
    poly([[304,220],[427,170],[431,261]],"#d7d17e0c");rect(0,276,640,24,"#091e22bb");
  } else if (scene === "roof" || scene === "street") {
    city(scene === "street");
    if(scene === "roof") {
      poly([[0,238],[270,173],[640,217],[640,300],[0,300]],"#2b3b35");rect(0,230,640,7,"#53604d");rect(0,237,640,9,"#182b2b");
      rect(40,150,126,79,"#233b32");rect(36,145,133,7,"#5b6850");door(79,158,44,72,"RF");
      for(let x=250;x<620;x+=42){rect(x,182,3,43,"#475f4b");}line(250,183,635,183,"#64765b",3);
      poly([[398,0],[476,0],[605,269],[263,269]],"#cfbd620c");glow(438,22,110,"#c8b56419");
      poly([[402,37],[421,27],[453,27],[475,37],[454,47],[421,47]],"#75816b");rect(434,29,9,16,"#162b29");rect(437,31,3,12,"#bfa56a");
      person(308,267,"#697c6c",true);if(ally)person(281,270,"#9b8950");
    } else {
      rect(0,182,640,118,"#263c38");poly([[0,208],[640,182],[640,217],[0,260]],"#526d62");poly([[0,226],[640,200],[640,218],[0,269]],"#728278");
      for(let i=0;i<75;i++)rect(random()*640,219+random()*72,1,2+random()*4,"#4e6650");
      for(let i=0;i<30;i++)rect(random()*640,200+random()*35,10+random()*30,1,"#b8ad7b22");
      person(332,260,"#697c6c",true);if(ally)person(361,260,"#9b8950");
      rect(72,80,3,147,"#1c3232");rect(72,80,39,3,"#1c3232");rect(99,83,13,4,"#aaaf7e");glow(105,90,50,"#d2d99014");
      for(let x=450;x<630;x+=30){rect(x,188,2,40,"#273e36");}line(450,189,630,189,"#344d3f",2);
    }
  } else {
    rect(0,0,640,300,"#101b1e");poly([[160,0],[480,0],[391,231],[243,231]],"#1f2e2a");
    door(285,70,70,161,"1408",true);glow(320,220,180,"#993f2d27");
    for(let i=0;i<30;i++) { const x=random()*640,y=random()*300;rect(x,y,random()*20,1,"#99604415"); }
    poly([[309,230],[333,230],[410,300],[223,300]],"#060f15");
  }
  // Story-specific silhouettes: the thing in the hallway never quite fits a human body.
  if (["peephole", "openDoor", "endingVoice"].includes(node)) {
    const x = scene === "corridor" ? 416 : 380;
    poly([[x-5,74],[x+5,70],[x+9,85],[x+3,97],[x+8,116],[x+6,165],[x+11,204],[x+5,205],[x,166],[x-4,202],[x-9,202],[x-6,157],[x-11,118],[x-8,101],[x-12,90]],"#061216");
    poly([[x-8,112],[x-16,142],[x-23,184],[x-26,190],[x-25,176],[x-19,136],[x-13,110]],"#091619");
    poly([[x+7,110],[x+15,139],[x+17,180],[x+13,183],[x+10,144],[x+3,118]],"#091619");
    rect(x-5,85,2,1,"#ac9b70");rect(x+1,83,2,1,"#ac9b70");
  }
  if (node === "pursuit") {
    poly([[465,300],[457,248],[438,216],[435,173],[428,150],[431,143],[437,151],[441,167],[444,147],[448,145],[450,167],[455,148],[459,149],[458,172],[464,158],[467,161],[460,183],[458,221],[478,247],[491,300]],"#60715a");
    line(445,186,450,220,"#1f3b30",2);line(450,221,469,253,"#1f3b30",2);
  }
  if (["dinner", "endingDinner"].includes(node)) {
    for(const x of [260,302,344,386]) { person(x,195,"#3b4a3c"); rect(x-5,147,11,13,"#1b2b29"); }
    rect(237,195,175,9,"#697254");rect(245,204,7,39,"#293b2f");rect(397,204,7,39,"#293b2f");
    for(const x of [260,302,344,386]){rect(x-8,193,17,3,"#c0bb8f");rect(x-4,191,8,2,"#a19c76");}
  }
  // Fixed-seed dithering keeps the texture stable, including on hydration.
  for(let i=0;i<2600;i++){const x=random()*640,y=random()*300;rect(x,y,1,1,random()>.5?"#a8b78a08":"#000c181c");}
  const vignette=c.createRadialGradient(320,150,85,320,150,355);vignette.addColorStop(0,"transparent");vignette.addColorStop(1,"#040d19ad");c.fillStyle=vignette;c.fillRect(0,0,640,300);
}

export default function PixelScene({ scene, ally, title, node }: { scene: Scene; ally: boolean; title: string; node: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if(ref.current) paintScene(ref.current, scene, ally, node); }, [scene, ally, node]);
  return <canvas ref={ref} width={640} height={300} role="img" aria-label={`${title} — 어둠 속 아파트의 도트 그래픽 장면`} />;
}
