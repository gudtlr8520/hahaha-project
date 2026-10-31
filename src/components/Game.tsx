"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, ArrowDown, ArrowLeft, ArrowRight, AudioLines, BookOpen, Check, ChevronRight, Cross, DoorOpen, Flashlight, Heart, KeyRound, Map, Menu, Radio, RotateCcw, Save, Settings2, Shield, Skull, Volume2, VolumeX, X } from "lucide-react";
import PixelScene from "./PixelScene";
import { choose, ENDINGS, heal, initialRun, ITEMS, STORY, type Item, type Run } from "@/lib/story";
import { decodeSave, STORAGE_KEY, type SaveData } from "@/lib/storage";

type Modal = "journal" | "endings" | "settings" | "save" | "restart" | "inventory" | null;
const itemIcons = { flashlight: Flashlight, radio: Radio, key: KeyRound, bandage: Cross, map: Map };
const chapters = ["문밖의 누군가", "내려가는 길", "남겨진 사람들", "거짓말의 출구", "새벽의 끝"];

export default function Game() {
  const [run, setRun] = useState<Run>(initialRun);
  const [manual, setManual] = useState<Run | null>(null);
  const [endings, setEndings] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ sound: false, effects: true });
  const [modal, setModal] = useState<Modal>(null);
  const [selectedItem, setSelectedItem] = useState<Item>("flashlight");
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const sound = useRef<AudioContext | null>(null);
  const clickLock = useRef(false);
  const scene = STORY[run.node];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = decodeSave(raw);
      if (data) { setRun(data.run); setManual(data.manual); setEndings(data.endings); setSettings({ ...data.settings, sound: false }); }
      else if(raw) setNotice("저장 기록을 읽을 수 없어 새 이야기를 시작합니다.");
    } catch { setNotice("이 브라우저에서 저장소를 사용할 수 없습니다. 진행은 현재 화면에서만 유지됩니다."); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const unlocked = scene.ending && !endings.includes(scene.id) ? [...endings, scene.id] : endings;
    if (unlocked !== endings) setEndings(unlocked);
    const data: SaveData = { version: 1, run, manual, endings: unlocked, savedAt: new Date().toISOString(), settings };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); setSaved(true); }
    catch { setSaved(false); setNotice("저장 공간에 접근할 수 없습니다. 브라우저 저장 설정을 확인해 주세요."); }
  }, [run, manual, endings, settings, ready, scene]);

  useEffect(() => {
    if (modal) { dialog.current?.showModal(); closeButton.current?.focus(); }
    else dialog.current?.close();
  }, [modal]);
  useEffect(() => { if(!notice) return; const timer = setTimeout(() => setNotice(""), 5000); return () => clearTimeout(timer); }, [notice]);

  // Sound starts only after an explicit click and never requires a downloaded asset.
  const enableAudio = useCallback(async () => {
    if (settings.sound) { if(sound.current) await sound.current.close(); sound.current = null; setSettings(s => ({...s,sound:false})); return; }
    try {
      const audio = new AudioContext();
      await audio.resume();
      const gain = audio.createGain(); gain.gain.value = .018; gain.connect(audio.destination);
      [55, 82.4, 110.3].forEach((frequency, i) => { const oscillator = audio.createOscillator(); oscillator.type = i === 0 ? "sine" : "triangle"; oscillator.frequency.value = frequency; oscillator.connect(gain); oscillator.start(); });
      sound.current = audio; setSettings(s => ({ ...s, sound: true }));
    } catch { setNotice("이 브라우저에서는 소리를 재생할 수 없습니다."); }
  }, [settings.sound]);
  useEffect(() => {
    const pause = () => { if (sound.current) { if(document.hidden) void sound.current.suspend(); else void sound.current.resume(); } };
    document.addEventListener("visibilitychange", pause);
    return () => { document.removeEventListener("visibilitychange", pause); };
  }, []);
  useEffect(() => () => { void sound.current?.close(); }, []);

  const makeChoice = useCallback((index: number) => {
    if (!ready || modal || clickLock.current) return;
    clickLock.current = true;
    setRun(current => choose(current, index));
    window.setTimeout(() => { clickLock.current = false; }, 220);
  }, [ready, modal]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || modal) return;
      if ((event.target as HTMLElement)?.matches("input, textarea, select, button, a")) return;
      const number = Number(event.key);
      if (number >= 1 && number <= 3) { event.preventDefault(); makeChoice(number - 1); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [makeChoice, modal]);

  const restart = () => { setRun(initialRun()); setModal(null); setNotice("새로운 밤이 시작됩니다. 발견한 엔딩과 수동 저장은 유지됩니다."); };
  const elapsed = run.history.length * 2;
  const time = `03:${String(Math.min(17 + elapsed, 59)).padStart(2,"0")}`;
  const lastNote = [scene, ...run.history.slice().reverse().map(h => STORY[h.node])].find(n => n.note)?.note;
  const soundOn = settings.sound && !!sound.current;

  return <div className={`app ${settings.effects ? "with-effects" : ""}`}>
    <header className="header">
      <a className="brand" href="#main" aria-label="잔향 1408 본문으로"><span className="brand-symbol"><DoorOpen size={22}/></span><strong>잔향<span className="brand-colon">:</span><span className="brand-no">1408</span></strong><span className="brand-en">THE LAST RESONANCE</span></a>
      <nav aria-label="게임 메뉴" className={menuOpen ? "nav open" : "nav"}>
        <button onClick={() => {setModal("journal");setMenuOpen(false);}}><BookOpen size={15}/>생존 기록</button>
        <button onClick={() => {setModal("endings");setMenuOpen(false);}}><DoorOpen size={15}/>엔딩 수집<span className="nav-count">{endings.length}<span>/{ENDINGS.length}</span></span></button>
        <span className="nav-divider"/>
        <button className="icon-button" aria-label={soundOn ? "소리 끄기" : "소리 켜기"} onClick={enableAudio}>{soundOn ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
        <button className="icon-button" aria-label="설정" onClick={() => setModal("settings")}><Settings2 size={18}/></button>
      </nav>
      <button className="mobile-menu icon-button" aria-label="메뉴 열기" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><Menu size={21}/></button>
    </header>

    <main id="main" className="main">
      <section className="intro">
        <div><div className="eyebrow"><span/>INTERACTIVE SURVIVAL NOVEL</div><h1>이 밤의 끝에,<br className="mobile-break"/> <span>당신은 살아 있을까.</span></h1><p>닫힌 문 너머의 목소리. 멈춰 버린 도시. 그리고, 당신의 선택.</p></div>
        <div className="incident"><span className="incident-dot"/><div><span>비상사태 발생</span><strong>DAY 01 <i>/</i> {time}</strong></div><div className="signal-bars"><i/><i/><i/><i/><i/></div></div>
      </section>

      <div className="game-layout">
        <section className="game-panel" aria-label="이야기와 선택지">
          <div className="scene-bar"><span><span className="live-dot"/>CHAPTER {String(scene.chapter).padStart(2,"0")}<i>/</i><b>{chapters[scene.chapter-1]}</b></span><span className={`save-indicator ${saved ? "" : "unsaved"}`}>{saved ? <Check size={12}/> : <Activity size={12}/>}<span>{ready ? saved ? "자동 저장됨" : "저장 불가" : "기록 불러오는 중"}</span></span></div>
          <div className={`scene-image ${scene.ending?.kind === "death" ? "is-death" : ""}`}>
            <PixelScene scene={scene.scene} ally={run.flags.includes("ally") && scene.id !== "endingAlone"} title={scene.title} node={scene.id}/>
            <div className="scene-location"><span className="location-square"/>{scene.location}</div>
            <div className="scene-live"><span/> CAM 14—08 <span className="rec">REC</span></div>
            <div className="scene-bottom"><span>RESIDENTIAL BLOCK · A</span><span>{scene.ending ? "SIGNAL LOST" : "NO SIGNAL"}<AudioLines size={11}/></span></div>
            {scene.ending && <div className="ending-overlay"><span>{scene.ending.kind === "escape" ? "YOU SURVIVED" : "SIGNAL LOST"}</span></div>}
            <div className="scanlines"/>
          </div>
          <div className="story-body" key={scene.id}>
            <div className="story-heading"><div className="speaker-avatar"><span className="pixel-person"/></div><div><span className="speaker-label">{scene.ending ? "이야기의 끝" : scene.speaker || "기록"}</span><h2>{scene.title}</h2></div><span className="story-page">{String(run.history.length + 1).padStart(2,"0")}<span> / LOG</span></span></div>
            <div className="narration" aria-live="polite" aria-atomic="true">{scene.text.map((p,i)=><p key={i} className={p.startsWith("“") ? "dialogue" : ""}>{p}</p>)}</div>
            {scene.ending ? <div className="ending-actions"><div className={`ending-badge ${scene.ending.kind}`}><DoorOpen size={15}/>{scene.ending.subtitle}</div><button className="primary-action" onClick={()=>setModal("restart")}><RotateCcw size={16}/>다른 선택으로 다시 시작<ArrowRight size={17}/></button><button className="text-button" onClick={()=>setModal("endings")}>발견한 엔딩 보기<ChevronRight size={14}/></button></div> : <div className="choices">
              <div className="choices-label"><span className="tiny-diamond"/>어떻게 하시겠습니까?<span>선택은 되돌릴 수 없습니다</span></div>
              {scene.choices.map((choice,i)=>{const locked=!!choice.requires&&!run.inventory.includes(choice.requires);return <button key={`${scene.id}-${i}`} className={`choice ${i===0 ? "first-choice" : ""}`} disabled={locked||!ready} onClick={()=>makeChoice(i)}><span className="choice-number">0{i+1}</span><span className="choice-copy"><strong>{choice.text}</strong><small>{locked ? `${ITEMS[choice.requires!].name} 필요` : choice.hint}</small></span>{locked ? <KeyRound size={16}/> : <ChevronRight size={18}/>}</button>;})}
            </div>}
          </div>
          <div className="game-bottom"><span><Shield size={12}/>당신의 선택이 다음 장면을 바꿉니다.</span><span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd>선택하기</span></div>
        </section>

        <aside className="sidebar" aria-label="생존자 정보">
          <section className="side-card survivor"><div className="card-label"><span>생존자 상태</span><Activity size={14}/></div><div className="survivor-profile"><div className="portrait"><span className="pixel-person"/></div><div><h3>1408호 거주자</h3><span><i/> {scene.ending ? scene.ending.kind === "escape" ? "탈출 성공" : "신호 소실" : "생존 중"}</span></div><span className="resident-id">#001</span></div><div className="stat"><div><span><Heart size={13}/>체력</span><strong>{run.health}<small> / 100</small></strong></div><div className="meter"><span style={{width:`${run.health}%`}}/></div></div><div className="stat nerve"><div><span><Activity size={13}/>침착함</span><strong>{run.nerve}<small> / 100</small></strong></div><div className="meter"><span style={{width:`${run.nerve}%`}}/></div></div><div className="noise"><span><AudioLines size={14}/>발생시킨 소음</span><span className="noise-bars" aria-label={`소음 ${run.noise} / 5`}>{[0,1,2,3,4].map(n=><i key={n} className={n<run.noise ? "active" : ""}/>)}</span></div></section>

          <section className="side-card location-card"><div className="card-label"><span>현재 위치</span><Map size={14}/></div><div className="floor-display"><div><strong>{scene.floor}</strong><span>{scene.floor === "RF" ? "ROOFTOP" : scene.floor === "OUT" ? "OUTSIDE" : "FLOOR"}</span></div><span className="building-mini">{Array.from({length: 6},(_,i)=><span key={i} className={i===Math.min(5,Math.floor((scene.chapter-1)*1.2)) ? "current" : ""}>{[0,1,2,3].map(n=><i key={n}/>)}</span>)}</span></div><p>{scene.location}</p><div className="journey">{chapters.map((name,i)=><div key={name} className={i+1===scene.chapter ? "active" : i+1<scene.chapter ? "done" : ""}><span>{i+1<scene.chapter ? <Check size={9}/> : i+1}</span><i/></div>)}</div><div className="journey-caption"><span>고립</span><span>탈출</span></div><div className="objective"><ArrowDown size={15}/><div><span>현재 목표</span><strong>{scene.ending ? "또 다른 가능성 발견하기" : scene.chapter<3 ? "아파트의 탈출구 찾기" : scene.floor === "18" || scene.floor === "RF" ? "옥상의 구조 신호 확인하기" : "동쪽 배수로에 도달하기"}</strong></div></div></section>

          <section className="side-card inventory-card"><div className="card-label"><span>소지품</span><span className="muted">{run.inventory.length} / 5</span></div><div className="inventory-slots">{Array.from({length:5},(_,i)=>{const item=run.inventory[i];const Icon=item?itemIcons[item]:null;return item&&Icon?<button key={i} aria-label={`${ITEMS[item].name} 확인`} title={ITEMS[item].name} onClick={()=>{setSelectedItem(item);setModal("inventory");}}><Icon size={22}/><span/></button>:<div key={i} className="empty-slot">+</div>;})}</div><p>물건에 당신의 생존이 달려 있을지도.</p></section>

          <section className="note-card"><div className="card-label"><span><BookOpen size={13}/>기억해 둘 것</span><span className="note-pin"/></div><p>“{lastNote || "빛이 없는 곳에서는 소리에 귀 기울일 것."}”</p><span className="note-footer">나에게 남기는 메모</span></section>
          <div className="side-actions"><button onClick={()=>setModal("save")}><Save size={14}/>저장 / 불러오기</button><button aria-label="새 게임" title="새 게임" onClick={()=>setModal("restart")}><RotateCcw size={15}/></button></div>
          {run.flags.includes("ally") && !scene.ending && <div className="companion"><span/>서윤이 함께하고 있습니다.</div>}
        </aside>
      </div>
      <footer className="footer"><span>잔향 : 1408<span className="footer-dot">·</span>이곳의 모든 선택에는 흔적이 남습니다.</span><span><span className="footer-status"/> LOCAL SAVE ONLY <i>© 2026 RESONANCE</i></span></footer>
    </main>

    <dialog ref={dialog} className="modal" onCancel={()=>setModal(null)} onClick={e=>{if(e.target===dialog.current){const b=dialog.current.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)setModal(null);}}} aria-labelledby="modal-title">
      <div className="modal-header"><span className="eyebrow">RESIDENT ARCHIVE</span><button ref={closeButton} className="icon-button" onClick={()=>setModal(null)} aria-label="닫기"><X size={21}/></button></div>
      <h2 id="modal-title">{modal==="journal"?"생존 기록":modal==="endings"?"밤이 끝나는 방법":modal==="settings"?"환경 설정":modal==="save"?"이 밤을 기억하기":modal==="restart"?"다시, 3시 17분":modal==="inventory"?ITEMS[selectedItem].name:""}</h2>
      {modal==="journal"&&<><p className="modal-description">당신이 지나온 장소와 남긴 선택입니다.</p><div className="journal-list">{run.history.length===0?<div className="empty-state"><BookOpen size={28}/><p>아직 첫 번째 선택을 기다리고 있습니다.</p></div>:run.history.map((h,i)=><div className="journal-entry" key={i}><span>{String(i+1).padStart(2,"0")}</span><div><small>{STORY[h.node].location}</small><strong>{STORY[h.node].title}</strong><p>{h.choice}</p></div></div>)}</div></>}
      {modal==="endings"&&<><p className="modal-description">발견한 결말 {endings.length} / {ENDINGS.length}. 아직 만나지 않은 결말은 비밀로 남겨 둡니다.</p><div className="ending-grid">{ENDINGS.map((e,i)=>{const found=endings.includes(e.id);return <div key={e.id} className={`ending-tile ${found?"found":""}`}>{found?(e.ending!.kind==="escape"?<DoorOpen size={21}/>:<Skull size={21}/>):<span className="locked-ending">?</span>}<small>ENDING {String(i+1).padStart(2,"0")}</small><strong>{found?e.title:"미발견"}</strong><span>{found?e.ending!.kind==="escape"?"탈출":"사망":"선택 끝에서 만나게 될 이야기"}</span></div>;})}</div></>}
      {modal==="settings"&&<><p className="modal-description">이야기에 집중할 수 있는 환경을 선택하세요.</p><button className="setting-row" aria-pressed={soundOn} onClick={enableAudio}><span><strong>배경음</strong><small>낮게 울리는 아파트의 잔향</small></span><span className={`toggle ${soundOn?"on":""}`}><i/></span></button><button className="setting-row" aria-pressed={settings.effects} onClick={()=>setSettings(s=>({...s,effects:!s.effects}))}><span><strong>화면 효과</strong><small>CRT 스캔라인과 장면 전환 효과</small></span><span className={`toggle ${settings.effects?"on":""}`}><i/></span></button><div className="settings-help"><strong>플레이 방법</strong><p>선택지를 클릭하거나 숫자 1, 2, 3 키로 진행합니다. 소지품을 누르면 설명을 확인하고 붕대를 사용할 수 있습니다. 매 선택은 자동으로 저장됩니다.</p><p>심리적 공포, 괴생명체, 죽음에 관한 묘사가 포함되어 있습니다.</p><p>기록은 이 브라우저에만 보관됩니다. 시크릿 모드 종료 또는 브라우저 데이터 삭제 시 사라집니다. 다른 기기와 동기화되지 않습니다.</p></div></>}
      {modal==="save"&&<><p className="modal-description">자동 저장과 별개로, 돌아오고 싶은 순간을 하나 남길 수 있습니다.</p><div className="save-slot"><span className="eyebrow">MANUAL SAVE · 01</span><strong>{manual?STORY[manual.node].title:"아직 남겨 둔 순간이 없습니다"}</strong><span>{manual?`${STORY[manual.node].location} · 선택 ${manual.history.length}회`:"현재 장면을 저장해 보세요."}</span></div><button className="primary-action" onClick={()=>{setManual(structuredClone(run));setNotice(saved?"현재 장면을 수동 저장했습니다.":"수동 기록을 만들었습니다. 브라우저 저장 여부를 확인하세요.");setModal(null);}}><Save size={16}/>{manual?"현재 장면으로 덮어쓰기":"현재 장면 저장"}</button><button className="secondary-action" disabled={!manual} onClick={()=>{if(manual){setRun(structuredClone(manual));setModal(null);setNotice("저장한 장면으로 돌아왔습니다.");}}}><RotateCcw size={16}/>저장한 장면 불러오기</button></>}
      {modal==="restart"&&<><p className="modal-description">진행 중인 이야기를 처음부터 시작합니다. 발견한 엔딩과 수동 저장은 유지됩니다.</p><div className="restart-quote">“이번에는 다른 문을 열 수 있을까.”</div><button className="primary-action" onClick={restart}><RotateCcw size={16}/>새로운 이야기 시작</button><button className="secondary-action" onClick={()=>setModal(null)}><ArrowLeft size={16}/>지금의 이야기에 머무르기</button></>}
      {modal==="inventory"&&<><div className="item-detail">{(() => {const Icon=itemIcons[selectedItem];return <Icon size={45}/>;})()}<p>{ITEMS[selectedItem].description}</p></div>{selectedItem==="bandage"?<button className="primary-action" disabled={run.health===100||!!scene.ending||!run.inventory.includes("bandage")} onClick={()=>{setRun(heal);setModal(null);setNotice("붕대를 사용했습니다. 체력을 회복했습니다.");}}><Cross size={16}/>{run.health===100?"이미 체력이 가득합니다":"붕대 사용 · 체력 +25"}</button>:<p className="item-help">해당 물건이 필요한 선택지에서 사용할 수 있습니다.</p>}</>}
    </dialog>
    {notice&&<div className="toast" role="status"><Check size={15}/>{notice}</div>}
  </div>;
}
