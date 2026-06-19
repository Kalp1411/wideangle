'use client';

import { closeAuthPopUp, loginWithMobile, verifyTokenGoogleFacebook } from '@/store/authSlice';
import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaMobileAlt, FaShieldAlt, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '@/utils/firebase';
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const COUNTRY_CODE = '+91';

export default function AuthPopup() {
  const dispatch = useDispatch();
  const { isAuthPopUpOpen } = useSelector((s) => s.auth);
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (step !== 'otp') return;
    setTimer(30);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (isAuthPopUpOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setStep('mobile');
        setMobile('');
        setOtp(new Array(6).fill(''));
        setError('');
        setLoading(false);
      }, 300);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isAuthPopUpOpen]);

  if (!isAuthPopUpOpen) return null;

  const setupRecaptcha = async () => {
    if (window.recaptchaVerifier && !window.recaptchaVerifier.destroyed) {
      return window.recaptchaVerifier;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    await window.recaptchaVerifier.render();
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length < 10 || loading) return;
    try {
      setLoading(true);
      const appVerifier = await setupRecaptcha();
      const res = await signInWithPhoneNumber(auth, `${COUNTRY_CODE}${mobile}`, appVerifier);
      window.confirmationResult = res;
      setStep('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      console.error(err);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val && e.target.value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    setError('');
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
    if (newOtp.join('').length === 6) verifyOtp(newOtp.join(''));
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = new Array(6).fill('');
    pasted.split('').forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) verifyOtp(pasted);
  };

  const verifyOtp = async (code) => {
    if (!code || code.length !== 6) return;
    if (verifyingRef.current) return;
    if (!window.confirmationResult) {
      toast.error('Session expired. Please resend OTP.');
      return;
    }
    verifyingRef.current = true;
    setError('');
    try {
      setLoading(true);
      const res = await window.confirmationResult.confirm(code);
      if (!res?.user) throw new Error('OTP verification failed. Please try again.');
      const token = await res.user.getIdToken();

      const loginRes = await dispatch(loginWithMobile({
        phone: `${COUNTRY_CODE}${mobile}`,
        token,
        device_type: 2,
        device_token: 'fcm',
        channel: 'web',
      })).unwrap();

      if (loginRes?.status === 200 || loginRes?.success) {
        if (loginRes?.data?.token) Cookies.set('wa_web_token', loginRes.data.token, { expires: 7 });
        setStep('success');
        setTimeout(() => dispatch(closeAuthPopUp()), 1800);
      } else {
        const msg = loginRes?.message || 'Login failed';
        setError(msg);
        toast.error(msg);
        setOtp(new Array(6).fill(''));
        setTimeout(() => otpRefs.current[0]?.focus(), 50);
      }
    } catch (err) {
      console.log('errrrrr',err);
      
      let message = 'Something went wrong. Try again.';
      switch (err.code) {
        case 'auth/invalid-verification-code': message = 'Invalid OTP. Please check and try again.'; break;
        case 'auth/code-expired': message = 'OTP expired. Please request a new one.'; break;
        case 'auth/too-many-requests': message = 'Too many attempts. Please try again later.'; break;
        case 'auth/session-expired': message = 'Session expired. Please resend OTP.'; break;
        case 'auth/missing-verification-code': message = 'Please enter the OTP.'; break;
        default: message = err.message || message;
      }
      setError(message);
      toast.error(message);
      setOtp(new Array(6).fill(''));
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
      verifyingRef.current = false;
    }
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    setOtp(new Array(6).fill(''));
    setError('');
    try {
      setLoading(true);
      const appVerifier = await setupRecaptcha();
      const res = await signInWithPhoneNumber(auth, `${COUNTRY_CODE}${mobile}`, appVerifier);
      window.confirmationResult = res;
      setCanResend(false);
      setTimer(30);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
      toast.success('OTP resent successfully');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (res) => {
    try {
      if (!res?.credential) { toast.error('Google login failed. Missing credential.'); return; }
      setLoading(true);
      const cred = GoogleAuthProvider.credential(res.credential);
      const result = await signInWithCredential(auth, cred);
      const token = await result.user.getIdToken();

      const apiRes = await dispatch(verifyTokenGoogleFacebook({
        token,
        provider: 'google',
        device_type: 2,
        device_token: 'fcm',
        channel: 'web',
      })).unwrap();

      if (apiRes?.status === 200 || apiRes?.success) {
        if (apiRes?.data?.token) Cookies.set('wa_web_token', apiRes.data.token, { expires: 7 });
        setStep('success');
        setTimeout(() => dispatch(closeAuthPopUp()), 1800);
      } else {
        toast.error(apiRes?.message || 'Google login failed');
      }
    } catch (err) {
      let message = 'Google login failed';
      switch (err.code) {
        case 'auth/popup-closed-by-user': message = 'Login cancelled'; break;
        case 'auth/network-request-failed': message = 'Network error. Please try again.'; break;
        case 'auth/invalid-credential': message = 'Invalid Google credential.'; break;
        default: message = err.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ap-overlay" role="dialog" aria-modal="true" aria-label="Authentication">
        <div className="ap-card">
          <div className="ap-glow-tr" />
          <div className="ap-glow-bl" />

          <button className="ap-close-btn" onClick={() => dispatch(closeAuthPopUp())} aria-label="Close">
            <FaTimes size={13} />
          </button>

          {step === 'otp' && (
            <button
              className="ap-back-btn"
              onClick={() => { setStep('mobile'); setOtp(new Array(6).fill('')); setError(''); }}
              aria-label="Go back"
            >
              <FaArrowLeft size={13} />
            </button>
          )}

          {step === 'mobile' && (
            <div className="ap-step" key="mobile">
              <div className="ap-icon-wrap">
                <FaMobileAlt size={26} color="#111" />
              </div>
              <h2 className="ap-title">Welcome Back</h2>
              <p className="ap-subtitle">Sign in to continue streaming</p>

              <form onSubmit={handleSendOtp} noValidate>
                <label className="ap-field-label" htmlFor="ap-mobile">Mobile Number</label>
                <div className="ap-input-wrap">
                  <span className="ap-country-code">+91</span>
                  <input
                    id="ap-mobile"
                    className="ap-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoFocus
                    autoComplete="tel"
                  />
                </div>
                <button type="submit" className="ap-btn" disabled={mobile.length < 10 || loading}>
                  {loading ? <span className="ap-spinner" /> : 'Send OTP'}
                </button>
              </form>

              <hr className="ap-divider" />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin onSuccess={handleGoogle} onError={() => toast.error('Google login failed')} />
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="ap-step" key="otp">
              <div className="ap-icon-wrap">
                <FaShieldAlt size={26} color="#111" />
              </div>
              <h2 className="ap-title">Verify OTP</h2>
              <p className="ap-subtitle">
                6-digit code sent to <strong style={{ color: '#f0e6cc', fontWeight: 500 }}>+91 {mobile}</strong>
              </p>

              <label className="ap-field-label">Enter code</label>
              <div className="ap-otp-grid" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className={`ap-otp-box${digit ? ' filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onFocus={(e) => e.target.select()}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              {error && <p className="ap-error" role="alert" key={error}>{error}</p>}

              <div className="ap-timer-text">
                {canResend ? (
                  <button className="ap-resend-btn" onClick={handleResend}>Resend OTP →</button>
                ) : (
                  <>Resend OTP in <strong>{timer}s</strong></>
                )}
              </div>

              <button
                className="ap-btn"
                onClick={() => verifyOtp(otp.join(''))}
                disabled={otp.join('').length < 6 || loading}>
                {loading ? <span className="ap-spinner" /> : 'Verify & Proceed'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="ap-step" key="success">
              <div className="ap-success-content">
                <div className="ap-icon-wrap success">
                  <FaCheck size={26} color="#fff" />
                </div>
                <h2 className="ap-title">You're In!</h2>
                <p className="ap-subtitle" style={{ color: '#1d9e75' }}>
                  Authentication successful
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="recaptcha-container" />
    </>
  );
}