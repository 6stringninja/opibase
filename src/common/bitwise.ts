export function bit_test(num:number, bit:number){
    return ((num>>bit) % 2 != 0)
}

export function bit_set(num:number, bit:number){
  
    return num | 1<<bit;
}

export function bit_clear(num:number, bit:number){
    return num & ~(1<<bit);
}

export function bit_toggle(num:number, bit:number){
    return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num, bit);
}
export function  bits_read(v:number,bitStart:number, length:number){
    if (v !== 0) {
        return (v & ((1 << length) - 1) << (bitStart - length + 1)) >> (bitStart - length + 1);
    }
    return 0;
}
export function bits_write(b:number,bitStart:number,length:number,data:number){
   
    let mask = ((1 << length) - 1) << (bitStart - length + 1);
    data <<= (bitStart - length + 1); // shift data into correct position
    data &= mask; // zero all non-important bits in data
    b &= ~(mask); // zero all important bits in existing byte
    b |= data; // combine data with existing byte
    return b;
}