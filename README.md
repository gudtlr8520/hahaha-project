# 잔향 : 1408

정전된 고층 아파트에서 탈출하는 한국어 선택형 생존 노벨. Next.js 16 App Router, React 19, TypeScript로 제작했습니다.

## 실행

Node.js 24 LTS와 npm을 사용합니다.

```sh
npm ci
npm run dev
```

http://localhost:3000 에서 플레이할 수 있습니다.

```sh
npm test
npm run typecheck
npm run build
npm start
```

브라우저 검증은 `npm run test:e2e`로 실행합니다. Windows에 설치된 Chrome을 사용하며, 다른 환경에서는 `npx playwright install chromium`으로 테스트 브라우저를 설치할 수 있습니다. `PLAYWRIGHT_CHROMIUM_EXECUTABLE`로 실행 파일 경로를 지정할 수도 있습니다.

## 게임

- 5개 챕터, 35개 스토리 장면, 11개 엔딩 (탈출 4개 / 사망 7개)
- 8가지 장면 유형의 직접 제작한 640×300 Canvas 도트 그래픽
- 동료, 아이템, 체력에 따른 분기 및 아이템 조건 선택지
- 브라우저 자동 저장, 수동 저장 1개, 선택 기록, 엔딩 수집
- 배경음 켜기/끄기, CRT 효과 설정, 감소된 모션 환경 지원
- 숫자 1~3 또는 클릭/터치로 선택, ESC로 창 닫기
- 소지품에서 붕대 사용 시 체력 25 회복

침착함과 소음은 선택의 흔적을 보여주는 지표입니다. 별도 무작위 판정이나 실제 시간 제한은 없습니다. 체력이 0이 되면 사망하며, 동료·아이템·선택에 따라 결말이 달라집니다.

## 저장

DB, 인증, 서버 저장 API는 없습니다. 진행·수동 저장·설정·엔딩은 `localStorage`의 `resonance-1408:v1` 키에만 저장합니다. 새로고침 시 자동 복원하고, 잘못된 저장 형식은 안전하게 초기화합니다. 새 게임은 수집한 엔딩과 수동 저장을 유지합니다.

브라우저 데이터 삭제, 시크릿 창 종료 시 기록이 사라질 수 있으며 다른 기기·도메인과 동기화되지 않습니다. localhost와 배포된 웹사이트의 기록도 별개입니다. 저장 불가 상황은 화면에 표시합니다. 배경음은 사용자가 켤 때만 Web Audio로 재생합니다.

## Vercel 배포

1. Vercel에서 `hahaha-project`를 Import합니다.
2. Framework Preset은 **Next.js**, Root Directory는 저장소 루트(`.`)입니다.
3. Build Command는 `npm run build`, Install Command는 `npm ci`를 사용합니다.
4. 환경변수나 DB 연결 없이 배포할 수 있습니다.

GitHub 연동 후에는 연결된 브랜치에 푸시하면 Vercel이 자동으로 배포합니다. 로컬 폴더에서 Vercel CLI의 `vercel` 명령으로 미리보기 배포를 할 수도 있습니다.

## 소스 구조

- `src/lib/story.ts`: 이야기, 선택지, 아이템, 순수 상태 전이 함수
- `src/lib/storage.ts`: 버전이 있는 저장 형식과 유효성 검사
- `src/components/Game.tsx`: 게임 인터페이스, 저장, 모달, 오디오
- `src/components/PixelScene.tsx`: 원본 픽셀 아트 렌더러
- `src/app/globals.css`: 반응형 화면과 접근성 스타일
- `tests/story.test.ts`: 전체 분기 도달성, 아이템, 회복, 저장 검증

Yuppie Psycho의 저해상도 공포 분위기를 참고하되 이야기·캐릭터·장면 그래픽은 이 프로젝트에서 직접 제작했으며 게임 원본 자산은 사용하지 않았습니다.
