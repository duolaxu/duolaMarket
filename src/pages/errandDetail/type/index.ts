export interface orderType {
    shopList: string;
    certificate: string;
    storeName: string;
    storeConnection: string;
    totalPrice: string;
    orderIndex: string;
    orderDate: string;
    orderPayType: string;
    remarks: string;
}

export interface paramsType {
    openId?: string;
    orderIndex?: number;
}