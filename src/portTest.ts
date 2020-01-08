import { UartPort } from "./UartPort";

const prt = new UartPort("COM30",true);
prt.onOpenStatus$.subscribe((b)=>{
    console.log({onOpenStatus:b})
})
prt.Open();