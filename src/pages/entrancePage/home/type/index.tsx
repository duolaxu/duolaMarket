export interface storeProps {
    cateringLicense: string;
    merchantId: number;
    storeBusinessImg: string;
    storeConnection: string;
    storeHeadImg: string;
    storeId: number;
    storeIncome: string;
    storeLocation: string;
    storeName: string;
    storeOpeningHours: string;
    storeState: string;
}

export interface storeComponentProps {
    storeData: storeProps;
}