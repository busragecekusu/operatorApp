export interface Reservation {
  id: string;
  customerName: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  pickupDate: string;
  pickupTime: string;
  cashOnTour: boolean;
  customerPhoneNumber: string;
  driverPhoneNumber: string;
  specialRequirements: string;
  sellerId: string;
  operatorId: string;
  productId: string;
  status: string;
  paymentCompletedAt: string | null;
  pickupCompletedAt: string | null;
  checkinCompletedAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetail {
  id: string;
  accountType: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  companyNumber: string;
  legalName: string;
  taxNumber: string;
  vatNumber: string;
  address: string;
  logoUrl: string | null;
  ownerId: string;
  ownerName: string;
  ownerPhoneNumber: string;
  officePhoneNumbers: string[];
  companyMailAddresses: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  bankDetails: BankDetail[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  operatorId: string | null;
  sellerId: string | null;
  role: string;
  permissions: string | null;
  phoneNumber: string | null;
  companyName: string | null;
  taxNumber: string | null;
  address: string | null;
  dbdDocumentUrl: string;
  tatLicenceUrl: string;
  isActive: boolean;
  lastLoginAt: string | null;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
}

export interface Invoice {
  id: string;
  reservationId: string;
  sellerId: string;
  operatorId: string;
  invoiceNumber: string;
  amount: string;
  commissionRate: string;
  commissionAmount: string;
  netAmount: string;
  status: string;
  dueDate: string;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  reservation: Reservation;
  seller: User;
  operator: User;
}

export interface InvoiceResponse {
  data: Invoice[];
  meta: {
    page: string;
    limit: string;
    total: number;
    totalPages: number;
  };
}
