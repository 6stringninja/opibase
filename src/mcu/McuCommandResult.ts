import { OPI_COMMAND_E, OPI_RPC_E } from "./McuSerialParser";
import { bit_test, bit_set, bit_clear } from "../common/bitwise";
export class McuCommandResult {
    constructor(public command: OPI_COMMAND_E, public errorResult: OPI_RPC_E, public length: number, public buff?: Buffer) {
    }
}
export class McuCommandStreamSettings {

    constructor(public data = 0) {

    }
    private set_bit(b: boolean, n: number) {
        if (b) {
          this.data =  bit_set(this.data, n);
        } else {
          this.data =  bit_clear(this.data, n);
        }
        
    }
    get euler() { return bit_test(this.data, 0); }
    get quaternion() { return bit_test(this.data, 1); }
    get baro() { return bit_test(this.data, 2); }
    get rc() { return bit_test(this.data, 3); }
    get pwm() { return bit_test(this.data, 4); }

    set euler(v: boolean) { this.set_bit(v, 0); }
    set quaternion(v: boolean) { this.set_bit(v, 1); }
    set baro(v: boolean) { this.set_bit(v, 2); }
    set rc(v: boolean) { this.set_bit(v, 3); }
    set pwm(v: boolean) { this.set_bit(v, 4); }
}
/*
	bool euler : 1;
	bool quaternion : 1;
	bool baro : 1;
	bool rc : 1;
    bool pwm : 1;
    */