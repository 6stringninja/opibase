import { ConcealedBehaviorSubject } from './ConcealedBehaviorSubject';
import SerialPort from 'serialport';
import { Observable, Subject } from 'rxjs';
import { ConcealedSubject } from './ConcealedSubject';
 
const Readline = require('@serialport/parser-readline')
export class UartPort {
   private serialPort: SerialPort;
   private  serialOpenStatusCbs: ConcealedBehaviorSubject<boolean>;
    onOpenStatus$: Observable<boolean>;

    serialErrorCss: ConcealedSubject<Object>;
    onErrors$: Observable<Object>;
    serialJsonMsgs: ConcealedSubject<Object>;
    onJsonMsg$: Observable<Object>;
    serialMsgs: ConcealedSubject<string>;
    onMsg$: Observable<string>;
  

 
/*
   private  serialJsonMsgs = new ConcealedSubject<Object>();
    onJsonMsg$ = this.serialJsonMsgs.observable;

   private  serialMsgs = new ConcealedSubject<string>();
   onMsg$ = this.serialMsgs.observable;
  
 */
    public get isOpen(): boolean {
        return !!this.serialPort && this.serialPort.isOpen;
    }
    public Open():void{
        if(!this.isOpen){
            this.createUart();
        }
    }
    public Close():void{
        if(this.isOpen){
            this.serialPort.close();
        }
    }
   
    constructor(public portName: string, public autoOpen = false, public baudRate: number = 9600) {

        this.serialOpenStatusCbs = new ConcealedBehaviorSubject<boolean>(false);
   this.onOpenStatus$  = this.serialOpenStatusCbs.observable
   this.serialErrorCss = new  ConcealedSubject<Object>();
   this.onErrors$ = this.serialErrorCss.observable;
   
   this.serialJsonMsgs = new ConcealedSubject<Object>();
   this.onJsonMsg$ = this.serialJsonMsgs.observable;
   this.serialMsgs = new ConcealedSubject<string>();
   this.onMsg$ = this.serialMsgs.observable;
   this.createErrorHandling();
        this.createUart();
    }
    private createErrorHandling() {
        if(!this.serialErrorCss){
            this.serialErrorCss = new ConcealedSubject<Object>();
            this.onErrors$ = this.serialErrorCss.observable;
        }

    }

    private createUart() {
        console.log(this.portName);
        this.serialPort = new SerialPort(this.portName,
            { autoOpen: this.autoOpen, baudRate: this.baudRate },

            function (err) {
                if (err) {
                  
                  this.createErrorHandling();
                    console.log(this.serialErrorCss)
                    this.serialErrorCss.next(err);
                    return console.log('Error: ', err.message)
                }
            }
        );
        /*
        // error
        this.serialPort.on('error', function(err) {
            this.serialErrorCss.next(err);
          })
        // open
        this.serialPort.on('open', function () {
            this.serialOpenStatusCbs.next(true);
        });
        // close
        serialPort.on('close', function () {
            this.serialOpenStatusCbs.next(false);
        });

        // data
        const lineStream = serialPort.pipe(new Readline())
        lineStream.on('data', (data) => {
            try {
                let json = JSON.parse(data);
                if (json) {
                    console.log(json);
                    this.serialJsonMsgs.next(json);

                }
            } catch (error) {
                this.serialMsgs.next(data);
                
            }
        });*/
    }
}
