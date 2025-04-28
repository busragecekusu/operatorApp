export const tabsProfileOperator = [
  {
    name: "profile",
    label: "Profile",
    path: "/profile",
    icon: "person",
  },
  { name: "users", label: "Users", path: "/users", icon: "group" },
  {
    name: "products",
    label: "Products",
    path: "/products",
    icon: "inventory",
  },
  {
    name: "seller",
    label: "Seller",
    path: "/seller",
    icon: "storefront",
  },
] as const;

export const tabsProfileSeller = [
  {
    name: "profile",
    label: "Profile",
    path: "/profile",
    icon: "person",
  },
  { name: "users", label: "Users", path: "/users", icon: "group" },
  {
    name: "products",
    label: "Products",
    path: "/products",
    icon: "inventory",
  },
  {
    name: "operator",
    label: "Operator",
    path: "/operator",
    icon: "co-present",
  },
] as const;

export const tabsAdmin = [
  {
    name: "request",
    label: "Request",
    path: "/admin/request",
  },
  { name: "members", label: "Members", path: "/admin/members" },
  {
    name: "accounting",
    label: "Accounting",
    path: "/admin/accounting",
  },
  {
    name: "messages",
    label: "Messages",
    path: "/admin/messages",
  },
] as const;
