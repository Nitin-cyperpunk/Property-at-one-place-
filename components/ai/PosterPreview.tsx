"use client";

import { Download, Maximize2, MessageCircle, Share2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import {
  fetchPosterBlob,
  fetchPosterFile,
  posterFileName,
} from "@/lib/ai/poster-download";

type Props = {
  posterUrl: string;
  title: string;
  propertyId?: string;
};

export function PosterPreview({ posterUrl, title, propertyId }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [shareHint, setShareHint] = useState<string | null>(null);

  const filename = posterFileName(title, propertyId);
  const shareText = `Check out this property on RentSetGo: ${title}`;

  const savePosterFile = useCallback(async () => {
    const blob = await fetchPosterBlob(posterUrl);
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  }, [posterUrl, filename]);

  const download = useCallback(async () => {
    setShareHint(null);
    setBusy("download");
    try {
      await savePosterFile();
    } catch {
      const a = document.createElement("a");
      a.href = posterUrl;
      a.download = filename;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
    } finally {
      setBusy(null);
    }
  }, [posterUrl, filename, savePosterFile]);

  const shareWithFile = useCallback(async (): Promise<boolean> => {
    try {
      const file = await fetchPosterFile(posterUrl, filename);
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${title} · RentSetGo`,
          text: shareText,
        });
        return true;
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return true;
    }
    return false;
  }, [posterUrl, filename, title, shareText]);

  const shareWhatsApp = useCallback(async () => {
    setShareHint(null);
    setBusy("share");
    setShareOpen(false);
    try {
      const shared = await shareWithFile();
      if (shared) return;

      const text = `${shareText}\n${posterUrl}`;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(null);
    }
  }, [shareWithFile, shareText, posterUrl]);

  const shareInstagram = useCallback(async () => {
    setShareHint(null);
    setBusy("share");
    setShareOpen(false);
    try {
      const shared = await shareWithFile();
      if (shared) return;

      try {
        await savePosterFile();
      } catch {
        const a = document.createElement("a");
        a.href = posterUrl;
        a.download = filename;
        a.click();
      }
      setShareHint("Poster saved — open Instagram and share from your gallery.");
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = "instagram://app";
        setTimeout(() => {
          window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
        }, 800);
      } else {
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      }
    } catch {
      setShareHint("Download the poster, then upload it in the Instagram app.");
    } finally {
      setBusy(null);
    }
  }, [shareWithFile, savePosterFile, posterUrl, filename]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-950/5 shadow-inner dark:border-zinc-700">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <Image
            src={posterUrl}
            alt={`Marketing poster for ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
            unoptimized
          />
        </div>
        <div className="relative border-t border-zinc-200/80 bg-white/50 p-3 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/50">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={download}
              disabled={busy !== null}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              <Download className="size-3.5" aria-hidden />
              {busy === "download" ? "Saving…" : "Download PNG"}
            </button>
            <button
              type="button"
              onClick={() => setShareOpen((o) => !o)}
              disabled={busy !== null}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-60"
              aria-expanded={shareOpen}
              aria-haspopup="true"
            >
              <Share2 className="size-3.5" aria-hidden />
              {busy === "share" ? "Opening…" : "Share"}
            </button>
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              aria-label="Fullscreen preview"
            >
              <Maximize2 className="size-3.5" aria-hidden />
            </button>
          </div>

          {shareOpen ? (
            <div
              className="mt-3 rounded-xl border border-zinc-200/90 bg-white p-2 shadow-lg dark:border-zinc-600 dark:bg-zinc-900"
              role="menu"
            >
              <div className="mb-1 flex items-center justify-between px-2 py-1">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Share poster
                </span>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className="rounded p-0.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Close share menu"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={shareWhatsApp}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-800 transition hover:bg-emerald-50 dark:text-zinc-100 dark:hover:bg-emerald-950/40"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                  <MessageCircle className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block">WhatsApp</span>
                  <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    Send to chats or status
                  </span>
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={shareInstagram}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-800 transition hover:bg-pink-50 dark:text-zinc-100 dark:hover:bg-pink-950/30"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529]/20 via-[#dd2a7b]/20 to-[#8134af]/20 text-[#dd2a7b]">
                  <svg
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span>
                  <span className="block">Instagram</span>
                  <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    Story or post from gallery
                  </span>
                </span>
              </button>
            </div>
          ) : null}

          <p className="mt-2 truncate text-[10px] text-zinc-400 dark:text-zinc-500" title={filename}>
            Saves as: {filename}
          </p>
          {shareHint ? (
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">{shareHint}</p>
          ) : null}
        </div>
      </div>

      {fullscreen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close fullscreen"
            onClick={() => setFullscreen(false)}
          />
          <div className="relative z-[1] max-h-[90vh] w-full max-w-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt=""
              className="max-h-[90vh] w-full rounded-lg object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
