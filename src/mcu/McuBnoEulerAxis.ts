export class McuBnoEulerAxis {
    constructor(public data: number[] = [0, 0, 0], public timeStamp = 0) {
    }
    get X() {
        return this.data[0];
    }
    get Y() {
        return this.data[1];
    }
    get Z() {
        return this.data[2];
    }
}

export class McuRcData {
    channelMap =[0,1,2,3,4,5,6,7];
    constructor(public data: number[] = [], public chans = 8, public timeStamp = 0) {
        if(data.length===0){
            for (let index = 0; index < chans; index++) {
               data.push(1500);
                
            }
        }
    }
    get Roll() {
        return this.data[this.channelMap[0]];
    }
    get Pitch() {
        return this.data[this.channelMap[1]];
    }
    get Yaw() {
        return this.data[this.channelMap[2]];
    }
    get Throttle(){
        return this.data[this.channelMap[3]];
    }
    get Aux1(){
        return this.data[this.channelMap[3]];
    }
    get Aux2(){
        return this.data[this.channelMap[3]];
    }
    get Aux3(){
        return this.data[this.channelMap[3]];
    }
    get Aux4(){
        return this.data[this.channelMap[3]];
    }
}
