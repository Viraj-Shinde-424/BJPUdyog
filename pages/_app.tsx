import React, { Component, ErrorInfo, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { GlobalChatbot } from '@/components/ai/GlobalChatbot';
import { LoginModal } from '@/components/auth/LoginModal';
import { SmoothScroll } from '@/components/common/SmoothScroll';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] text-slate-800">
          <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E35914] flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-base font-bold text-slate-900">
              पृष्ठ लोड करताना अडचण आली (Page Load Error)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              कृपया पृष्ठ पुन्हा रिफ्रेश करा अथवा मुख्य पृष्ठावर जा.
            </p>
            {this.state.error && (
              <pre className="text-[11px] p-2 bg-slate-100 rounded text-left overflow-x-auto text-rose-700">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-[#E35914] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#C84B0E]"
              >
                रिफ्रेश करा (Reload)
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                मुख्य पृष्ठ
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AppProvider>
        {/* Universal Smooth Inertia Scrolling powered by Lenis */}
        <SmoothScroll />
        <Component {...pageProps} />
        {/* Universal Executive Member & Office-Bearer Login Modal */}
        <LoginModal />
        {/* Universal AI Startup & Scheme Guidance Chatbot on Every Page */}
        <GlobalChatbot />
      </AppProvider>
    </ErrorBoundary>
  );
}
