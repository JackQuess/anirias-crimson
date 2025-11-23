import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../providers/I18nProvider';
import { toast } from 'sonner';

// This is a simulation of the NextAuth signIn function for this client-side environment.
const signIn = async (provider: 'credentials' | 'google', options?: any) => {
  console.log(`Signing in with ${provider}`, options);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

  if (provider === 'credentials') {
    if (options.password === 'fail') {
      return { error: 'Invalid credentials', ok: false };
    }
    return { error: null, ok: true };
  }
  // Google sign-in is always successful in this mock
  return { error: null, ok: true };
};


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void; // Callback for redirection
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const toggleMode = () => setMode(mode === 'login' ? 'signup' : 'login');

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', { email, password, redirect: false });
    
    if (result.error) {
      toast.error(t('AuthModal.loginError') || "Login failed. Please check your credentials.");
    } else {
      toast.success(t('AuthModal.loginSuccess') || "Welcome back!");
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const result = await signIn('google');
    if (result.ok) {
        toast.success(t('AuthModal.loginSuccess') || "Successfully signed in with Google!");
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          onClose();
        }
    } else {
        toast.error("Google sign-in failed.");
    }
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-anirias-void border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(153,0,17,0.3)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-auto"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-anirias-crimson transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="hidden md:block w-2/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-anirias-crimson/20 z-10 mix-blend-overlay" />
                <img
                  src="https://picsum.photos/seed/riasgremory/600/900"
                  alt="Rias Gremory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anirias-void via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-anirias-void z-10" />

                <div className="absolute bottom-8 left-8 z-20 max-w-[80%]">
                  <h3 className="text-2xl font-cinzel font-bold text-white mb-2">
                    {mode === 'login' ? t('AuthModal.loginWelcome') : t('AuthModal.signupWelcome')}
                  </h3>
                  <p className="text-sm text-gray-300 font-inter leading-relaxed">
                    {mode === 'login'
                      ? t('AuthModal.loginWelcomeMsg')
                      : t('AuthModal.signupWelcomeMsg')}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-anirias-void relative">
                <div className="absolute top-0 right-0 p-20 bg-anirias-crimson/5 blur-3xl rounded-full pointer-events-none" />

                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-3xl font-cinzel font-bold text-white mb-2">
                    {mode === 'login' ? t('AuthModal.loginTitle') : t('AuthModal.signupTitle')}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {mode === 'login' ? t('AuthModal.loginSubtitle') : t('AuthModal.signupSubtitle')}
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleCredentialsSignIn}>

                  {mode === 'signup' && (
                    <div className="group relative">
                      <User className="absolute left-0 bottom-3 w-5 h-5 text-gray-500 group-focus-within:text-anirias-crimson transition-colors" />
                      <input
                        type="text"
                        name="username"
                        placeholder={t('AuthModal.codename')}
                        className="w-full bg-transparent border-b border-gray-700 py-2 pl-8 text-white placeholder-transparent focus:outline-none focus:border-anirias-crimson transition-colors peer"
                        id="username"
                        required
                      />
                      <label htmlFor="username" className="absolute left-8 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-anirias-crimson peer-focus:text-xs">
                        {t('AuthModal.codename')}
                      </label>
                    </div>
                  )}

                  <div className="group relative">
                    <Mail className="absolute left-0 bottom-3 w-5 h-5 text-gray-500 group-focus-within:text-anirias-crimson transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder={t('AuthModal.email')}
                      className="w-full bg-transparent border-b border-gray-700 py-2 pl-8 text-white placeholder-transparent focus:outline-none focus:border-anirias-crimson transition-colors peer"
                      id="email"
                      required
                    />
                    <label htmlFor="email" className="absolute left-8 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-anirias-crimson peer-focus:text-xs">
                      {t('AuthModal.email')}
                    </label>
                  </div>

                  <div className="group relative">
                    <Lock className="absolute left-0 bottom-3 w-5 h-5 text-gray-500 group-focus-within:text-anirias-crimson transition-colors" />
                    <input
                      type="password"
                      name="password"
                      placeholder={t('AuthModal.password')}
                      className="w-full bg-transparent border-b border-gray-700 py-2 pl-8 text-white placeholder-transparent focus:outline-none focus:border-anirias-crimson transition-colors peer"
                      id="password"
                      required
                    />
                    <label htmlFor="password" className="absolute left-8 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-anirias-crimson peer-focus:text-xs">
                      {t('AuthModal.password')}
                    </label>
                  </div>

                  {mode === 'login' && (
                    <div className="flex justify-end">
                      <button type="button" className="text-xs text-gray-400 hover:text-anirias-crimson transition-colors">
                        {t('AuthModal.forgotPassword')}
                      </button>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-anirias-crimson to-red-700 text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(153,0,17,0.4)] hover:shadow-[0_0_30px_rgba(220,20,60,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-70 disabled:cursor-wait">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? t('AuthModal.loginButton') : t('AuthModal.signupButton')}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-800"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-600 text-xs uppercase">{t('AuthModal.continueWith')}</span>
                    <div className="flex-grow border-t border-gray-800"></div>
                  </div>

                  <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full bg-white/5 border border-white/10 text-gray-300 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-70">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t('AuthModal.google')}
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                      {mode === 'login' ? t('AuthModal.signupPrompt') : t('AuthModal.loginPrompt')}{" "}
                      <button
                        onClick={toggleMode}
                        className="text-anirias-crimson hover:text-anirias-bright font-bold hover:underline ml-1 transition-colors"
                      >
                        {mode === 'login' ? t('AuthModal.signup') : t('AuthModal.login')}
                      </button>
                    </p>
                  </div>

                </form>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
