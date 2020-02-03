/*import { ModelIdEnum, ModelIdEnumReturnTypes } from './models/ModelTypes';





type ValueOf<T> = T [keyof T]
type KeyOf<T> = keyof T

export   function getNewModel<K extends ModelIdEnum>(  key: K  ):  ModelIdEnumReturnTypes[K] {
    let  dd=   ModelDefaults[key]() 
    return dd as ModelIdEnumReturnTypes[K] ;
}

// example
export   function setModel<K extends ModelIdEnum>(  key: K , val:ModelIdEnumReturnTypes[K]):  ModelIdEnumReturnTypes[K] {
    return;
}
setModel(ModelIdEnum.Altitude,new ModelAltitude());

export type ModelID_Value<T extends ModelIdEnum> = T;
 
export type Model_d <T extends ModelIdEnum,K extends keyof ModelIdEnumReturnTypes[T]> = ModelIdEnumReturnTypes[T][K];
export type Model_ReturnType<T extends ModelIdEnum,K extends keyof ModelIdEnumReturnTypes[T]> = ModelIdEnumReturnTypes[T][K]

export type Model_Value<T extends ModelIdEnum> = ModelIdEnumReturnTypes[T];
export type Model_Property<T extends ModelIdEnum> = KeyOf<Model_Value<T>>
*/

 