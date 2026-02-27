export interface EIP712TypedData {
    types: EIP712Types;
    domain: EIP712Object;
    message: EIP712Object;
    primaryType: string;
}

export interface EIP712Types {
    [key: string]: EIP712Parameter[];
}

export interface EIP712Parameter {
    name: string;
    type: string;
}

export type EIP712ObjectValue = string | number | EIP712Object;

export interface EIP712Object {
    [key: string]: EIP712ObjectValue;
}

export interface MessageTypes {
    [additionalProperties: string]: MessageTypeProperty[];
    EIP712Domain: MessageTypeProperty[];
}

export interface MessageTypeProperty {
    name: string;
    type: string;
}
