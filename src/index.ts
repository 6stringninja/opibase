import { Socket } from 'socket.io';

import configData from './config/config.json'
import { IConfig } from './config/IConfig';
import { OpiServerLaunch } from './server/Opi/OpiServerLaunch.js';
export const configApp = (configData as unknown) as IConfig;

console.log({configApp})
const Readline = require('@serialport/parser-readline')

 OpiServerLaunch();
 

//const server = new SerialServer();