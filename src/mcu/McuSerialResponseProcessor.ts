import { ConcealedSubject } from "../rx/ConcealedSubject";
import { ConcealedBehaviorSubject } from "../rx/ConcealedBehaviorSubject";
import { Observable, Subscription } from "rxjs";
import { McuBnoEulerAxis, McuCommandResult, OPI_RPC_E, OPI_COMMAND_E } from "./McuSerialParser";
export class McuSerialResponseProcessor {
    private DeviceIdCs = new ConcealedBehaviorSubject<number>(0);
    sub: Subscription;
    get DeviceId$() {
        return this.DeviceIdCs.observable;
    }
    private BnoEulerEnableAxisStreamCs = new ConcealedBehaviorSubject<boolean>(false);
    get BnoEulerEnableAxisStream$() {
        return this.BnoEulerEnableAxisStreamCs.observable;
    }
    private BnoEulerAxisCs = new ConcealedBehaviorSubject<McuBnoEulerAxis>(new McuBnoEulerAxis());
    get BnoEulerAxis$() {
        return this.BnoEulerAxisCs.observable;
    }
    private CommandErrorCs = new ConcealedSubject<McuCommandResult>();
    get CommandError$() {
        return this.CommandErrorCs.observable;
    }
    private proccessCommandError(c: McuCommandResult) {
        // console.log({ commandErr: c });
    }
    constructor(private data?: Observable<McuCommandResult>) {
        if (data) {
            this.sub = data.subscribe(s => this.proccessCommand(s));
        }
    }
    private proccessCommand(c: McuCommandResult) {
        // console.log(c);
        if (c.errorResult !== OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS) {
            this.proccessCommandError(c);
        }
        switch (c.command) {
            case OPI_COMMAND_E.OPI_COMMAND_DEVICE_ID:
                this.DeviceIdCs.next(c.buff.readUInt8(0));
                break;
            case OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER:
                this.BnoEulerAxisCs.next(new McuBnoEulerAxis([
                    c.buff.readFloatLE(0),
                    c.buff.readFloatLE(4),
                    c.buff.readFloatLE(8)
                ], c.buff.readInt32LE(12)));
                break;
            case OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER_ENABLE_STREAM:
                this.BnoEulerEnableAxisStreamCs.next(!!c.buff.readUInt8(0));
                break;
            default:
                break;
        }
    }
}
