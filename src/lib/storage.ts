import { ENDINGS, type Run, validRun } from "./story";
export const STORAGE_KEY = "resonance-1408:v1";
export type SaveData = { version: 1; run: Run; manual: Run | null; endings: string[]; savedAt: string; settings: { sound: boolean; effects: boolean } };
export function decodeSave(raw: string | null): SaveData | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    if (d?.version !== 1 || !validRun(d.run) || (d.manual !== null && !validRun(d.manual)) || !Array.isArray(d.endings) || !d.endings.every((id: unknown) => typeof id === "string" && ENDINGS.some(e => e.id === id)) || typeof d.savedAt !== "string" || typeof d.settings?.sound !== "boolean" || typeof d.settings?.effects !== "boolean") return null;
    return d as SaveData;
  } catch { return null; }
}
