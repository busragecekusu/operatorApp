import { TextInputProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type UserRole = "admin" | "operator" | "seller";

export type ActiveComponent =
  | "operatorFirst"
  | "operatorTwo"
  | "seller"
  | "login"
  | "code"
  | "documentUpload";

export type InputType = "text" | "password" | "mail" | "file" | "code";

export type ModalType =
  | "bank"
  | "contact"
  | "settings"
  | "newUser"
  | "newProduct"
  | "sellerNewProduct"
  | "reservation"
  | "filter"
  | "seller"
  | "invoice"
  | "adjustPrice"
  | "notes"
  | "newReservation"
  | "createOwnTicket"
  | "showRequest"
  | null;

export type FormInput = {
  id?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  inputType: InputType;
};

export type CustomInputProps = FormInput & {
  keyboardType?: TextInputProps["keyboardType"];
  value: string;
  onChangeText: (value: string) => void;
};

export type Tab = {
  name: string;
  label: string;
  icon?: string;
  path: string;
};

export type Option = {
  label: string;
  value: string;
  onPress?: () => void;
};

export type ModalFormProps = {
  title: string;
  visible: boolean;
  children: React.ReactNode;
};

// KeyValueList
export type KeyValueItem = {
  key?: string;
  value: string | number | null | undefined;
};

export type KeyValueListProps = {
  data: KeyValueItem[];
};

/************************  PROFILE *******************/
// GET
export type CompanyData = {
  companyNumber: string;
  legalName: string;
  taxNumber: string;
  vatNumber: string;
  address: string;
  logoUrl: string;
  users: {
    operatorId: string;
    email: string;
  }[];
  ownerName: string;
  ownerPhoneNumber: string;
  officePhoneNumbers: string[];
  companyMailAddresses: string[];
};

export type BankData = {
  accountType: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  id: string;
};

export type ContactFormData = {
  ownerName: string;
  ownerPhoneNumber: string;
  officePhoneNumber1: string;
  officePhoneNumber2: string;
  companyMailAddress1: string;
  companyMailAddress2: string;
};

export type ContactFormPayload = {
  ownerName: string;
  ownerPhoneNumber: string;
  officePhoneNumbers: string[];
  companyMailAddresses: string[];
};

export type BankFormData = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
};

export type SettingsFormData = {
  newMail: string;
  newPassword: string;
};

/************************  USERS *******************/

export type PermissionType = "Bookings" | "Innovace" | "Messages" | "Profile";

export interface UserType {
  id: string;
  username: string;
  operatorId: string;
  role: UserRole;
  permissions: string[] | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  companyId?: string;
}

export interface NewUserFormData {
  username: string;
  password?: string;
  permissions: PermissionType[];
  companyId?: string;
}

/************************  PRODUCTS  *******************/
export type OperatingDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type Product = {
  id: string;
  companyId: string;
  name: string;
  startDate: string;
  endDate: string;
  operatingDays: OperatingDays | string;
  stockAmount: number;
  startTime: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string | null;
  images?: string[] | null;
  isActive?: boolean;
  price?: number | null;
};

export type NewProductFormData = {
  name: string;
  companyId: string | undefined;
  startDate: string;
  endDate?: string;
  operatingDays: OperatingDays;
  stockAmount: number;
  startTime: string;
};

export type NewProductData = {
  name: string;
  companyId: string | undefined;
  startDate: string;
  endDate: string;
  operatingDates: string[];
  stockAmount: number;
  startTime: string;
};

// ınvoice
export interface Passenger {
  id: number;
  name: string;
  info: string;
}

export interface SingleRoute {
  id: number;
  route: string;
  info: string;
  passengers: Passenger[];
}

export interface RouteByDate {
  id: number;
  date: string;
  info: string;
  routes: SingleRoute[];
}

export interface CompanyInvoice {
  companyId: number;
  companyName: string;
  info: string;
  routesByDate: RouteByDate[];
}

/************************  BOOKINGS  *******************/
export interface ProductData {
  id: string;
  name: string;
  stockAmount: number;
  totalAdultCount: number;
  totalChildCount: number;
  totalInfantCount: number;
}

export interface Booking {
  id: string;
  customerName: string;
  cashOnTour: number;
  paymentCompletedAt: string | null;
  pickupCompletedAt: string | null;
  checkinCompletedAt: string | null;
  pickupDate: string;
  product: ProductData;
  adultCount: number;
  childCount: number;
  infantCount: number;
}

export interface PassengerData {
  id: string;
  customerName: string;
  cashOnTour: number;
  paymentCompletedAt: boolean;
  pickupCompletedAt: boolean;
  checkinCompletedAt: boolean;
}

export interface GroupedBooking {
  id: string;
  pickupDate: string;
  products: {
    id: string;
    name: string;
    stockAmount: number;
    totalAdultCount: number;
    totalChildCount: number;
    totalInfantCount: number;
    passengers: PassengerData[];
  }[];
}
