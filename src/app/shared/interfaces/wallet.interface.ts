import { UserInterface } from "./user.interface";

export interface WalletInterface {
  id: string;
  user: UserInterface;
  balance: number;
}
