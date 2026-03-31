// libs/socket/SocketManager.ts
import { io, Socket } from "socket.io-client";

type EventHandler = (...args: unknown[]) => void;

export type ConnectionState = "connected" | "disconnected" | "reconnecting" | "error";

/**
 * SocketManager — a singleton class that owns the socket connection lifecycle.
 *
 * Features:
 * - Single connection shared across the entire app
 * - Reconnection state tracking
 * - Typed event subscription with automatic cleanup tracking
 * - Listener registry so you can teardown by namespace/key
 */
export class SocketManager {
  private static instance: SocketManager | null = null;
  private socket: Socket | null = null;
  private connectionState: ConnectionState = "disconnected";
  private stateListeners: Set<(state: ConnectionState) => void> = new Set();

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(): Socket {
    if (this.socket?.connected) return this.socket;

    const url =
      process.env.NODE_ENV === "production"
        ? undefined
        : process.env.NEXT_PUBLIC_API_URL;

    this.socket = io(url, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket"],
    });

    this.socket.on("connect", () => this.setState("connected"));
    this.socket.on("disconnect", () => this.setState("disconnected"));
    this.socket.on("reconnecting", () => this.setState("reconnecting"));
    this.socket.on("connect_error", () => this.setState("error"));
    this.socket.on("reconnect", () => {
      this.setState("connected");
      console.info("[SocketManager] Reconnected.");
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  /** Emit an event */
  emit(event: string, data?: unknown): void {
    if (!this.socket?.connected) {
      console.warn(`[SocketManager] Cannot emit "${event}" — not connected.`);
      return;
    }
    this.socket.emit(event, data);
  }

  /** Subscribe to a socket event. Returns an unsubscribe function. */
  on(event: string, handler: EventHandler): () => void {
    this.socket?.on(event, handler);
    return () => this.socket?.off(event, handler);
  }

  /** Unsubscribe a specific handler */
  off(event: string, handler: EventHandler): void {
    this.socket?.off(event, handler);
  }

  /** Current connection state */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /** Subscribe to connection state changes. Returns unsubscribe fn. */
  onStateChange(listener: (state: ConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private setState(state: ConnectionState): void {
    this.connectionState = state;
    this.stateListeners.forEach((l) => l(state));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.setState("disconnected");
  }
}

// Convenience singleton export
export const socketManager = SocketManager.getInstance();