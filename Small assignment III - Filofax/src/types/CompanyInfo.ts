import { IndividualInfo } from './IndividualInfo';

export interface CompanyInfo {
    phoneNumber: string;
    industry: string;
    email: string;
    address: string;
    website: string;
    keyContacts: IndividualInfo[];
}