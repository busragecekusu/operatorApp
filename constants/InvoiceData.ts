export const tabsInvoice = [
  {
    name: "unpaid",
    label: "Unpaid",
    path: "/unpaid",
  },
  { name: "pending", label: "Pending", path: "/pending" },
  {
    name: "paid",
    label: "Paid",
    path: "/paid",
  },
] as const;

export const invoiceData = [
  {
    companyId: 101,
    companyName: "Premium Travel Co.",
    info: "THB 23 560",
    routesByDate: [
      {
        id: 201,
        date: "01 May, 2025",
        info: "THB 23 560",
        routes: [
          {
            id: 19876789,
            route: "istanbul-bartın",
            info: "THB 23 560",
            capacity: 20,
            filled: 14,
            cashOnTour: 2,
            pickUp: 13,
            checkIn: 5,
            passengers: [
              {
                id: 1,
                name: "Ahmet Yilmaz",
                info: "THB 1200",
                cashOnTour: true,
                pickUp: true,
                checkIn: true,
              },
              {
                id: 2,
                name: "Fatma Demir",
                info: "THB 1200",
                cashOnTour: false,
                pickUp: true,
                checkIn: true,
              },
            ],
          },
          {
            id: 198787896789,
            route: "istanbul-adana",
            info: "THB 23 560",
            capacity: 15,
            filled: 10,
            cashOnTour: 2,
            pickUp: 13,
            checkIn: 5,
            passengers: [
              {
                id: 3,
                name: "Burak Koc",
                cashOnTour: true,
                pickUp: true,
                checkIn: false,
                info: "THB 1200",
              },
            ],
          },
        ],
      },
      {
        id: 202,
        date: "02 May, 2025",
        info: "THB 23 560",
        routes: [
          {
            id: 3,
            route: "istanbul- küthaya",
            info: "THB 23 560",
            capacity: 12,
            filled: 12,
            cashOnTour: 2,
            pickUp: 13,
            checkIn: 5,
            passengers: [
              {
                id: 4,
                name: "Zeynep Kaya",
                cashOnTour: false,
                pickUp: false,
                checkIn: false,
                info: "THB 1200",
              },
              {
                id: 5,
                name: "Mehmet Karaca",
                cashOnTour: true,
                pickUp: true,
                checkIn: true,
                info: "THB 1200",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    companyId: 102,
    companyName: "Elite Tours Ltd.",
    info: "THB 23 560",
    routesByDate: [
      {
        id: 203,
        date: "03 May, 2025",
        info: "THB 23 560",
        routes: [
          {
            id: 198798786789,
            route: "istanbul- izmir",
            info: "THB 23 560",
            capacity: 20,
            filled: 14,
            cashOnTour: 2,
            pickUp: 13,
            checkIn: 5,
            passengers: [
              {
                id: 89,
                name: "Zeki Yilmaz",
                cashOnTour: true,
                pickUp: true,
                checkIn: true,
                info: "THB 1200",
              },
              {
                id: 290,
                name: "Irmak Demir",
                cashOnTour: false,
                pickUp: true,
                checkIn: true,
                info: "THB 1200",
              },
            ],
          },
          {
            id: 19878798896789,
            route: "istanbul- amasya",
            info: "THB 23 560",
            capacity: 15,
            filled: 10,
            cashOnTour: 2,
            pickUp: 13,
            checkIn: 5,
            passengers: [
              {
                id: 40,
                name: "Veli Koc",
                cashOnTour: true,
                pickUp: true,
                checkIn: false,
                info: "THB 1200",
              },
            ],
          },
        ],
      },
    ],
  },
];
