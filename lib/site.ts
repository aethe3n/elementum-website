export const site = {
  name: "Elementum Global",
  legalName: "Elementum Global LLC",
  url: "https://elementumglobal.com",
  email: "info@elementumglobal.com",
  description:
    "Elementum Global is a U.S.-registered commodity sourcing and trade company connecting producers with international buyers of cacao, vanilla, coffee, pepper and more.",
};

export const productOptions = [
  { value: "cacao", label: "Cacao" },
  { value: "vanilla", label: "Vanilla" },
  { value: "coffee", label: "Coffee" },
  { value: "pepper", label: "Pepper" },
  { value: "metals-minerals", label: "Metals & minerals" },
  { value: "other-agri", label: "Other agricultural products" },
] as const;

export const roleOptions = [
  "Importer / trader",
  "Processor / grinder",
  "Chocolate or food manufacturer",
  "Trade or logistics partner",
  "Investor",
  "Producer / supplier",
  "Other",
] as const;

export const volumeOptions = [
  "Samples / trial lot",
  "1–2 containers",
  "3–10 containers",
  "More than 10 containers",
  "Ongoing / recurring supply",
  "Not sure yet",
] as const;

export type ProductValue = (typeof productOptions)[number]["value"];
