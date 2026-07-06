import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

// Firebase configuration for idealik
const firebaseConfig = {
  apiKey: "AIzaSyD8M45aHgrqtnFOK1VX9F3evbbl4EXTSQk",
  authDomain: "idealik-8d50b.firebaseapp.com",
  projectId: "idealik-8d50b",
  storageBucket: "idealik-8d50b.firebasestorage.app",
  messagingSenderId: "674868693693",
  appId: "1:674868693693:web:0915591d055122e1e6c5d4",
  measurementId: "G-CBHQDTQYJN"
};

// Initialize Firebase (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Disable app verification for testing (remove in production)
// auth.settings.appVerificationDisabledForTesting = true;

/**
 * Set up invisible reCAPTCHA verifier on a given button element.
 * Must be called before signInWithPhoneNumber.
 */
export function setupRecaptcha(buttonId: string): RecaptchaVerifier {
  // Always clean up existing global instance to avoid "already rendered" errors on React remounts
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn("Failed to clear previous recaptcha", e);
    }
    (window as any).recaptchaVerifier = null;
  }

  const verifier = new RecaptchaVerifier(auth, buttonId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed with signInWithPhoneNumber
    },
    'expired-callback': () => {
      // Reset reCAPTCHA
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    }
  });
  
  (window as any).recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Send SMS OTP to the given phone number using Firebase Phone Auth.
 * Returns a ConfirmationResult to verify the code later.
 */
export async function sendSmsOtp(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return confirmationResult;
}

/**
 * Verify the SMS OTP code using the ConfirmationResult from sendSmsOtp.
 * Returns true if the code is valid.
 */
export async function verifySmsOtp(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<boolean> {
  try {
    await confirmationResult.confirm(code);
    return true;
  } catch (error) {
    console.error('SMS OTP verification failed:', error);
    return false;
  }
}

export { RecaptchaVerifier, type ConfirmationResult };
