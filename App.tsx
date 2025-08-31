import { useEffect, useRef, useState } from "react";
import { sendMessage } from "./api";
import type { ChatMessage } from "./types";
import Welcome from "./Welcome";
import MarkdownMessage from "./MarkdownMessage";
import "./loading.css";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null); // NEW

  useEffect(() => {
    feedRef.current?.scrollTo({
      top: feedRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Click a suggestion: fill input + submit
  const pick = (q: string) => {
    if (loading) return;
    setInput(q);
    setTimeout(() => formRef.current?.requestSubmit(), 0);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage({ message: text, threadId });
      setThreadId(res.threadId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply ?? "(no reply)" },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message || err}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.chat}>
        <header style={styles.header}>🎱 ChalkBot</header>

        <div ref={feedRef} style={styles.feed}>
          {messages.length === 0 && !loading ? ( // NEW
            <Welcome onPick={pick} />
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                ...(m.role === "user" ? styles.user : styles.assistant),
              }}
            >
              {m.role === "assistant" ? (
                <MarkdownMessage text={m.content} />
              ) : (
                m.content
              )}
            </div>
          ))}

          {loading && (
            <div
              style={{
                ...styles.bubble,
                ...styles.assistant,
                padding: "8px 10px",
              }}
              role="status"
              aria-live="polite"
            >
              <span className="loadingRow">
                <span className="loaderBox">
                  <span className="loader" aria-hidden="true"></span>
                </span>
                <span className="thinking">Thinking…</span>
              </span>
            </div>
          )}
        </div>

        <form ref={formRef} onSubmit={onSubmit} style={styles.form}>
          {" "}
          {/* NEW ref */}
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a rule question…"
            aria-label="message"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <button
            type="submit"
            style={styles.btn}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

// inline styles to keep the example self‑contained
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "fixed", // fill the viewport
    inset: 0, // top:0 right:0 bottom:0 left:0
    width: "100vw",
    height: "100svh", // stable vh on mobile; fallback below
    background: "#0f172a",
    padding: 0, // no extra height
    display: "grid",
    gridTemplateRows: "1fr", // single cell
  },

  chat: {
    width: "100%",
    height: "100%",
    background: "#0b1220",
    border: "1px solid #1f2a44",
    borderRadius: 0, // edge-to-edge; add back if you want
    overflow: "hidden",
    display: "grid",
    gridTemplateRows: "auto 1fr auto", // header / feed / form
  },

  header: {
    padding: "12px 16px",
    background: "#111827",
    color: "#e5e7eb",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  feed: {
    padding: 16,
    overflowY: "auto", // only this area scrolls
    overscrollBehavior: "contain",
    display: "grid",
    gap: 10,
    alignContent: "start",
    gridAutoRows: "min-content",
  },

  bubble: {
    display: "inline-block",
    width: "fit-content",
    padding: "10px 12px",
    borderRadius: 10,
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
    lineHeight: 1.4,
    fontSize: 14,
  },

  user: { marginLeft: "auto", background: "#0ea5e9", color: "#041016" },
  assistant: { marginRight: "auto", background: "#1f2937", color: "#e5e7eb" },

  form: {
    display: "flex",
    gap: 8,
    padding: 12,
    background: "#0b1220",
    borderTop: "1px solid #1f2a44",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #1f2a44",
    background: "#0b1220",
    color: "#e5e7eb",
    outline: "none",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #1f2a44",
    background: "#0ea5e9",
    color: "#041016",
    fontWeight: 600,
    cursor: "pointer",
  },
};

// optional dvh fallback for older browsers:
styles.wrap.height = "100dvh";

export default App;
