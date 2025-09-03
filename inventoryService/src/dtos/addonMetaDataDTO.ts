import { Types } from "mongoose";

export interface CreateAddonMetaDataDTO {
    groupName: string;
    minSelection: number;
    maxSelection: number;
    addon: Types.ObjectId[];
    merchantId:string;
}

export interface UpdateAddonMetaDataDTO{
    groupName: string;
    minSelection: number;
    maxSelection: number;
    addon: Types.ObjectId[]
    merchantId:string;
}

