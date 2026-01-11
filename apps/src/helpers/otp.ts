const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MILLISECONDS_IN_MINUTE = 60 * 1000;

export const generateOtp = (length: number = OTP_LENGTH) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

   const code = Math.floor(
      min + Math.random() * (max - min + 1)
   ).toString();

   const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * MILLISECONDS_IN_MINUTE
   );

  return { code, expiresAt };
};