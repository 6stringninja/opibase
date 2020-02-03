import { Socket } from 'socket.io';

import configData from './config/config.json'
import { IConfig } from './config/IConfig';
import { OpiServerLaunch } from './server/Opi/OpiServerLaunch';
import { BuildEnumArray, McuResponseType, EnumeratedConcealedBehaviorSubject, CommandResponseBehaviorSubjects } from './mcu/McuSerialResponseProcessor';
import { OPI_COMMAND_E } from './mcu/McuSerialParser';
import { McuImuVector } from './mcu/McuImuVector';
export const configApp = (configData as unknown) as IConfig;

console.log({configApp})
const Readline = require('@serialport/parser-readline')
const eb = BuildEnumArray<OPI_COMMAND_E,McuResponseType>(OPI_COMMAND_E as any,(e)=> new EnumeratedConcealedBehaviorSubject(e,null));
const abc = new CommandResponseBehaviorSubjects();
const bcd = abc.getMember(OPI_COMMAND_E.OPI_COMMAND_DEVICE_IMU_ORIENTATION_EULER_FROM_QUATERNIONS);
 const dd = abc.setMember<McuImuVector>(OPI_COMMAND_E.OPI_COMMAND_DEVICE_IMU_ORIENTATION_EULER_FROM_QUATERNIONS,new McuImuVector());
 
 
 OpiServerLaunch();
 

//const server = new SerialServer();