"use client";

import { FormEvent, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function SubmissionForm({ assignmentTitle }: { assignmentTitle: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("assignmentTitle", assignmentTitle);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });
      const result = await response.json().catch(() => ({
        message: "제출 중 문제가 발생했습니다.",
      }));

      if (!response.ok) {
        setState("error");
        setMessage(result.message ?? "제출 중 문제가 발생했습니다.");
        return;
      }

      setState("success");
      setMessage("제출이 완료되었습니다.");
      formRef.current?.reset();
    } catch {
      setState("error");
      setMessage("네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-3">
      <input type="hidden" name="assignmentTitle" value={assignmentTitle} />
      <label className="grid gap-2">
        <span className="text-xs font-black text-muted">파일 업로드</span>
        <input
          name="file"
          type="file"
          required
          accept=".pdf,.ppt,.pptx,.doc,.docx,.hwp,.hwpx,.png,.jpg,.jpeg,.webp"
          className="w-full border border-line bg-transparent px-3 py-2 text-xs font-bold text-smoke file:mr-3 file:rounded-full file:border-0 file:bg-bone file:px-4 file:py-2 file:text-xs file:font-black file:text-ink"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-xs font-black text-muted">코멘트</span>
        <textarea
          name="comment"
          rows={3}
          placeholder="제출 메모가 있으면 적어주세요."
          className="w-full resize-y border border-line bg-transparent px-3 py-2 text-sm text-bone outline-none placeholder:text-muted focus:border-bone"
        />
      </label>
      <p className="text-xs font-medium leading-5 text-muted">PDF, PPT, 문서, 이미지 파일을 업로드할 수 있습니다. 대용량 영상은 Drive 링크 제출로 별도 안내 예정입니다.</p>
      {message ? <p className={`text-xs font-bold ${state === "success" ? "text-smoke" : "text-signal"}`}>{message}</p> : null}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-black transition hover:border-bone hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "submitting" ? "업로드 중" : "파일 제출"}
        <UploadCloud aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  );
}
