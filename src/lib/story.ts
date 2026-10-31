export type Scene = "room" | "corridor" | "stairs" | "neighbor" | "basement" | "roof" | "street" | "death";
export type Item = "flashlight" | "radio" | "key" | "bandage" | "map";
export type Choice = { text: string; hint: string; to: string; requires?: Item; flag?: string; add?: Item; remove?: Item; health?: number; nerve?: number; noise?: number; resolve?: { flag: string; yes: string; no: string } };
export type StoryNode = { id: string; chapter: number; floor: string; location: string; title: string; scene: Scene; speaker?: string; text: string[]; choices: Choice[]; note?: string; ending?: { id: string; kind: "escape" | "death"; title: string; subtitle: string } };
export type Run = { node: string; health: number; nerve: number; noise: number; inventory: Item[]; flags: string[]; history: { node: string; choice: string }[] };
export const ITEMS: Record<Item, { name: string; description: string }> = {
  flashlight: { name: "손전등", description: "빛은 길을 보여준다. 때로는 당신의 위치도." },
  radio: { name: "휴대용 라디오", description: "89.1 MHz. 잡음 사이에 누군가 있다." },
  key: { name: "관리실 열쇠", description: "B1 기계실. 닳아 없어진 이름표가 달려 있다." },
  bandage: { name: "붕대", description: "인벤토리에서 사용하면 체력을 25 회복한다." },
  map: { name: "대피 안내도", description: "지하 배수로는 동쪽 하천으로 이어진다." },
};
export const initialRun = (): Run => ({ node: "awakening", health: 100, nerve: 82, noise: 0, inventory: ["flashlight"], flags: [], history: [] });
const raw: StoryNode[] = [
  { id: "awakening", chapter: 1, floor: "14", location: "1408호 · 거실", title: "문밖의 누군가", scene: "room", speaker: "나", text: ["새벽 3시 17분. 비상방송이 끊긴 지 세 시간째다.", "창밖의 도시는 검게 가라앉았다. 멀리서 울리던 사이렌마저 멎었다. 그때, 현관문 너머로 세 번의 노크가 들린다.", "“안에 계세요? …아직 사람이면, 대답해 주세요.”"], note: "이 아파트에는 나 말고도 누군가 있다.", choices: [
    { text: "문구멍으로 밖을 살펴본다", hint: "먼저 상대를 확인한다", to: "peephole", nerve: -3 },
    { text: "숨을 죽이고 방송을 다시 듣는다", hint: "작은 소리도 단서가 된다", to: "broadcast", add: "radio" },
    { text: "문을 열고 누구인지 묻는다", hint: "낯선 목소리에 응답한다", to: "openDoor", noise: 1, health: -15 },
  ] },
  { id: "peephole", chapter: 1, floor: "14", location: "1408호 · 현관", title: "세 번의 노크", scene: "corridor", text: ["비상등 아래, 노란 우비를 입은 여자가 서 있다. 1406호의 간호사, 서윤이다. 여자는 입을 가린 채 손가락 세 개를 들어 보인다.", "그런데 목소리는 여자의 뒤편에서 들린다. 복도 끝에 선 긴 그림자는, 머리가 천장에 닿아 있다.", "서윤이 문 밑으로 쪽지를 밀어 넣는다. ‘목소리를 따라가지 마세요.’"], note: "그것은 사람의 목소리를 흉내 낸다. 세 번의 노크는 생존자의 신호다.", choices: [
    { text: "조용히 서윤을 안으로 들인다", hint: "혼자보다는 둘이 낫다", to: "ally", flag: "ally", nerve: 8 },
    { text: "그림자가 사라질 때까지 기다린다", hint: "혼자 움직인다", to: "packing", flag: "warning" },
  ] },
  { id: "broadcast", chapter: 1, floor: "14", location: "1408호 · 거실", title: "89.1 MHz", scene: "room", speaker: "라디오", text: ["잡음 사이에서 낡은 라디오가 깨어난다. ‘…옥상 구조 신호는 거짓… 반복한다… 동쪽 하천…’", "문밖에서 세 번의 노크가 다시 들린다. 이번에는 다른 목소리다. 십 년 전 세상을 떠난 아버지의 목소리.", "‘문 열어. 아빠야.’ 라디오의 붉은 불빛만이 현실처럼 느껴진다."], note: "89.1 MHz: 옥상의 구조 신호를 믿지 말 것. 동쪽 하천으로 갈 것.", choices: [
    { text: "라디오를 챙기고 비상계단으로 향한다", hint: "방송의 경고를 기억한다", to: "hallway", flag: "warning", nerve: -8 },
    { text: "서랍에서 쓸 만한 물건을 더 찾는다", hint: "철저히 준비한다", to: "packing", flag: "warning" },
  ] },
  { id: "openDoor", chapter: 1, floor: "14", location: "1408호 · 현관", title: "문틈", scene: "corridor", text: ["문을 연 순간, 차가운 손가락이 틈으로 파고든다. 손가락의 관절이 하나 더 있다. 손전등을 떨어뜨리며 문을 밀어 닫는다.", "손등이 찢어졌다. 복도 반대편에서 누군가 속삭인다. ‘조용히요. 그건 소리로 우리를 찾아요.’", "틈 아래로 붕대 한 롤이 굴러온다. 아직 믿을 수 있는 사람이 남아 있다."], choices: [
    { text: "붕대를 챙기고 목소리의 주인을 확인한다", hint: "인벤토리에서 붕대를 사용할 수 있다", to: "ally", flag: "ally", add: "bandage" },
    { text: "문을 잠그고 탈출 준비를 한다", hint: "이번에는 신중하게", to: "packing", add: "bandage" },
  ] },
  { id: "ally", chapter: 1, floor: "14", location: "1408호 · 현관", title: "아직 살아 있는 사람", scene: "neighbor", speaker: "서윤", text: ["“아래층에서 올라오는 사람은 없어요. 올라오는 건… 사람처럼 보이는 것뿐이에요.”", "서윤의 손은 떨리고 있지만 눈은 또렷하다. 관리인이 9층에 부상당한 채 숨어 있다고 한다. 그에게는 지하 출입문 열쇠가 있다.", "“같이 가요. 대신, 제가 멈추라고 하면 무조건 멈춰요.”"], note: "서윤과 동행한다. 9층의 관리인이 지하 열쇠를 가지고 있다.", choices: [
    { text: "함께 복도로 나간다", hint: "서윤이 동행한다", to: "hallway", add: "bandage" },
    { text: "필요한 물건을 챙긴 뒤 출발한다", hint: "집을 마지막으로 돌아본다", to: "packing" },
  ] },
  { id: "packing", chapter: 1, floor: "14", location: "1408호 · 거실", title: "가져갈 수 있는 것", scene: "room", text: ["전기가 끊긴 냉장고 옆으로, 열어 둔 서랍이 보인다. 오래된 라디오와 응급 붕대. 가방에는 하나를 더 넣을 자리가 있다.", "벽의 가족사진을 뒤집어 놓는다. 사진 속 얼굴을 기억하고 싶지 않아서가 아니다. 복도에서 그 목소리가 들릴까 봐 두려워서다."], choices: [
    { text: "라디오를 챙긴다", hint: "바깥 세상과의 마지막 연결", to: "hallway", add: "radio" },
    { text: "응급 붕대를 챙긴다", hint: "체력 회복에 사용할 수 있다", to: "hallway", add: "bandage" },
  ] },
  { id: "hallway", chapter: 2, floor: "14", location: "14층 · 공용 복도", title: "불이 켜진 집", scene: "corridor", text: ["복도의 모든 문이 열려 있다. 딱 하나, 1401호만 빼고. 문틈으로 새어 나오는 따뜻한 빛 아래로 그림자 여러 개가 움직인다.", "안에서는 식기 부딪치는 소리와 웃음소리가 들린다. 정전이 시작되기 전, 평범했던 저녁처럼.", "엘리베이터의 숫자가 천천히 올라온다. 11… 12… 13…"], note: "정전 중에도 1401호에는 불이 켜져 있다. 안으로 들어가도 괜찮을까?", choices: [
    { text: "비상계단으로 조용히 이동한다", hint: "불빛에서 멀어진다", to: "stairs" },
    { text: "1401호 안을 들여다본다", hint: "기묘한 저녁 식사", to: "dinner", nerve: -12 },
    { text: "도착하는 엘리베이터에 탄다", hint: "빠르지만, 전기가 돌아온 걸까?", to: "lift" },
  ] },
  { id: "dinner", chapter: 2, floor: "14", location: "1401호 · 문 앞", title: "식지 않는 저녁", scene: "neighbor", text: ["식탁에 앉은 네 사람 모두 뒤통수뿐이다. 고개를 돌린 자리에도 얼굴이 없다. 주방의 벽시계는 3시 17분을 가리킨다.", "“빈자리 있잖아요.” 식탁 끝에 당신의 이름이 적힌 의자가 놓여 있다.", "도어스토퍼 옆에 피 묻은 대피 안내도가 떨어져 있다. 지도에는 지하 배수로가 동그라미로 표시되어 있다."], choices: [
    { text: "안내도만 집어 들고 물러난다", hint: "눈을 마주치지 않는다", to: "stairs", add: "map", nerve: -8 },
    { text: "빈 의자에 앉는다", hint: "잠시만 쉬고 싶다", to: "endingDinner" },
  ] },
  { id: "lift", chapter: 2, floor: "13", location: "엘리베이터", title: "없는 층", scene: "corridor", text: ["엘리베이터 안에는 버튼이 하나뿐이다. ‘B14’. 이 아파트에는 지하 2층까지만 있다.", "문이 닫히려는 순간, 문틀에 끼인 오래된 신발 하나가 보인다. 안쪽에서 무언가 느리게 숨을 들이쉰다."], choices: [
    { text: "닫히는 문 사이로 몸을 던진다", hint: "부상을 감수하고 빠져나간다", to: "stairs", health: -25, noise: 1 },
    { text: "B14 버튼을 누른다", hint: "존재하지 않는 층으로", to: "endingLift" },
  ] },
  { id: "stairs", chapter: 2, floor: "12", location: "12층 · 비상계단", title: "한 층 아래의 발소리", scene: "stairs", text: ["계단참에 물이 고여 있다. 위층에서 떨어지는 물이 아니다. 아래쪽에서 계단을 거슬러 올라오고 있다.", "한 층 아래에서 발소리가 멈춘다. 당신이 멈춘 것과 정확히 같은 순간이다. 당신이 숨을 들이마시자, 아래에서도 숨소리가 난다.", "철제 난간을 따라 작은 돌멩이 하나가 굴러온다."], note: "계단의 존재는 내 소리를 따라 한다. 소리를 다른 곳으로 보내면 어떨까?", choices: [
    { text: "돌멩이를 위층으로 던진다", hint: "소리로 시선을 돌린다", to: "caretaker", flag: "distracted", nerve: 5 },
    { text: "숨을 참고 천천히 내려간다", hint: "동행자가 있다면 도움을 받을 수 있다", to: "pursuit", resolve: { flag: "ally", yes: "quietPass", no: "pursuit" } },
    { text: "손전등으로 아래를 비춘다", hint: "정체를 확인한다", to: "pursuit", nerve: -15, noise: 1 },
  ] },
  { id: "quietPass", chapter: 2, floor: "10", location: "10층 · 계단참", title: "서로의 숨", scene: "stairs", speaker: "서윤", text: ["서윤이 당신의 손목을 붙잡는다. 바닥에 널린 유리 조각을 손전등으로 가리킨다. 한 걸음만 더 갔으면 밟았을 것이다.", "두 사람은 손을 잡고 난간을 넘어간다. 아래의 숨소리가 멀어진다.", "“무서우면 제 손을 잡아요. 소리 내지 말고.”"], choices: [{ text: "9층 관리인을 찾아간다", hint: "함께 살아남는다", to: "caretaker", nerve: 10 }] },
  { id: "pursuit", chapter: 2, floor: "10", location: "10층 · 방화문", title: "따라오는 것", scene: "stairs", text: ["아래에서 길쭉한 손 하나가 난간을 붙잡는다. 몸은 보이지 않는데 손은 점점 가까워진다.", "계단을 뛰어내리다 발목을 접질렀다. 방화문을 밀어 닫자, 문 반대편에서 당신과 똑같은 목소리가 울린다. ‘열어 줘. 나 아직 밖에 있어.’"], choices: [
    { text: "문에 소화기를 걸고 9층으로 간다", hint: "시간을 번다 · 체력 −20", to: "caretaker", health: -20, noise: 1 },
    { text: "목소리에 대답한다", hint: "누가 진짜인지 확인한다", to: "endingVoice" },
  ] },
  { id: "caretaker", chapter: 3, floor: "9", location: "9층 · 관리인 휴게실", title: "마지막 근무", scene: "neighbor", speaker: "관리인", text: ["휴게실 문에는 세 번의 노크에만 대답한다는 쪽지가 붙어 있다. 안에는 다리에 붕대를 감은 노인이 앉아 있다.", "“새벽 네 시가 되면 이 건물은 문을 닫아. 밖으로 향한 모든 문이… 안으로 열리지.”", "노인은 두 물건을 꺼낸다. 지하 기계실 열쇠와 옥상 출입증. ‘내가 본 건 여기까지야. 나머지는 자네가 골라.’"], note: "새벽 4시 전에 탈출해야 한다. 지하에는 배수로가, 옥상에는 구조 신호가 있다.", choices: [
    { text: "지하 열쇠와 대피 안내도를 받는다", hint: "아래로 내려가는 길", to: "lower", add: "key", flag: "underground" },
    { text: "옥상의 구조 신호를 확인하러 간다", hint: "위로 올라가는 길", to: "roofAccess" },
  ] },
  { id: "lower", chapter: 3, floor: "6", location: "6층 · 연결 복도", title: "벽 안의 아이", scene: "corridor", text: ["관리인이 건넨 안내도 뒤에는 한 문장이 적혀 있다. ‘출구는 동쪽. 경보는 서쪽.’", "6층 방화문 앞, 벽 안쪽에서 아이가 우는 소리가 난다. ‘엄마가 문을 닫았어. 꺼내 주세요.’", "벽지는 안에서 밖으로 부풀어 오른다. 아이의 울음 사이로, 금속을 긁는 소리가 섞인다."], note: "관리인의 메모: 출구는 동쪽, 경보는 서쪽.", choices: [
    { text: "울음에 답하지 않고 지나간다", hint: "배운 것을 기억한다", to: "lobby", add: "map", nerve: -5 },
    { text: "벽에 귀를 대고 안을 확인한다", hint: "벽 너머의 진실", to: "wall", nerve: -12 },
  ] },
  { id: "wall", chapter: 3, floor: "6", location: "6층 · 연결 복도", title: "벽지 아래", scene: "death", text: ["벽에 귀를 대자 울음이 멎는다. 아주 가까운 곳에서 무언가 웃는다.", "벽지 아래 수백 개의 손톱 자국. 바깥으로 나오려던 흔적이 아니다. 안으로 끌려가지 않으려 버틴 흔적이다.", "팔목을 잡아당기는 힘을 간신히 뿌리친다. 이번에 잃은 것은 살점 조금과, 아이의 목소리를 믿을 수 있는 마음이다."], choices: [{ text: "뒤돌아보지 않고 내려간다", hint: "체력 −25", to: "lobby", health: -25, add: "map" }] },
  { id: "lobby", chapter: 4, floor: "1", location: "1층 · 로비", title: "유리문 너머", scene: "corridor", text: ["로비에 도착했다. 유리문 밖으로 가로등이 보인다. 차도, 편의점도, 아침을 기다리는 평범한 거리도.", "하지만 유리에 비친 당신은 움직이지 않는다. 반사된 모습이 먼저 웃는다.", "지하로 이어지는 문에는 관리인의 열쇠와 같은 모양의 홈이 있다."], choices: [
    { text: "관리실 열쇠로 지하문을 연다", hint: "열쇠 사용", to: "basement", requires: "key" },
    { text: "유리문을 밀고 거리로 나간다", hint: "너무 평범한 풍경", to: "endingGlass" },
  ] },
  { id: "basement", chapter: 4, floor: "B1", location: "지하 1층 · 기계실", title: "심장 소리", scene: "basement", text: ["거대한 배관이 심장처럼 뛰고 있다. 벽에 매달린 것들이 진동에 맞춰 조금씩 고개를 든다. 도시가 멈춘 이유가 여기 있는 것 같다.", "동쪽 배수로로 가려면 펌프를 작동시켜 물을 빼야 한다. 펌프 옆에 경보 스위치가 있다. 서쪽 끝에는 비상 스피커.", "소리가 울리면 모든 것이 깨어날 것이다. 어디에서 울리게 할 것인가."], choices: [
    { text: "서쪽 경보를 켠 뒤 동쪽 펌프를 돌린다", hint: "소리를 다른 곳으로 보낸다", to: "drain", flag: "safePump", nerve: 5 },
    { text: "라디오를 서쪽에 두고 볼륨을 높인다", hint: "라디오를 미끼로 사용", to: "drain", requires: "radio", remove: "radio", flag: "safePump" },
    { text: "펌프를 켜고 바로 달린다", hint: "소리의 중심을 통과한다", to: "flood", health: -30, noise: 2 },
  ] },
  { id: "flood", chapter: 4, floor: "B1", location: "지하 1층 · 배수관", title: "흐름을 거슬러", scene: "basement", text: ["펌프 소리에 천장의 것들이 일제히 떨어진다. 물이 허리까지 차오른다. 누군가 발목을 잡는다.", "동쪽 배수로의 철망은 아직 열려 있다. 짐을 놓고 몸을 낮추면 지나갈 수 있을 것 같다. 뒤에서 익숙한 목소리가 이름을 부른다."], choices: [
    { text: "목소리를 무시하고 철망 아래로 빠져나간다", hint: "마지막 힘을 쏟는다 · 체력 −20", to: "drain", health: -20 },
    { text: "이름을 부른 쪽을 돌아본다", hint: "아직 누군가 남아 있을지도", to: "endingVoice" },
  ] },
  { id: "drain", chapter: 5, floor: "B2", location: "지하 2층 · 동쪽 배수로", title: "바람이 오는 방향", scene: "basement", text: ["철망 너머로 바람이 불어온다. 썩은 물과 콘크리트 냄새 사이에, 젖은 풀 냄새가 섞여 있다.", "뒤에서 발소리가 들린다. 누군가 세 번, 벽을 두드린다. 처음 문 앞에서 들었던 신호와 같다.", "배수로 끝의 빛이 조금씩 밝아진다. 마지막으로 한 가지 선택이 남았다."], choices: [
    { text: "손을 뻗어 뒤따라오는 사람을 기다린다", hint: "세 번의 신호를 믿는다", to: "endingAlone", resolve: { flag: "ally", yes: "endingTogether", no: "endingStranger" } },
    { text: "출구를 향해 계속 나아간다", hint: "살아남는 것이 먼저다", to: "endingAlone" },
  ] },
  { id: "roofAccess", chapter: 4, floor: "18", location: "18층 · 옥상 계단", title: "하늘에서 오는 신호", scene: "stairs", text: ["옥상 문틈으로 탐조등이 지나간다. 헬리콥터 소리. 누군가 확성기로 외친다. ‘생존자는 불빛 아래로 이동하십시오.’", "그런데 바람이 없다. 회전 날개 소리는 있는데, 바닥의 먼지는 조금도 움직이지 않는다.", "라디오가 있다면 주파수를 맞춰 볼 수 있을 것이다."], choices: [
    { text: "라디오로 구조 신호를 확인한다", hint: "89.1 MHz에 연결", to: "roofWarning", requires: "radio" },
    { text: "문을 열고 옥상으로 나간다", hint: "하늘을 직접 확인한다", to: "roof" },
    { text: "이상함을 느끼고 관리인에게 돌아간다", hint: "아직 늦지 않았다", to: "lower", add: "key" },
  ] },
  { id: "roofWarning", chapter: 4, floor: "18", location: "18층 · 옥상 계단", speaker: "라디오", title: "같은 목소리", scene: "roof", text: ["‘이 구역의 항공 구조는… 사흘 전 중단… 빛을 보지 마십시오.’", "라디오에서 나온 목소리와 옥상 확성기의 목소리가 같다. 다만 확성기 쪽이 반 박자 늦다. 그것은 구조대를 흉내 내고 있다.", "서쪽 난간 너머로 옆 동의 공사 발판이 보인다. 불빛을 등지고 건너갈 수 있다면."], note: "공중의 불빛은 구조대가 아니다. 서쪽 공사 발판으로 건널 수 있다.", choices: [
    { text: "불빛을 피하고 서쪽 발판으로 향한다", hint: "옥상 탈출로 발견", to: "bridge", flag: "warning" },
    { text: "아래로 내려가 지하 탈출로를 찾는다", hint: "관리인의 열쇠를 받는다", to: "lower", add: "key" },
  ] },
  { id: "roof", chapter: 4, floor: "RF", location: "옥상 · 헬리패드", title: "별이 없는 하늘", scene: "roof", text: ["옥상에는 헬리콥터가 없다. 대신 구름 한가운데, 거대한 눈이 떠 있다. 탐조등이라 생각했던 것은 그 눈의 시선이다.", "‘구조되었습니다.’ 확성기의 목소리가 웃는다. 발밑에서 당신의 그림자가 하늘 쪽으로 늘어난다.", "서쪽 난간 아래에는 건너편 동으로 이어지는 공사 발판이 흔들리고 있다."], choices: [
    { text: "몸을 낮추고 서쪽 난간으로 기어간다", hint: "빛에서 벗어난다 · 체력 −15", to: "bridge", health: -15, nerve: -15 },
    { text: "불빛을 향해 손을 흔든다", hint: "구조를 요청한다", to: "endingSky" },
  ] },
  { id: "bridge", chapter: 5, floor: "RF", location: "옥상 · 서쪽 공사 발판", title: "한 걸음의 거리", scene: "roof", text: ["두 건물 사이, 녹슨 발판은 중간이 끊겨 있다. 난간의 안전줄이 마지막 발판을 붙잡고 있다.", "뛰어넘기에는 멀다. 안전줄을 허리에 감고 지지대에 고정하면 건널 수 있을 것 같다.", "동쪽 하늘이 조금 밝아진다. 새벽이 올 수 있는 세상이라면, 아직 끝이 아니다."], choices: [
    { text: "안전줄을 고정하고 천천히 건넌다", hint: "마지막까지 신중하게", to: "endingRoof" },
    { text: "달려가서 건너편으로 뛰어넘는다", hint: "발판이 버텨 주기를", to: "endingFall" },
  ] },
];
const endings: { id: string; kind: "escape" | "death"; title: string; subtitle: string; scene: Scene; text: string[] }[] = [
  { id: "endingTogether", kind: "escape", title: "두 사람의 새벽", subtitle: "TRUE ENDING · 끝까지 놓지 않은 손", scene: "street", text: ["잡은 손은 따뜻하다. 서윤이다. 두 사람은 동쪽 하천 둑 위로 기어 올라온다. 아파트를 돌아보자, 1408호 창문 안에 누군가 서 있다.", "그것은 아직 당신의 얼굴을 하고 있다. 하지만 이제 상관없다. 곁에 있는 사람의 숨결이, 당신이 살아 있다는 증거다.", "오전 5시 42분. 처음으로 새가 운다."] },
  { id: "endingAlone", kind: "escape", title: "살아남은 사람", subtitle: "ESCAPE ENDING · 혼자 맞는 아침", scene: "street", text: ["축축한 풀 위로 몸을 끌어올린다. 차가운 공기가 폐를 찌른다. 살아 있다. 그것만은 확실하다.", "뒤에서 들리던 노크는 멎었다. 누가 따라왔는지, 누구를 두고 왔는지 알 수 없다. 앞으로도 모를 것이다.", "아침 햇빛 속에서도 당신은 문을 세 번 두드리는 소리를 듣는다."] },
  { id: "endingStranger", kind: "escape", title: "이름 없는 동행", subtitle: "ESCAPE ENDING · 처음 잡은 손", scene: "street", text: ["어둠 속에서 잡은 손은 어린아이의 손이다. 계단 밑 창고에 숨었던 아이는 관리인에게 세 번의 신호를 배웠다고 한다.", "둘은 서로의 이름을 묻지 않고 하천까지 걷는다. 해가 뜨자, 아이가 처음으로 말을 한다. ‘이제 집에 가도 돼요?’", "당신은 대답 대신 아이의 손을 조금 더 꼭 잡는다."] },
  { id: "endingRoof", kind: "escape", title: "하늘을 등지고", subtitle: "ESCAPE ENDING · 다른 높이의 출구", scene: "street", text: ["안전줄이 팽팽해진다. 마지막 발판을 딛고 건너편 옥상에 쓰러진다. 거대한 눈은 아파트 위에 머물러 있다. 이쪽을 보지 못한다.", "건너편 계단에는 새벽빛이 들어온다. 계단을 내려갈 때마다, 오래 잊었던 거리의 소리가 돌아온다.", "땅에 닿은 뒤에야 당신은 올려다보지 않고도 걸을 수 있다는 것을 기억한다."] },
  { id: "endingDinner", kind: "death", title: "한 사람의 빈자리", subtitle: "DEATH ENDING · 저녁은 끝나지 않는다", scene: "neighbor", text: ["의자에 앉자 배고픔도 두려움도 사라진다. 따뜻한 수프. 익숙한 웃음. 고개를 돌릴 필요는 없다.", "얼마 후 복도에서 발소리가 난다. 당신은 다른 네 사람과 함께 말한다. ‘빈자리 있잖아요.’", "1401호의 시계는 여전히 3시 17분이다."] },
  { id: "endingLift", kind: "death", title: "지하 14층", subtitle: "DEATH ENDING · 도착할 수 없는 곳", scene: "death", text: ["엘리베이터가 내려간다. 1층, 지하 1층, 지하 2층. 숫자는 멈추지 않는다.", "문이 열리자 당신의 집이 보인다. 1408호. 현관 안쪽에서 누군가 문구멍으로 당신을 보고 있다.", "당신은 세 번 노크한다. ‘안에 계세요? 아직 사람이면…’"] },
  { id: "endingVoice", kind: "death", title: "남겨진 목소리", subtitle: "DEATH ENDING · 다음 사람을 부르는 소리", scene: "death", text: ["대답한 순간, 목소리가 몸에서 떨어져 나간다. 입을 벌려도 아무 소리도 나지 않는다.", "당신의 목소리는 이미 한 층 위로 올라가고 있다. 누군가의 이름을 부르면서.", "아파트는 또 하나의 목소리를 기억했다."] },
  { id: "endingGlass", kind: "death", title: "반대편의 당신", subtitle: "DEATH ENDING · 문은 안쪽으로 열린다", scene: "death", text: ["유리문을 밀자 바깥의 당신이 손을 잡는다. 차가운 손. 익숙한 얼굴. 안심한 표정.", "자리가 뒤바뀐다. 당신은 이제 유리 안에서 아파트를 바라본다. 입주민 한 사람이 로비로 내려오고 있다.", "당신은 웃는 것밖에 할 수 없다."] },
  { id: "endingSky", kind: "death", title: "구조 완료", subtitle: "DEATH ENDING · 불빛이 데려간 것", scene: "roof", text: ["그림자가 먼저 하늘로 끌려간다. 당신의 몸은 그 뒤를 따른다. 비명은 회전 날개 소리에 섞여 사라진다.", "옥상에는 다시 탐조등이 비친다. 이번에는 당신의 목소리로 방송이 나온다.", "‘생존자는 불빛 아래로 이동하십시오.’"] },
  { id: "endingFall", kind: "death", title: "열여덟 층의 밤", subtitle: "DEATH ENDING · 닿지 못한 반대편", scene: "death", text: ["발판이 부러지는 소리는 의외로 작았다. 손끝이 건너편 난간에 스친다. 잡을 수 있었을 것 같다.", "창문들이 위로 흘러간다. 모든 창문 안에서 당신과 같은 얼굴이 내려다본다.", "지상은 끝내 오지 않는다."] },
  { id: "endingExhausted", kind: "death", title: "마지막 숨", subtitle: "DEATH ENDING · 너무 먼 출구", scene: "death", text: ["다리에 더는 힘이 들어가지 않는다. 벽에 기대앉자 이상하리만치 편안하다.", "주머니 속 손전등이 마지막으로 깜빡인다. 빛이 사라지자 복도 끝의 발소리가 가까워진다.", "다음번에는 조금 더 자신을 아껴야 한다. 탈출할 몸이 있어야, 출구도 의미가 있으니까."] },
];
endings.forEach(e => raw.push({ id: e.id, chapter: 5, floor: e.kind === "escape" ? "OUT" : "—", location: e.kind === "escape" ? "아파트 바깥 · 새벽" : "기록이 끊긴 곳", title: e.title, scene: e.scene, text: e.text, choices: [], ending: { id: e.id, kind: e.kind, title: e.title, subtitle: e.subtitle } }));
export const STORY: Record<string, StoryNode> = Object.fromEntries(raw.map(n => [n.id, n]));
export const ENDINGS = raw.filter(n => n.ending);
export function choose(run: Run, index: number): Run {
  const choice = STORY[run.node]?.choices[index];
  if (!choice || (choice.requires && !run.inventory.includes(choice.requires))) return run;
  const next: Run = { ...run, inventory: [...run.inventory], flags: [...run.flags], history: [...run.history, { node: run.node, choice: choice.text }], health: Math.max(0, Math.min(100, run.health + (choice.health || 0))), nerve: Math.max(0, Math.min(100, run.nerve + (choice.nerve || 0))), noise: Math.min(5, run.noise + (choice.noise || 0)), node: choice.resolve ? (run.flags.includes(choice.resolve.flag) ? choice.resolve.yes : choice.resolve.no) : choice.to };
  if (choice.add && !next.inventory.includes(choice.add)) next.inventory.push(choice.add);
  if (choice.remove) next.inventory = next.inventory.filter(i => i !== choice.remove);
  if (choice.flag && !next.flags.includes(choice.flag)) next.flags.push(choice.flag);
  if (next.health <= 0) next.node = "endingExhausted";
  return next;
}
export function heal(run: Run): Run {
  if (!run.inventory.includes("bandage") || run.health === 100 || STORY[run.node].ending) return run;
  return { ...run, health: Math.min(100, run.health + 25), inventory: run.inventory.filter(i => i !== "bandage") };
}
export function validRun(value: unknown): value is Run {
  if (!value || typeof value !== "object") return false;
  const r = value as Run;
  return typeof r.node === "string" && Object.hasOwn(STORY, r.node) && [r.health, r.nerve, r.noise].every(Number.isFinite) && r.health >= 0 && r.health <= 100 && r.nerve >= 0 && r.nerve <= 100 && r.noise >= 0 && r.noise <= 5 && Array.isArray(r.inventory) && r.inventory.every(i => typeof i === "string" && Object.hasOwn(ITEMS, i)) && Array.isArray(r.flags) && r.flags.every(f => typeof f === "string") && Array.isArray(r.history) && r.history.length <= 200 && r.history.every(h => h && typeof h.node === "string" && Object.hasOwn(STORY, h.node) && typeof h.choice === "string");
}
