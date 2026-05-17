// server/utils/cryptoUtils.js
import crypto from 'crypto';

// Generate SHA256 hash
export const generateSHA256 = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

// Generate MD5 hash
export const generateMD5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

// Generate SHA512 hash
export const generateSHA512 = (text) => {
  return crypto.createHash('sha512').update(text).digest('hex');
};

// Generate SHA1 hash
export const generateSHA1 = (text) => {
  return crypto.createHash('sha1').update(text).digest('hex');
};

// Get hash by algorithm name
export const generateHash = (text, algorithm = 'sha256') => {
  const algo = algorithm.toLowerCase();
  const supported = ['md5', 'sha1', 'sha256', 'sha512', 'sha224', 'sha384'];

  if (!supported.includes(algo)) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return crypto.createHash(algo).update(text).digest('hex');
};

// Check password strength score (0-7)
export const analyzePasswordStrength = (password) => {
  const checks = {
    length8:   password.length >= 8,
    length12:  password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers:   /[0-9]/.test(password),
    symbols:   /[^A-Za-z0-9]/.test(password),
    nocommon:  !['password','123456','qwerty','admin'].includes(password.toLowerCase()),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let strength;
  if (score <= 2) strength = 'Very Weak';
  else if (score <= 3) strength = 'Weak';
  else if (score <= 4) strength = 'Fair';
  else if (score <= 5) strength = 'Strong';
  else strength = 'Very Strong';

  return { score, strength, checks };
};

// Generate a secure random password
export const generateSecurePassword = (length = 16, options = {}) => {
  const {
    upper   = true,
    lower   = true,
    numbers = true,
    symbols = true,
  } = options;

  let charset = '';
  if (upper)   charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower)   charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

  let password = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  return password;
};