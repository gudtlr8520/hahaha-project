import { test, expect, type Page } from "@playwright/test";

async function pick(page: Page, index: number) {
  const title = await page.locator(".story-heading h2").innerText();
  await page.locator(".choice").nth(index).click();
  await expect(page.locator(".story-heading h2")).not.toHaveText(title);
  // The UI deliberately ignores accidental double-clicks during a transition.
  await page.waitForTimeout(250);
}

test("desktop: save, restore, journal, keyboard, complete an escape, retain endings on restart", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByText("자동 저장됨", {exact:true})).toBeVisible();
  await page.screenshot({path:"test-results/desktop.png",fullPage:true});
  await page.keyboard.press("1");
  await expect(page.locator(".story-heading h2")).toHaveText("세 번의 노크");
  await page.reload();
  await expect(page.locator(".story-heading h2")).toHaveText("세 번의 노크");
  await page.getByRole("button",{name:"저장 / 불러오기"}).click();
  await page.getByRole("button",{name:"현재 장면 저장",exact:true}).click();
  await pick(page,0);
  await page.getByRole("button",{name:"저장 / 불러오기"}).click();
  await page.getByRole("button",{name:"저장한 장면 불러오기"}).click();
  await expect(page.locator(".story-heading h2")).toHaveText("세 번의 노크");
  await page.getByRole("button",{name:"생존 기록"}).click();
  await expect(page.locator(".journal-entry")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  for(let i=0;i<9;i++) await pick(page,0);
  await expect(page.locator(".story-heading h2")).toHaveText("두 사람의 새벽");
  await page.reload();
  await expect(page.locator(".story-heading h2")).toHaveText("두 사람의 새벽");
  await page.getByRole("button",{name:"다른 선택으로 다시 시작"}).click();
  await page.getByRole("button",{name:"새로운 이야기 시작"}).click();
  await expect(page.locator(".story-heading h2")).toHaveText("문밖의 누군가");
  await page.getByRole("button",{name:/엔딩 수집/}).click();
  await expect(page.locator(".ending-tile.found")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("mobile: no overflow, accessible menus, health item, death and audio settings", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  await expect(page.getByText("자동 저장됨",{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({path:"test-results/mobile.png",fullPage:true});
  await pick(page,2);
  await pick(page,0);
  await page.getByRole("button",{name:"붕대 확인"}).click();
  await page.getByRole("button",{name:"붕대 사용 · 체력 +25"}).click();
  await expect(page.locator(".stat").first()).toContainText("100");
  await expect(page.getByRole("button",{name:"붕대 확인"})).toHaveCount(0);
  await pick(page,0);
  await pick(page,1);
  await pick(page,1);
  await expect(page.locator(".story-heading h2")).toHaveText("한 사람의 빈자리");
  await page.getByRole("button",{name:"메뉴 열기"}).click();
  await page.getByRole("button",{name:"설정",exact:true}).click();
  await page.getByRole("button",{name:/화면 효과/}).click();
  await expect(page.locator(".app")).not.toHaveClass(/with-effects/);
  await page.getByRole("button",{name:/배경음/}).click();
  await expect(page.getByRole("button",{name:/배경음/})).toHaveAttribute("aria-pressed","true");
  await page.getByRole("button",{name:/배경음/}).click();
  await expect(page.getByRole("button",{name:/배경음/})).toHaveAttribute("aria-pressed","false");
  await page.keyboard.press("Escape");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("corrupted and unavailable local storage do not prevent playing", async ({ page }) => {
  await page.addInitScript(()=>{localStorage.setItem("resonance-1408:v1","{broken");});
  await page.goto("/");
  await expect(page.locator(".story-heading h2")).toHaveText("문밖의 누군가");
  await expect(page.getByText("자동 저장됨",{exact:true})).toBeVisible();
  await pick(page,0);
  await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException("blocked","SecurityError");};});
  await page.reload();
  await expect(page.getByText("저장 불가",{exact:true})).toBeVisible();
  await pick(page,0);
  await expect(page.locator(".story-heading h2")).toBeVisible();
});
