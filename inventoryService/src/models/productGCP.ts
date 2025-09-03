import mongoose, { Document, Schema } from 'mongoose';
export interface ProductDoc extends Document {
    productDataTimestamp: Date;
    productId: string;
    merchantId: number;
    aggregatorId: number;
    offerId: string;
    title: string;
    description: string;
    link: string;
    mobileLink: string;
    imageLink: string;
    additionalImageLinks: string[];
    contentLanguage: string;
    targetCountry: string;
    feedLabel: string;
    channel: string;
    expirationDate: Date;
    googleExpirationDate: Date;
    adult: boolean;
    ageGroup: string;
    availability: string;
    availabilityDate: Date;
    brand: string;
    googleBrandId: string;
    color: string;
    condition: string;
    customLabels: {
        label0?: string;
        label1?: string;
        label2?: string;
        label3?: string;
        label4?: string;
    };
    gender: string;
    gtin: string;
    itemGroupId: string;
    material: string;
    mpn: string;
    pattern: string;
    price: {
        value: number;
        currency: string;
    };
    salePrice: {
        value: number;
        currency: string;
        effectiveStartDate: Date;
        effectiveEndDate: Date;
    };
    googleProductCategory: number;
    googleProductCategoryIds: number[];
    googleProductCategoryPath: string;
    productType: string;
    additionalProductTypes: string[];
    destinations: {
        name: string;
        status: string;
        approvedCountries: string[];
        pendingCountries: string[];
        disapprovedCountries: string[];
    }[];
    issues: {
        code: string;
        servability: string;
        resolution: string;
        attributeName: string;
        destination: string;
        shortDescription: string;
        detailedDescription: string;
        documentation: string;
        applicableCountries: string[];
    }[];
}

const ProductSchema: Schema<ProductDoc> = new Schema(
    {
        productDataTimestamp: { type: Date },
        productId: { type: String },
        merchantId: { type: Number },
        aggregatorId: { type: Number },
        offerId: { type: String },
        title: { type: String },
        description: { type: String },
        link: { type: String },
        mobileLink: { type: String },
        imageLink: { type: String },
        additionalImageLinks: [{ type: String }],
        contentLanguage: { type: String },
        targetCountry: { type: String },
        feedLabel: { type: String },
        channel: { type: String },
        expirationDate: { type: Date },
        googleExpirationDate: { type: Date },
        adult: { type: Boolean },
        ageGroup: { type: String },
        availability: { type: String },
        availabilityDate: { type: Date },
        brand: { type: String },
        googleBrandId: { type: String },
        color: { type: String },
        condition: { type: String },
        customLabels: {
            label0: { type: String },
            label1: { type: String },
            label2: { type: String },
            label3: { type: String },
            label4: { type: String },
        },
        gender: { type: String },
        gtin: { type: String },
        itemGroupId: { type: String },
        material: { type: String },
        mpn: { type: String },
        pattern: { type: String },
        price: {
            value: { type: Number },
            currency: { type: String },
        },
        salePrice: {
            value: { type: Number },
            currency: { type: String },
            effectiveStartDate: { type: Date },
            effectiveEndDate: { type: Date },
        },
        googleProductCategory: { type: Number },
        googleProductCategoryIds: [{ type: Number }],
        googleProductCategoryPath: { type: String },
        productType: { type: String },
        additionalProductTypes: [{ type: String }],
        destinations: [{
            name: { type: String },
            status: { type: String },
            approvedCountries: [{ type: String }],
            pendingCountries: [{ type: String }],
            disapprovedCountries: [{ type: String }],
        }],
        issues: [{
            code: { type: String },
            servability: { type: String },
            resolution: { type: String },
            attribute_name: { type: String },
            destination: { type: String },
            shortDescription: { type: String },
            detailedDescription: { type: String },
            documentation: { type: String },
            applicableCountries: [{ type: String }],
        }],
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<ProductDoc>('ProductGCP', ProductSchema);
