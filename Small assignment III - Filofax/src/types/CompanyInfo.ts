import { IndividualInfo } from './IndividualInfo';

export interface CompanyInfo {
    phoneNumber: string;
    industry: string;
    emailAddress: string;
    address: string;
    website: string;
    keyContacts: IndividualInfo[];
}