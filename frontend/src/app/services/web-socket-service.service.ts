import { EventEmitter, Injectable, NgZone } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";
import { SecurityService } from "./security.service";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket!: Socket;
  callback: EventEmitter<any> = new EventEmitter();
  nameEvent: string = "";

  constructor(
    private securityService: SecurityService,
    private ngZone: NgZone
  ) {
    const userId = securityService.activeUserSession?.email || ""; // Asegúrate de que no sea nulo
    this.socket = io(environment.url_web_socket, {
      query: {
        user_id: userId,
      },
    });
  }

  setNameEvent(nameEvent: string) {
    this.nameEvent = nameEvent;
    this.listen();
  }

  private listen() {
    this.socket.on(this.nameEvent, (res: any) => {
      // asegurar que la emisión suceda dentro del zone de Angular
      this.ngZone.run(() => this.callback.emit(res));
    });
  }

  emitEvent(payload: any = {}) {
    if (!this.nameEvent) return;
    this.socket.emit(this.nameEvent, payload);
  }

  disconnect() {
    try {
      this.socket.disconnect();
    } catch (e) {
      // ignore
    }
  }
}
