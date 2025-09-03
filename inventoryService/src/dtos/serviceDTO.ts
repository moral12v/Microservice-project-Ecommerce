export interface CreateServiceDTO {
    name: string;
    isActive: boolean;
    imageUrl?: string;
    perMonthPrice: number;
    perDayPrice: number;
}
    
    export interface UpdateServiceDTO {
    name?: string;
    isActive?: boolean;
    imageUrl?: string;
    perMonthPrice: number;
    perDayPrice: number;
}
    