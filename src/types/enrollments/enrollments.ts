// Organization types
export interface OrganizationData {
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

export interface Organization {
  data: OrganizationData;
  _id: string;
  name: string;
  slug: string;
}

// Branch types
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  github: string;
}

export interface BranchData {
  address: Address;
  firstContact: Contact;
  secondContact: Contact;
  socialLinks: SocialLinks;
  faxNumber: string;
  taxNumber: string;
  about: string;
  phone: string;
  branchLogo: string;
  branchDocument: string;
  otherDocument: string;
  branchUrl: string;
}

export interface Branch {
  data: BranchData;
  _id: string;
  name: string;
  slug: string;
}

// Program types
// Notice that in one record, program.instructor is an object and in another it’s a string.
// Here we model it as a union.
export interface Instructor {
  about?: string;
  image?: string | null;
  _id: string;
  name: string;
}

export interface Program {
  _id: string;
  title: string;
  instructor: Instructor | string;
  type: string;
}

// Session type
export interface Session {
  _id: string;
  name: string;
}

// Form steps types

export interface Option {
  value: string;
}

export interface Field {
  options: Option[];
  children: string[];
  _id: string;
  id: string;
  icon: string;
  label: string;
  isDefault: boolean;
  isRequired: boolean;
  type: string;
  description: string;
  // Some fields may have additional properties:
  isMulti?: boolean;
  defaultValue?: string;
  // 'value' can be of different types (string, number, boolean, or even an array)
  value?: any;
}

export interface Row {
  _id: string;
  label: string;
  icon: string;
  type: string;
  id: string;
  fields: Field[];
}

export interface FormStepData {
  _id: string;
  label: string;
  icon: string;
  type: string;
  id: string;
  rows: Row[];
}

// The top-level Application (or Form Submission) type

export interface IEnrollment {
  status: string;
  _id: string;
  totalAmount: number;
  user: string;
  organization: Organization;
  branch: Branch;
  program: Program;
  session: Session;
  formStepsData: FormStepData[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  activeTill: any; // this might be null or a date string, adjust as needed
  id: string;
  totalPaid?: number;
}
