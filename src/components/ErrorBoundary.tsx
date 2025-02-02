import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useToast } from '@/hooks/use-toast';

/**
 * ErrorFallback component
 *
 * Displays an error message and a button to reset the error boundary.
 *
 * @param error The error object.
 * @param resetErrorBoundary Function to reset the error boundary.
 */
const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: 'An error occurred',
      description: error.message,
      variant: 'destructive',
    });
  }, [error]);

  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700">
      <p>Something went wrong. Please refresh the page or try again.</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
};

/**
 * ErrorBoundaryWrapper component
 *
 * Wraps the children components with the ErrorBoundary component from react-error-boundary.
 *
 * @param children The children components to be wrapped.
 */
const ErrorBoundaryWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
