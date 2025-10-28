import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Button from './UI/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-950 dark:via-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-200 dark:border-red-800 p-8 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Bir Şeyler Yanlış Gitti
              </h1>

              {/* Message */}
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Üzgünüz, beklenmeyen bir hata oluştu. Sofia şu anda biraz karışık durumda.
                Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teknik Detaylar (Sadece Geliştirme Modunda)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                        Hata Mesajı:
                      </p>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                          Stack Trace:
                        </p>
                        <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto max-h-40 overflow-y-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  className="flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tekrar Dene</span>
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center justify-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Sorun devam ederse, lütfen destek ekibimizle iletişime geçin.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
