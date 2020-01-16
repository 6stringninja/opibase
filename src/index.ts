import { Socket } from 'socket.io';

import configData from './config/config.json'
import { IConfig } from './config/IConfig';
import { OpiServerLaunch } from './server/Opi/OpiServerLaunch.js';
import { BuildEnumArray, responseType, EnumeratedConcealedBehaviorSubject, CommandResponseBehaviorSubjects } from './mcu/McuSerialResponseProcessor.js';
import { OPI_COMMAND_E } from './mcu/McuSerialParser.js';
import { McuBnoEulerAxis } from './mcu/McuBnoEulerAxis.js';
export const configApp = (configData as unknown) as IConfig;

console.log({configApp})
const Readline = require('@serialport/parser-readline')
const eb = BuildEnumArray<OPI_COMMAND_E,responseType>(OPI_COMMAND_E as any,(e)=> new EnumeratedConcealedBehaviorSubject(e,null));
const abc = new CommandResponseBehaviorSubjects();
const bcd = abc.getMember(OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER);
 const dd = abc.setMember<McuBnoEulerAxis>(OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER,new McuBnoEulerAxis());
 
 
 //OpiServerLaunch();
 

//const server = new SerialServer();