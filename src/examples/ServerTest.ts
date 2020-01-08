import { ServerClientState, ServerBase } from "../ServerBase";

export class TestServerState extends ServerClientState<string>{

    constructor(public socket: SocketIO.Socket){
        super(socket,()=>"new state")
    }
}
export class TestServer extends ServerBase<string,TestServerState>{
    constructor(){
        super((socket: SocketIO.Socket)=>{
            return this.getTestServerState(socket);
        })
    }
    private getTestServerState(socket) {
        const prm = new Promise<TestServerState>((r) => {
            r(new TestServerState(socket));
        });
        return prm;
    }

    init(): void {
        console.log({m:"test init" });
        return;
    }    
    connect(state: TestServerState): Promise<void> {
      //  console.log({m:"test connect",state:state});
        return;
    }
    initClientMessages(state: TestServerState): Promise<void> {
       
        state.socket.on("test", async (d) => {
            // sub.unsubscribe();
            console.log("test sent rec");
            console.log(d);
            this.io.emit("test",d);
            
        });
       // console.log({m:"test initClientMessages",state:state});
        return;
    }
    disconnect(state: TestServerState): Promise<void> {
     //   console.log({m:"test disconnect",state:state});
        return;
    }
}
import io from 'socket.io-client';
import { AppConfig } from "../config";
 
setTimeout(()=>{
    console.log("here")
    const socket = io(`http://localhost:${AppConfig.http.port}`);
    socket.on('error', (error) => {
        console.log(error);
      });
socket.on('connect', function(){ socket.emit("test","testsend");  console.log("connect")});
socket.on('test', (d)=>{console.log({m:"client in",d})});
socket.on('event', function(data){console.log("data")});
socket.on('disconnect', function(){});
},1000)

const ts = new TestServer();

