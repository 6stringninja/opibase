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