import { Injectable, NgZone } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { SecurityService } from "./security.service";
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket: Socket | null = null;
  private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();
  // Nuevo: subject público usado por componentes que esperan mensajes directos
  public callback: Subject<any> = new Subject<any>();
  // Nombre del evento al que estamos suscritos actualmente
  private currentEventName: string | null = null;

  constructor(
    private securityService: SecurityService,
    private ngZone: NgZone
  ) {}

  /**
   * Conecta al servidor WebSocket
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log("WebSocket ya está conectado");
      return;
    }

    const userId = this.securityService.activeUserSession?.email || "guest";

    // Forzamos 'polling' porque el backend puede no aceptar upgrades a WebSocket.
    const token = this.securityService.activeUserSession?.token;
    const options: any = {
      transports: ["polling"],
      query: {
        user_id: userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    };

    if (token) {
      options.auth = { token };
    }

    this.socket = io(environment.url_web_socket, options);

    this.socket.on("connect", () => {
      console.log("✅ WebSocket conectado:", this.socket?.id);
      // Si se definió un eventName antes de conectar, lo (re)adjuntamos
      if (this.currentEventName) {
        this.attachEventListener(this.currentEventName);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket desconectado:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión WebSocket:", error);
    });
  }

  /**
   * Establece el nombre del evento al que nos queremos suscribir.
   * Esto creará la conexión si no existe y adjuntará el listener correspondiente.
   */
  setNameEvent(eventName: string): void {
    this.currentEventName = eventName;

    // Asegurar que el socket esté conectado (connect() maneja reconexión)
    if (!this.socket || !this.socket.connected) {
      this.connect();
      // Si el socket aún no está conectado, attach se hará en el handler 'connect'
      return;
    }

    this.attachEventListener(eventName);
  }

  /**
   * Adjunta el listener para el evento dado, retirando el anterior si aplica.
   */
  private attachEventListener(eventName: string): void {
    if (!this.socket) return;

    // Quitar listener anterior si existía
    if (this.currentEventName && this.currentEventName !== eventName) {
      try {
        this.socket.off(this.currentEventName);
      } catch (e) {
        // ignore
      }
    }

    // Guardar el nombre actual y adjuntar
    this.currentEventName = eventName;
    this.socket.on(eventName, (data: any) => {
      this.ngZone.run(() => {
        console.log(`📩 Mensaje recibido en canal '${eventName}':`, data);
        this.messageSubject.next({ event: eventName, data });
        this.callback.next(data);
      });
    });
  }

  /**
   * Escucha eventos de un canal específico
   */
  listen(eventName: string): Observable<any> {
    return new Observable((observer) => {
      if (!this.socket) {
        observer.error("Socket no está conectado");
        return;
      }

      this.socket.on(eventName, (data: any) => {
        this.ngZone.run(() => {
          console.log(`📩 Mensaje recibido en canal '${eventName}':`, data);
          observer.next(data);
        });
      });

      // Cleanup cuando se desuscribe
      return () => {
        if (this.socket) {
          this.socket.off(eventName);
        }
      };
    });
  }

  /**
   * Emite un evento al servidor
   */
  emit(eventName: string, data: any = {}): void {
    if (!this.socket?.connected) {
      console.warn("Socket no conectado. No se puede emitir evento.");
      return;
    }
    console.log(`📤 Emitiendo evento '${eventName}':`, data);
    this.socket.emit(eventName, data);
  }

  /**
   * Desconecta el socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 WebSocket desconectado manualmente");
    }
  }

  /**
   * Verifica si el socket está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
