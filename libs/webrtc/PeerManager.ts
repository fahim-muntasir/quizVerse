// libs/webrtc/PeerManager.ts
import { socketManager } from "@/libs/socket/index";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export type PeerEventType = "track" | "connected" | "disconnected" | "failed";
export type PeerEventHandler = (socketId: string, event?: RTCTrackEvent) => void;

/**
 * PeerManager — owns all RTCPeerConnections for a single room session.
 *
 * Create one instance per room join. Destroy it on leave.
 * This avoids the module-level global state anti-pattern.
 */
export class PeerManager {
  private peers: Map<string, RTCPeerConnection> = new Map();
  private remoteAudioElements: Map<string, HTMLAudioElement> = new Map();
  private eventHandlers: Map<PeerEventType, Set<PeerEventHandler>> = new Map();

  constructor(private readonly roomId: string) {}

  on(event: PeerEventType, handler: PeerEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    return () => this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: PeerEventType, socketId: string, data?: RTCTrackEvent) {
    this.eventHandlers.get(event)?.forEach((h) => h(socketId, data));
  }

  createConnection(socketId: string, stream: MediaStream | null): RTCPeerConnection {
    if (this.peers.has(socketId)) return this.peers.get(socketId)!;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    pc.ontrack = (event) => {
      this.attachRemoteAudio(socketId, event.streams[0]);
      this.emit("track", socketId, event);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketManager.emit("ice-candidate", {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === "connected") this.emit("connected", socketId);
      if (state === "disconnected") this.emit("disconnected", socketId);
      if (state === "failed") {
        this.emit("failed", socketId);
        console.warn(`[PeerManager] Connection failed with ${socketId}. Cleaning up.`);
        this.closeConnection(socketId);
      }
    };

    this.peers.set(socketId, pc);
    return pc;
  }

  async addTracksToConnection(socketId: string, stream: MediaStream): Promise<void> {
    const pc = this.peers.get(socketId);
    if (!pc) return;

    const senders = pc.getSenders();
    stream.getTracks().forEach((track) => {
      const exists = senders.some((s) => s.track === track);
      if (!exists) pc.addTrack(track, stream);
    });
  }

  async createOffer(socketId: string): Promise<void> {
    const pc = this.peers.get(socketId);
    if (!pc) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketManager.emit("offer", { to: socketId, offer });
  }

  async handleOffer(
    socketId: string,
    offer: RTCSessionDescriptionInit,
    stream: MediaStream | null
  ): Promise<void> {
    let pc = this.peers.get(socketId);
    if (!pc) pc = this.createConnection(socketId, stream);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketManager.emit("answer", { to: socketId, answer });
  }

  async handleAnswer(socketId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peers.get(socketId);
    if (pc?.signalingState === "have-local-offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async handleIceCandidate(socketId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const pc = this.peers.get(socketId);
    if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  async renegotiateAll(stream: MediaStream): Promise<void> {
    for (const socketId of this.peers.keys()) {
      await this.addTracksToConnection(socketId, stream);
      await this.createOffer(socketId);
    }
  }

  closeConnection(socketId: string): void {
    this.peers.get(socketId)?.close();
    this.peers.delete(socketId);

    const audio = this.remoteAudioElements.get(socketId);
    if (audio) {
      (audio.srcObject as MediaStream | null)?.getTracks().forEach((t) => t.stop());
      audio.parentNode?.removeChild(audio);
      this.remoteAudioElements.delete(socketId);
    }
  }

  closeAll(): void {
    for (const socketId of this.peers.keys()) {
      this.closeConnection(socketId);
    }
    this.eventHandlers.clear();
  }

  hasPeer(socketId: string): boolean {
    return this.peers.has(socketId);
  }

  getPeerCount(): number {
    return this.peers.size;
  }

  private attachRemoteAudio(socketId: string, stream: MediaStream): void {
    // Remove stale element if exists
    const existing = this.remoteAudioElements.get(socketId);
    if (existing) {
      existing.srcObject = null;
      existing.parentNode?.removeChild(existing);
    }

    const audio = document.createElement("audio");
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.id = `remote-audio-${socketId}`;
    document.body.appendChild(audio);
    this.remoteAudioElements.set(socketId, audio);
  }
}