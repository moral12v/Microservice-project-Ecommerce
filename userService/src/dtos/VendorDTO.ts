export interface CreateVendorDTO {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  comparePassword:string;
  language?: string;
  currentPassword: string;
  newPassword: string;
  resetToken?: string;
  resetTokenExpires?: Date;
}

enum ApprovalStatus {
  Pending = 'pending',
  Completed = 'completed',
  Rejected = 'rejected',
}

export interface CreateVendorDTOforAdmin {
  approved: ApprovalStatus;
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  comparePassword?: string;
  language?: string;
  currentPassword: string;
  newPassword: string;
  resetToken?: string;
  resetTokenExpires?: Date;
}

export interface UpdateVendorDTO {
  fullName?: string;
  adminId: string;
  mobile?: string;
  email?: string;
  password?: string;
  comparePassword?:string;
  language?: string;
  currentPassword?: string;
  newPassword?: string;
   resetToken?: string;
  resetTokenExpires?: Date;
}

export interface UpdateVendorPersonalDetailsDTO {
  firstName?: string;
  lastName?: string;
  dob?: Date;
  email: string;
  gender?: string;
  alternativeMobile?: string;
  vendorId: string;
}

export interface UpdateVendorPersonalDetailsDTO {
  firstName?: string;
  lastName?: string;
  dob?: Date;
  email: string;
  gender?: string;
  alternativeMobile?: string;
  add1: string;
  add2: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark: string;
  lat: number;
  lng: number;
}

// export interface UpdateVendorAddressDTO {
//   add1: string;
//   add2: string;
//   area: string;
//   city: string;
//   state: string;
//   country: string;
//   pincode: string;
//   landmark: string;
//   lat: number;
//   lng: number;
// }

export interface CreateBankDTO {
  AccountHolderName: string;
  AccountNumber: number;
  BankName: string;
  Branch: string;
  IFSCNumber: string;
  bankLogoUrl: string;
}

export interface UpdateBankDTO {
  AccountHolderName: string;
  AccountNumber: number;
  BankName: string;
  Branch: string;
  IFSCNumber: string;
  bankLogoUrl: string;
}