
import { GetAllEnumVals, GetAllEnumNames } from "../utility/Bitwise/enum-functions";
import { IIdTimeStamp, IUseEvent } from "./Interfaces";
import { ModelIdEnum, ModelDefaults } from './models/ModelTypes';
import e = require('express');
import { ServiceTypesEnumId, ServiceBase, ServiceEvent,ServiceBaseEventIdTypes } from './services/ServiceBase';
import _ from 'lodash';


export function GenerateDataTypes() {
  return GetAllEnumVals<ModelIdEnum>(ModelIdEnum).map(f => {

  });
}
export function GetModel(modelId: ModelIdEnum) {

  return ModelDefaults[modelId]()

}

export function GetModels() {
  return GetAllEnumVals<ModelIdEnum>(ModelIdEnum).map(f => {

    return ModelDefaults[f]()
  });
}

export function GetTimeStamp() {
  return new Date().getTime();;
}

export function SetIdAndTimeStamp(value: IIdTimeStamp) {
  //value.id = GetId(value.idType);
  value.timestamp = GetTimeStamp();
}
export const SequenceSeed = [0];
export function SetEventSequence(e: IUseEvent) {
  e.sequence = SequenceSeed[0]++;
}

export function GetEnumLength(enm: any) {
  const len = Object.keys(enm).length;
  return len ? len / 2 : 0;
}
export function GetValsMissingFromEnums(a: any, b: any) {
  const chk = {
    a:
    {
      keys: GetAllEnumNames(a),
      vals: GetAllEnumVals(a),
      rslts: []
    },
    b:
    {
      keys: GetAllEnumNames(b),
      vals: GetAllEnumVals(b),
      rslts: []
    }
  }
  chk.a.vals.forEach((f, i) => {
    if (!b.vals.some(s => s === f)) {
      b.push({ name: chk.a.keys[i], val: f });
    }
  })
  chk.b.vals.forEach((f, i) => {
    if (!a.vals.some(s => s === f)) {
      a.push({ name: chk.b.keys[i], val: f });
    }
  })
  return chk;
}
export function EnumCombinerToFakeEnum(enms:[]){
const names =[];
const vals = [];

enms.forEach((e,i)=>{
  const nms = GetAllEnumNames(e);
  const vls = GetAllEnumVals(e);
  let ofset = 0;
  for (let index = 0; index < vls.length; index++) {

    const indexa =   index + ofset;
    names[indexa ] 
  }
  ofset += vls.length-1;
})
  let fakeEnum = {};
  names.forEach((f,i)=>{
 
      fakeEnum[Number(vals[i]) as number]=f;
  })
  names.forEach((f,i)=>{
      fakeEnum[f]=vals[i];
     
  })

}
const IdsForServices = [];
export function GetIdForService(serviceId?: ServiceTypesEnumId) {
  const index = serviceId ? Number(serviceId) : 0;
  IdsForServices[index] = IdsForServices[index] ? ++IdsForServices[index] : 1;
   
  return IdsForServices[index];
}
 

