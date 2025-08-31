import type { ChatRequest, ChatResponse, ApiError } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; 

async function safeJson(res: Response) {
  const text = await res.text();               
  let data: any = {};
  if (text) { try { data = JSON.parse(text); } catch { /* ignore */ } }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.detail || data.message)) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function sendMessage(
  body: ChatRequest,
  opts?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<ChatResponse> {
  const { signal, timeoutMs = 60_000 } = opts || {};
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: signal ?? controller.signal,
      credentials: "include", // harmless; useful if you add auth later
    });
    const data = await safeJson(res);
    return data as ChatResponse;
  } finally {
    clearTimeout(timeout);
  }
}
