export class WsClient {
  private reconnectDelay = 3000;
  private socket?: WebSocket;

  connect(url: string): void {
    this.socket = new WebSocket(url);
    this.socket.onclose = () => {
      setTimeout(() => this.connect(url), this.reconnectDelay);
    };
    // … остальная инициализация …
  }
}
