
export interface CreatePlanDTO {
    planName: string;
    benefits:[string];
    price: number;
    gst: number;
    durationInDays: number;
    color: string;
    planFor: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface UpdatePlanDTO {
    planName: string;
    benefits:[string];
    price: number;
    gst: number;
    durationInDays: number;
    color: string;
    planFor: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
