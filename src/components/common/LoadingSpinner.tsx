import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;