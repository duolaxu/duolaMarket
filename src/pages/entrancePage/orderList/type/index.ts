export interface orderProps {
    orderInfo: orderInfoType[];
}
export interface orderInfoType {
    orderDate: string;
    orderStatus: string;
    storeHeadImg: string;
    storeName: string;
    orderPrice: string;
    orderType?: string;
}