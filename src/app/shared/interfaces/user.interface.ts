import { FileInterface } from "./file.interface";
import { PaperDisciplineInterface } from "./paper-discipline.interface";

export interface UserInterface {
id: string;
name: string;
username: string;
profilePic?: string;
active: boolean;
type: 'customer' | 'writer' | 'admin';
roles: string[];
createdAt: string;
updatedAt?: string;
BillingInfo?: string[];
country: string;
state?: string;
county?: string;
phone?: string;
email: string;
commission?: number;
firebaseUid?: string;
papers?: string[];
samplePapers?: [{
  paperId: string;
  downloadUrl: string;
}];
confirmed: boolean;
approved: boolean;
registrationComplete: boolean;
lastLoginIp?: string;
packageId?: string;
completedOrders?: CompletedOrders[];
education?: EducationQualifications[];
writingStyles?: string[];
files?: FileInterface[];
preferredDisciplines?: PaperDisciplineInterface[];
}


export interface CompletedOrders {
  discipline: PaperDisciplineInterface;
  count: number;
}

export interface EducationQualifications {
  certificate: string;
  year: number;
  school: string;
}
