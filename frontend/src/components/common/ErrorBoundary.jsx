import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-card p-8 text-center">
            <h2 className="text-2xl font-bold text-navy-800 mb-2">Something went wrong</h2>
            <p className="text-navy-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred. Please try reloading the page.'}
            </p>
            <button onClick={this.handleReload} className="btn-primary w-full">
              Reload Page
            </button>
            <button onClick={() => this.setState({ hasError: false, error: null })} className="btn-secondary w-full mt-2">
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
