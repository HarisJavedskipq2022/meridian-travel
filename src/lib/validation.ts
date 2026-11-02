const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

export function isEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export function isPhone(value: string) {
  return PHONE_PATTERN.test(value.trim());
}
