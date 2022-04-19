export default interface Transaction {
  username: string;
  shareName: string;
  amount: number;
  price: number;
  unitsInStockNow: number;
  isUserBuy: boolean;
  timestamp: string;
}
