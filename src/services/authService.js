import { USER_STORAGE_KEY, DEMO_OTP } from '../utils/constants';
import { delay } from '../utils/helpers';

const AUTH_URL = 'http://localhost:4000/api/auth'; // match your actual server port

export const authService = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  },
  save(user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  clear() {
    localStorage.removeItem(USER_STORAGE_KEY);
  },
  async verifyIdentity({ idType, idNumber }) {
    const res = await fetch(`${AUTH_URL}/verify-identity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idType, idNumber }),
    });
    const data = await res.json();
    if (!res.ok || !data.verified) {
      throw new Error(data.error || 'Identity verification failed.');
    }
    return { verified: true, idType, idNumber, name: data.name };
  },
  async sendOtp(mobile) {
    await delay(500);
    return { sent: true, mobile, demoOtp: DEMO_OTP };
  },
  async confirmOtp(otp) {
    await delay(400);
    return otp === DEMO_OTP;
  },
};