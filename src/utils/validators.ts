export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
  return regex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
