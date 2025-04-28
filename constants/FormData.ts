import { FormInput } from "@/types/types";

export const loginInputData: FormInput[] = [
  {
    id: "id",
    icon: "account-box",
    placeholder: "USER ID",
    keyboardType: "default" as "default",
    inputType: "text",
  },
  {
    id: "password",
    icon: "lock",
    placeholder: "PASSWORD",
    keyboardType: "default" as "default",
    inputType: "password",
  },
];

export const registerOperator: FormInput[] = [
  {
    id: "username",
    icon: "account-box",
    placeholder: "Create a username",
    keyboardType: "default" as "default",
    inputType: "text",
  },
  {
    id: "password",
    icon: "lock",
    placeholder: "Create a password",
    keyboardType: "default" as "default",
    inputType: "password",
  },
  {
    id: "email",
    icon: "email",
    placeholder: "E-mail",
    keyboardType: "email-address" as "email-address",
    inputType: "mail",
  },
];

export const registerOperatorInputData: FormInput[] = [
  {
    id: "tatLicenseNumber",
    placeholder: "TAT license number",
    keyboardType: "numeric" as "default",
    inputType: "text",
  },
  {
    id: "companyNumber",
    placeholder: "Company registration number",
    keyboardType: "numeric" as "default",
    inputType: "text",
  },
  {
    id: "compnayAddress",
    placeholder: "Company address",
    keyboardType: "default" as "default",
    inputType: "text",
  },
  {
    id: "vatNumber",
    placeholder: "VAT number",
    keyboardType: "numeric" as "default",
    inputType: "text",
  },

  {
    id: "uploadDBD",
    icon: "upload",
    placeholder: "Upload DBD",
    keyboardType: "default" as "default",
    inputType: "file",
  },
  {
    id: "uploadTAT",
    icon: "upload",
    placeholder: "Upload TAT Licance",
    keyboardType: "default" as "default",
    inputType: "file",
  },
];

export const registerSellerInputData: FormInput[] = [
  {
    id: "username",
    icon: "account-box",
    placeholder: "Create a username",
    keyboardType: "default" as "default",
    inputType: "text",
  },
  {
    id: "password",
    icon: "lock",
    placeholder: "Create a password",
    keyboardType: "default" as "default",
    inputType: "password",
  },
  {
    id: "email",
    icon: "email",
    placeholder: "E-mail",
    keyboardType: "email-address" as "email-address",
    inputType: "mail",
  },

  {
    id: "uploadDBD",
    icon: "upload",
    placeholder: "Upload DBD",
    keyboardType: "default" as "default",
    inputType: "file",
  },
  {
    id: "uploadTAT",
    icon: "upload",
    placeholder: "Upload TAT Licance",
    keyboardType: "default" as "default",
    inputType: "file",
  },
];
