import { FileInterface } from "./file.interface";
import { SubjectInterface } from "./subject.interface";
import { UserInterface } from "./user.interface";

export interface PaperInterface {
  id: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  customer: UserInterface;
  approved?: boolean;
  revision?: boolean;
  writer?: UserInterface;
  topic: string;
  instructions: string;
  format: string;
  deadline: number;
  paperTypeCode: number;
  noOfPages: number;
  spacing: 'double' | 'single';
  files?: FileInterface[];
  levelCode: number;
  mode: 'original' | 'editing' | 'rewriting';
  discipline: number;
  assigned: boolean;
  completionStatus?: 'partial' | 'complete';
  noOfCompletePages?: number;
  comment?: {
    comment: string;
    commentBy: {
      email: string;
      name: string;
      type: Partial<'writer' | 'customer' | 'admin'>;
    };
    createdAt: string;
  }[];
}
