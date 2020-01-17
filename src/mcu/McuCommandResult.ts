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
    get imu_orientation_calc() { return bit_test(this.data, 0); }
    get imu_orientation_bno() { return bit_test(this.data, 1); }
    get imu_acceleration() { return bit_test(this.data, 2); }
    get imu_rotation() { return bit_test(this.data, 3); }
    get imu_magnet() { return bit_test(this.data, 4); }
    get imu_quaternion() { return bit_test(this.data, 5); }
    get baro_altitude() { return bit_test(this.data, 6); }
    get rc() { return bit_test(this.data, 7); }
    get ppm() { return bit_test(this.data, 8); }

    set imu_orientation_calc(v: boolean) { this.set_bit(v, 0); }
    set imu_orientation_bno(v: boolean) { this.set_bit(v, 1); }
    set imu_acceleration(v: boolean) { this.set_bit(v, 2); }
    set imu_rotation(v: boolean) { this.set_bit(v, 3); }
    set imu_magnet(v: boolean) { this.set_bit(v, 4); }
    set imu_quaternion(v: boolean) { this.set_bit(v, 5); }
    set baro_altitude(v: boolean) { this.set_bit(v, 6); }
    set rc(v: boolean) { this.set_bit(v, 7); }
    set ppm(v: boolean) { this.set_bit(v, 8); }
}
/*
bool imu_orientation_calc : 1;
	bool imu_orientation_bno : 1;
	bool imu_acceleration : 1;
	bool imu_rotation : 1;
	bool imu_magnet : 1;
	bool imu_quaternion : 1;
	bool baro_altitude : 1;
	bool rc : 1;
	bool ppm : 1;
    */