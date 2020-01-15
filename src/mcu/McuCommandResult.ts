import { OPI_COMMAND_E, OPI_RPC_E } from "./McuSerialParser";
export class McuCommandResult {
    constructor(public command: OPI_COMMAND_E, public errorResult: OPI_RPC_E, public length: number, public buff?: Buffer) {
    }
}
