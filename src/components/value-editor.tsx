/* src/components/value-editor.tsx */

import { useEffect, useState, useRef } from "react";
import type { Instance } from "@/contexts/instance-context";
import { getValue, updateValue } from "@/lib/api";

interface ValueEditorProps {
  instance: Instance;
  selectedKey: string | null;
}

export function ValueEditor({ instance, selectedKey }: ValueEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [lineCount, setLineCount] = useState(1);
  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!selectedKey) {
      setContent("");
      setOriginalContent("");
      setStatus("idle");
      return;
    }

    const fetchValue = async () => {
      setStatus("loading");
      setError(null);
      try {
        const [project, ...rest] = selectedKey.split("/");
        const path = rest.join("/");
        const value = await getValue(instance.url, project, path);
        const formattedValue = JSON.stringify(value, null, 2);
        setContent(formattedValue);
        setOriginalContent(formattedValue);
        setStatus("idle");
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "Failed to fetch value";
        setError(errorMessage);
        setStatus("error");
        console.error(e);
      }
    };

    fetchValue();
  }, [selectedKey, instance]);

  useEffect(() => {
    const lines = content.split("\n").length;
    setLineCount(lines);
  }, [content]);

  const handleScroll = () => {
    if (lineCounterRef.current && textAreaRef.current) {
      lineCounterRef.current.scrollTop = textAreaRef.current.scrollTop;
    }
  };

  const handleSave = async () => {
    if (!selectedKey) return;

    let parsedValue;
    try {
      parsedValue = JSON.parse(content);
    } catch {
      // Renamed 'e' to '_e' to indicate it's unused
      setError("Invalid JSON format.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const [project, ...rest] = selectedKey.split("/");
      const path = rest.join("/");
      await updateValue(instance.url, project, path, parsedValue);
      setOriginalContent(content);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to save value";
      setError(errorMessage);
      setStatus("error");
      console.error(e);
    }
  };

  if (!selectedKey) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-sub">
        Select a key from the sidebar to view its value.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2
          className="font-mono text-lg text-primary truncate"
          title={selectedKey}
        >
          {selectedKey}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setContent(originalContent)}
            disabled={content === originalContent}
            className="px-4 py-2 text-sm rounded-md bg-tertiary/20 text-text-sub hover:bg-tertiary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revert
          </button>
          <button
            onClick={handleSave}
            disabled={content === originalContent || status === "loading"}
            className="px-4 py-2 text-sm rounded-md bg-accent text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading"
              ? "Saving..."
              : status === "success"
                ? "Saved!"
                : "Save"}
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-900/50 text-red-200 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 flex border border-tertiary/20 rounded-md bg-background overflow-hidden">
        <div
          ref={lineCounterRef}
          className="w-12 text-right p-2 bg-background-alt text-text-sub select-none overflow-y-hidden font-mono text-sm"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textAreaRef}
          onScroll={handleScroll}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
