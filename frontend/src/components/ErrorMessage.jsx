import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiWifiOff, FiClock, FiSettings } from 'react-icons/fi';

export const ErrorMessage = ({ message = '', onRetry }) => {
  const isTimeout = message.toLowerCase().includes('timeout') || message.toLowerCase().includes('timed out');
  const isOffline = message.toLowerCase().includes('network') || message.toLowerCase().includes('connect') || message.toLowerCase().includes('offline');
  const isJsonError = message.toLowerCase().includes('json') || message.toLowerCase().includes('malformed') || message.toLowerCase().includes('invalid data');
  const isApiKeyMissing = message.toLowerCase().includes('api_key') || message.toLowerCase().includes('api key');

  // Determine appropriate icon & subtext
  let Icon = FiAlertTriangle;
  let title = "Generation Failed";
  let subtext = "Something went wrong during generation. Please review the details below.";

  if (isTimeout) {
    Icon = FiClock;
    title = "Request Timed Out";
    subtext = "The AI model took too long to respond. This usually happens when notes are extremely long.";
  } else if (isOffline) {
    Icon = FiWifiOff;
    title = "Backend Server Offline";
    subtext = "We couldn't connect to the backend server. Make sure it's running locally on port 8000.";
  } else if (isJsonError) {
    Icon = FiSettings;
    title = "AI Returned Invalid Data";
    subtext = "The AI's structured response was malformed or failed validation checks. Retrying should fix this.";
  } else if (isApiKeyMissing) {
    Icon = FiAlertTriangle;
    title = "API Key Configuration Missing";
    subtext = "Your backend server is missing the GROQ_API_KEY environment variable.";
  }

  return (
    <div className="w-full max-w-lg mx-auto my-8">
      <div className="glass-panel border-red-500/20 dark:border-red-500/30 rounded-3xl p-8 shadow-xl shadow-red-500/5 relative overflow-hidden">
        {/* Glow styling */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
        
        <div className="flex items-start gap-5">
          <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex-shrink-0">
            <Icon className="w-8 h-8" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {subtext}
            </p>
            
            {/* Raw message diagnostic detail */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-850 font-mono text-xs text-red-500 dark:text-red-400 break-words mb-5 max-h-36 overflow-y-auto">
              {message}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {isApiKeyMissing ? (
                <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Create a <code className="bg-slate-200 dark:bg-slate-850 px-1 py-0.5 rounded">.env</code> file in <code className="bg-slate-200 dark:bg-slate-850 px-1 py-0.5 rounded">backend/</code> and add <code className="text-brand-500 font-semibold">GROQ_API_KEY=your_key</code>
                </div>
              ) : (
                <>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="btn-primary py-2 px-5 text-sm"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ErrorMessage;
