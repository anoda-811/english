/** English TTS: browser-first (avoids server SSL/proxy issues in local dev). */

let sharedAudio: HTMLAudioElement | null = null;
let lastObjectUrl: string | null = null;
let speakSessionId = 0;

function revokeLastObjectUrl() {
  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = null;
  }
}

export function getGoogleTtsUrl(text: string): string {
  const url = new URL("https://translate.googleapis.com/translate_tts");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("ie", "UTF-8");
  url.searchParams.set("tl", "en");
  url.searchParams.set("q", text);
  return url.toString();
}

function getAudioElement(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio();
  }
  return sharedAudio;
}

function playUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = getAudioElement();
    audio.pause();
    audio.currentTime = 0;

    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      resolve(ok);
    };

    const timer = window.setTimeout(() => finish(false), 12_000);

    const onEnded = () => finish(true);
    const onError = () => finish(false);

    audio.addEventListener("ended", onEnded, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.src = url;
    audio.load();
    void audio.play().catch(() => finish(false));
  });
}

async function playFromProxyApi(text: string): Promise<boolean> {
  revokeLastObjectUrl();
  try {
    const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
    if (!res.ok) return false;

    const blob = await res.blob();
    if (!blob.size) return false;

    lastObjectUrl = URL.createObjectURL(blob);
    return playUrl(lastObjectUrl);
  } catch {
    return false;
  }
}

function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const onChange = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

async function playWebSpeech(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  const voices = await waitForVoices();
  const voice =
    voices.find((v) => v.lang === "en-US" && /google|natural|jenny|aria|samantha/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en-US")) ||
    voices.find((v) => v.lang.startsWith("en"));

  return new Promise((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(ok);
    };
    const timer = window.setTimeout(() => {
      window.speechSynthesis.cancel();
      finish(false);
    }, 12_000);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    if (voice) utterance.voice = voice;
    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);
    window.speechSynthesis.speak(utterance);
  });
}

export type SpeakResult = "ok" | "cancelled" | "failed";

export async function speakEnglish(text: string): Promise<SpeakResult> {
  if (typeof window === "undefined") return "failed";

  const myId = ++speakSessionId;
  const cancelled = () => speakSessionId !== myId;

  revokeLastObjectUrl();
  getAudioElement().pause();

  if (await playUrl(getGoogleTtsUrl(text))) {
    return cancelled() ? "cancelled" : "ok";
  }
  if (cancelled()) return "cancelled";

  if (await playFromProxyApi(text)) {
    return cancelled() ? "cancelled" : "ok";
  }
  if (cancelled()) return "cancelled";

  if (await playWebSpeech(text)) {
    return cancelled() ? "cancelled" : "ok";
  }
  if (cancelled()) return "cancelled";

  return "failed";
}

export function stopSpeaking() {
  speakSessionId += 1;
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
  if (sharedAudio) {
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
    sharedAudio.removeAttribute("src");
    sharedAudio.load();
  }
  revokeLastObjectUrl();
}
