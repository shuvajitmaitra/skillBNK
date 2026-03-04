// Define an interface for the nested "data" object
export interface TCompanyData {
  email: string;
  postalAddress: string;
  companyUrl: string;
  phone: string;
  faxNumber: string;
  taxNumber: string;
  contactPerson: string;
  companyLogo: string;
  companyDocument: string;
  otherDocument: string;
  about: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

// Define an interface for the overall company object
export interface TCompany {
  data: TCompanyData;
  _id: string;
  name: string;
  slug: string;
}
// Interface for the address object
export interface TAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

// Interface for a contact object
export interface TContact {
  name: string;
  email: string;
  phone: string;
}

// Interface for social links
export interface TSocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  github: string;
}

// Interface for the nested "data" object within each branch
export interface TBranchData {
  address: TAddress;
  firstContact: TContact;
  secondContact: TContact;
  socialLinks: TSocialLinks;
  faxNumber: string;
  taxNumber: string;
  about: string;
  phone: string;
  branchLogo: string;
  branchDocument: string;
  otherDocument: string;
  branchUrl: string;
}

// Interface for the overall branch/company object
export interface TBranch {
  data: TBranchData;
  _id: string;
  name: string;
  slug: string;
}
