export type TOrganization = {
  data: TData;
  _id: string;
  name: string;
  slug: string;
};

export type TData = {
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
};
