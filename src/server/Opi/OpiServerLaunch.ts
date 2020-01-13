import SerialPort from 'serialport';
import { OpiServer } from './OpiServer.js';
import { OpiUartFunction } from "./OpiUartFunction";
import os from "os";
import { OptPlatform } from './OptPlatform';
import { configApp } from '../../index';
export function OpiServerLaunch() {
  const optPlatform = new OptPlatform();
  const hostName = os.hostname();
  const platform = os.platform();
  optPlatform.hostname = hostName;
  optPlatform.platform = platform;
  let configHost = configApp.hosts.find(f => f.platform.toLowerCase() === platform.toLowerCase());
  if (!configHost) {
    configHost = configApp.hosts.find(f => f.platform === "Linux");
  }
  optPlatform.mcuUart = configHost.uarts.find(s => s.portFunction === OpiUartFunction.MCU.toString() && s.enabled);
  optPlatform.gpsUart = configHost.uarts.find(s => s.portFunction === OpiUartFunction.GPS.toString() && s.enabled);
  optPlatform.telsUart = configHost.uarts.find(s => s.portFunction === OpiUartFunction.TEL.toString() && s.enabled);
  console.log("it worked");
  console.log({ hostName, platform });
  SerialPort.list().then((port) => {
    console.log({});
    console.log("Port: ", port);
    console.log({ platform, hostName });
    optPlatform.ports = port;
    console.log({ mcu: optPlatform.hasMcu, gps: optPlatform.hasGps, tel: optPlatform.hasTel });
    const ts = new OpiServer(optPlatform);
  });
}
