"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Flag,
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  SkipForward,
  UserPlus,
} from "lucide-react";
import {
  endRandomAction,
  randomStatusAction,
  signalRandomAction,
  startRandomSearchAction,
} from "@/lib/actions/random";
import { sendFollowRequestAction } from "@/lib/actions/social";

type Status = "idle" | "permission" | "searching" | "connecting" | "connected";

export function RandomCall() {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const lkRef = useRef<{ disconnect: () => Promise<void> } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionId = useRef<string | null>(null);
  const roleRef = useRef<"a" | "b" | null>(null);
  const peerId = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [followState, setFollowState] = useState<"idle" | "sent">("idle");
  const [chatOpen, setChatOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopMedia = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    void lkRef.current?.disconnect();
    lkRef.current = null;
  };

  const ensureMedia = async () => {
    setStatus("permission");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (localRef.current) localRef.current.srcObject = stream;
    return stream;
  };

  const attachPc = async (stream: MediaStream) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    pc.ontrack = (ev) => {
      if (remoteRef.current) remoteRef.current.srcObject = ev.streams[0];
    };
    pc.onicecandidate = (ev) => {
      if (!ev.candidate || !sessionId.current) return;
      void signalRandomAction({ sessionId: sessionId.current, ice: JSON.stringify(ev.candidate) });
    };
    return pc;
  };

  const start = async () => {
    setError(null);
    setFollowState("idle");
    try {
      const stream = streamRef.current ?? (await ensureMedia());
      const res = await startRandomSearchAction();
      if ("error" in res && res.error) {
        setError(res.error);
        setStatus("idle");
        return;
      }
      if ("sessionId" in res && res.sessionId) sessionId.current = res.sessionId;
      setStatus((res.status as Status) || "searching");
      if (res.status === "connecting" || res.status === "connected") {
        await attachPc(stream);
      }
    } catch {
      setError("Camera and microphone permission is required to start Random Video.");
      setStatus("idle");
    }
  };

  const next = async () => {
    if (remoteRef.current) remoteRef.current.srcObject = null;
    pcRef.current?.close();
    pcRef.current = null;
    void lkRef.current?.disconnect();
    lkRef.current = null;
    sessionId.current = null;
    roleRef.current = null;
    setFollowState("idle");
    const res = await endRandomAction("next");
    if ("sessionId" in res && res.sessionId) sessionId.current = res.sessionId;
    setStatus((res.status as Status) || "searching");
  };

  const end = async () => {
    await endRandomAction("end");
    stopMedia();
    if (localRef.current) localRef.current.srcObject = null;
    if (remoteRef.current) remoteRef.current.srcObject = null;
    sessionId.current = null;
    setStatus("idle");
  };

  const poll = useCallback(async () => {
    const s = await randomStatusAction();
    if (s.status === "searching") setStatus("searching");
    if (s.status === "idle" && status !== "idle" && status !== "permission") {
      /* still local searching until matched */
    }
    if (!("sessionId" in s) || !s.sessionId) return;
    sessionId.current = s.sessionId;
    roleRef.current = s.role as "a" | "b";
    peerId.current = s.peerId ?? null;
    setStatus(s.status as Status);
    if ("livekitToken" in s && s.livekitToken && s.livekitUrl) {
      if (!lkRef.current) {
        const { Room, RoomEvent, Track } = await import("livekit-client");
        const room = new Room();
        lkRef.current = room;
        room.on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind === Track.Kind.Video && remoteRef.current) track.attach(remoteRef.current);
          if (track.kind === Track.Kind.Audio) {
            const el = track.attach();
            el.autoplay = true;
          }
        });
        await room.connect(s.livekitUrl, s.livekitToken);
        await room.localParticipant.enableCameraAndMicrophone();
      }
      return;
    }
    const stream = streamRef.current;
    if (!stream) return;
    if (!pcRef.current) await attachPc(stream);
    const pc = pcRef.current;
    if (!pc) return;

    if (s.role === "a" && !s.offerSdp && pc.signalingState === "stable") {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await signalRandomAction({ sessionId: s.sessionId, offerSdp: offer.sdp });
    }
    if (s.role === "b" && s.offerSdp && !pc.remoteDescription) {
      await pc.setRemoteDescription({ type: "offer", sdp: s.offerSdp });
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await signalRandomAction({ sessionId: s.sessionId, answerSdp: answer.sdp });
    }
    if (s.role === "a" && s.answerSdp && !pc.currentRemoteDescription) {
      await pc.setRemoteDescription({ type: "answer", sdp: s.answerSdp });
    }
    const remoteIce = JSON.parse((s.role === "a" ? s.iceJsonB : s.iceJsonA) || "[]") as RTCIceCandidateInit[];
    for (const c of remoteIce) {
      try {
        await pc.addIceCandidate(c);
      } catch {
        /* duplicate */
      }
    }
  }, [status]);

  useEffect(() => {
    if (status === "idle") return;
    const t = setInterval(() => void poll(), 1200);
    return () => clearInterval(t);
  }, [status, poll]);

  useEffect(() => () => stopMedia(), []);

  const toggleMic = () => {
    const nextMute = !muted;
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !nextMute;
    });
    setMuted(nextMute);
  };
  const toggleCam = () => {
    const next = !camOff;
    streamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !next;
    });
    setCamOff(next);
  };

  return (
    <div className="-mx-4 -mb-28 -mt-6 flex min-h-[100dvh] flex-col bg-ink-950 text-white lg:-mx-8 lg:-mb-8 lg:-mt-6">
      <div className="relative grid flex-1 grid-rows-2">
        <div className="relative overflow-hidden bg-ink-900">
          <video ref={remoteRef} autoPlay playsInline className="h-full w-full object-cover" />
          <p className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
            {status === "searching" ? "Searching…" : status === "connecting" ? "Connecting…" : "Other person"}
          </p>
        </div>
        <div className="relative overflow-hidden border-t border-white/10 bg-ink-800">
          <video ref={localRef} autoPlay muted playsInline className="h-full w-full object-cover" />
          <p className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
            You · identity hidden
          </p>
        </div>
      </div>
      {error ? <p className="bg-rose-600 px-4 py-2 text-sm">{error}</p> : null}
      {chatOpen ? (
        <p className="bg-black/70 px-4 py-3 text-sm text-white/80">
          In-call notes stay on-device for this session. Private chat unlocks after an accepted follow
          and plan access.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-4">
        {status === "idle" ? (
          <button type="button" className="btn-primary" onClick={() => void start()}>
            Start Random Video
          </button>
        ) : (
          <>
            <IconBtn label={muted ? "Unmute" : "Mute"} onClick={toggleMic}>
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </IconBtn>
            <IconBtn label={camOff ? "Camera on" : "Camera off"} onClick={toggleCam}>
              {camOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
            </IconBtn>
            <IconBtn
              label="Follow"
              onClick={() => {
                if (!peerId.current) return;
                void sendFollowRequestAction(peerId.current).then(() => setFollowState("sent"));
              }}
            >
              <UserPlus className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Chat" onClick={() => setChatOpen((v) => !v)}>
              <MessageCircle className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Next" onClick={() => void next()}>
              <SkipForward className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Report" onClick={() => void endRandomAction("report")}>
              <Flag className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="End" onClick={() => void end()}>
              <PhoneOff className="h-5 w-5" />
            </IconBtn>
          </>
        )}
      </div>
      {followState === "sent" ? (
        <p className="pb-4 text-center text-xs text-teal">Request sent · they see a masked name</p>
      ) : null}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
    >
      {children}
    </button>
  );
}
