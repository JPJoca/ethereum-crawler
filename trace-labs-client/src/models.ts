export interface Data {
    blockHash: string;
    blockNumber: string;
    from: string;
    to: string;
    value: string;
    gasUsed:string;
    gasPrice:string;
    timeStamp: string;

}
export interface EthBalanceResponse {
    startBlock: number;
    date: string;
    balance: number;
    address: string;
}