import { ConcealedSubject } from "../rx/ConcealedSubject";
import { ConcealedBehaviorSubject } from "../rx/ConcealedBehaviorSubject";
import { Observable, Subscription } from "rxjs";
import { OPI_RPC_E, OPI_COMMAND_E } from "./McuSerialParser";
import { McuBnoEulerAxis, McuRcData } from "./McuBnoEulerAxis";
import { McuCommandResult, McuCommandStreamSettings } from "./McuCommandResult";
export type responseType = McuCommandStreamSettings | McuBnoEulerAxis  | McuRcData | number | string
 
export class EnumeratedConcealedBehaviorSubject<TENUM,TBS>  extends ConcealedBehaviorSubject<TBS>{
   
    public enumVal:TENUM;
    constructor(e:TENUM,v:TBS){
        super( v);
        this.enumVal = e;
    }
}
export function BuildEnumArray<TENUM, T>(enm: any, defVal = (e: TENUM): EnumeratedConcealedBehaviorSubject<TENUM, T> => null): EnumeratedConcealedBehaviorSubject<TENUM, T>[] {
    const keys = Object.keys(enm);
    const len = keys.length / 2;
    const arry: EnumeratedConcealedBehaviorSubject<TENUM, T>[] = [];
    for (let index = 0; index < len; index++) {
        const keyname = keys[index+len];
       arry.push(defVal(enm[keyname] as TENUM));
    }
   
    return arry;
}
export class EnumeratedConcealedBehaviorSubjects<TENUM,T>  {
    keys: string[];
    len: number;
    arry: EnumeratedConcealedBehaviorSubject<TENUM, T>[] =[];
   
    constructor(enm: any, defVal = (e: TENUM): EnumeratedConcealedBehaviorSubject<TENUM, T> => null){
        this.keys = Object.keys(enm);
        this.len = this.keys.length / 2;
       
        for (let index = 0; index < this.len; index++) {
            const keyname = this.keys[index+this.len];
           this.arry.push(defVal(enm[keyname] as TENUM));
        }

    }
    getMember(w:TENUM){
        return this.arry.find(f=> f.enumVal===w);
    }
    setMember<TT extends T>(w:TENUM,v:TT):EnumeratedConcealedBehaviorSubject<TENUM, TT>{
     const r  =    this.arry[this.arry.findIndex(f=> f.enumVal==w)] = new EnumeratedConcealedBehaviorSubject<TENUM, TT>(w,v);
     return r;
    }
}
export class CommandResponseBehaviorSubjects extends EnumeratedConcealedBehaviorSubjects<OPI_COMMAND_E,responseType>{
    constructor(){
        super(OPI_COMMAND_E,(e)=> new EnumeratedConcealedBehaviorSubject(e,null));
    }
}
export class McuSerialResponseProcessor {
    private DeviceIdCs = new ConcealedBehaviorSubject<number>(0);
    sub: Subscription;
    responseBsArray: responseType []=[];
    crbs = new CommandResponseBehaviorSubjects();
    get DeviceId$() {
        return this.DeviceIdCs.observable;
    }
    private BnoEulerEnableAxisStreamCs = this.crbs.setMember<McuCommandStreamSettings>(OPI_COMMAND_E.OPI_COMMAND_STREAM_SETTINGS,new McuCommandStreamSettings())
    get BnoEulerEnableAxisStream$() {
        return this.BnoEulerEnableAxisStreamCs.observable;
    }
    private BnoEulerAxisCs = this.crbs.setMember(OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER,new McuBnoEulerAxis())
    get BnoEulerAxis$() {
        return this.BnoEulerAxisCs.observable;
    }
    private RcDataCs = this.crbs.setMember(OPI_COMMAND_E.OPI_COMMAND_DEVICE_RC_DATA,new McuRcData())
    get RcData$() {
        return this.RcDataCs.observable;
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
       const keys = Object.keys(OPI_COMMAND_E);

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
                case OPI_COMMAND_E.OPI_COMMAND_DEVICE_RC_DATA:
                    this.RcDataCs.next(new McuRcData([
                        c.buff.readInt16LE(0),
                        c.buff.readInt16LE(2),
                        c.buff.readInt16LE(4),
                        c.buff.readInt16LE(6),
                        c.buff.readInt16LE(8),
                        c.buff.readInt16LE(10),
                        c.buff.readInt16LE(12),
                        c.buff.readInt16LE(14),
                    ]));
                    break;
            case OPI_COMMAND_E.OPI_COMMAND_STREAM_SETTINGS:
                this.BnoEulerEnableAxisStreamCs.next(new McuCommandStreamSettings(c.buff.readUInt8(0)));
                break;
            default:
                break;
        }
    }
}
