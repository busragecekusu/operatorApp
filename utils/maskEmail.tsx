export const maskEmail = (email: string): string => {
  const [name, domain] = email.split("@");
  const visiblePart = name.slice(0, 4);
  const maskedPart = "*".repeat(Math.max(name.length - visiblePart.length, 0));
  return `${visiblePart}${maskedPart}@${domain}`;
};
