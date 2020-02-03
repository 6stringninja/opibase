import { bit_test } from "./bitwise";


export function GetAllEnumVals<T>(e:any):T[]{
   const v=  Object.keys(e).map(m=> e[m] as T);
    const r:T[]=[];
for (let index = v.length/2; index < v.length; index++) {
    r.push(v[index] as T);
    
}
    return r;
}
export function GetAllEnumNames<T>(e:any):string[]{
    const v=  Object.keys(e).map(m=> e[m] );
     const r:string[]=[];
 for (let index = 0; index < v.length/2; index++) {
     r.push(v[index]);
     
 }
     return r;
 }