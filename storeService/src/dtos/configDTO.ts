export interface SortConfigDTO {
    _id?: string;
    key: string;
    title: string;
    selected?: boolean;
    defaultSelection?: boolean;
}

export interface FilterOptionDTO {
    value: string;
    label: string;
}

export interface FilterConfigDTO {
    _id:string;
    key: string;
    title: string;
    options: FilterOptionDTO[];
    selectType: string;
}

export interface CreateConfigDTO {
    modelKey: string;
    sortConfigs: SortConfigDTO[];
    filterConfigs: FilterConfigDTO[];
}

export interface UpdateConfigDTO {
    modelKey?: string;
    sortConfigs?: SortConfigDTO[];
    filterConfigs?: FilterConfigDTO[];
}
