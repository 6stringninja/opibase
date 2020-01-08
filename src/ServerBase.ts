import { createServer, Server } from 'http';
import express from 'express';
import socketIo = require('socket.io');
import { Subscription } from 'rxjs';
import { ConcealedBehaviorSubject } from './ConcealedBehaviorSubject';
import { ConcealedSubject } from './ConcealedSubject';
import { SocketServerMessages } from './SocketServerMessages';
import { AppConfig } from './config';
 
export  interface IServerClientState<TClientSocketState> {
    socket: SocketIO.Socket,
    state: TClientSocketState
    createState(): TClientSocketState
}
 export abstract class ServerClientState<TClientState> implements IServerClientState<TClientState> {
     state: TClientState;
     constructor(public socket: SocketIO.Socket,   public createState = ():TClientState =>null){
        this.state = createState();
     }

 }

export abstract class ServerBase<TClientState,TClientSocketState extends IServerClientState<TClientState>> {
 
    public app: express.Application;
    public server: Server;
    public io: SocketIO.Server; 
    public socketsState: TClientSocketState[] = [];

    // processor: ExchangeFetchProcessor;
    constructor( private createServerClientState = (socket: SocketIO.Socket):Promise<TClientSocketState>=>null, public port: string | number = "") {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        console.log("server started on port " + this.port);
        this.init();
    }
    private createApp(): void {
        this.app = express();
    }
    private createServer(): void {
        this.server = createServer(this.app);
    }
    private config(): void {
        this.port = this.port || AppConfig.http.port || process.env.PORT ;
    }
    private sockets(): void {
        this.io = socketIo(this.server);
    }
    private async getNewState(socket: SocketIO.Socket):Promise<TClientSocketState> {
        const tmp = await this.createServerClientState(socket);
        tmp.socket = socket;
        return tmp;
    }
     listen(): void {
   
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on(SocketServerMessages.connect, async (socket: SocketIO.Socket) => {
            //let sub: Subscription;
            const clientState = await this.getClientState(socket);
           
            await this.onConnect(clientState);
            this.onDisconnect(socket, clientState);
        });
    }
    private async onConnect(clientState: TClientSocketState) {
        await this.connect(clientState);
        await this.initClientMessages(clientState);
    }

    private async getClientState(socket: socketIo.Socket) {
        const clientState = await this.getNewState(socket);
        console.log("socket connected");
        this.socketsState.push(clientState);
        return clientState;
    }

    private onDisconnect(socket: socketIo.Socket, clientState: TClientSocketState) {
        socket.on(SocketServerMessages.disconnect, async () => {
            // sub.unsubscribe();
            console.log("disconnect");
            await this.disconnect(clientState);
            this.socketsState = this.socketsState.splice(this.socketsState.findIndex(s => s.socket === socket), 1);
        });
    }

    abstract init():void;
    abstract connect(state:TClientSocketState): Promise<void>;
    abstract initClientMessages(state:TClientSocketState): Promise<void>;
    abstract disconnect(state:TClientSocketState): Promise<void>;
    
}
