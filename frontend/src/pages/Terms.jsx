import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="bg-white rounded-xl shadow-card p-8 space-y-4 text-gray-700">
          <p>By using CampusRide & Marketplace, you agree to the following terms and conditions.</p>
          <h3 className="font-semibold text-lg">1. Eligibility</h3>
          <p>You must be a currently enrolled student with a valid .edu email address to use this platform.</p>
          <h3 className="font-semibold text-lg">2. Marketplace Listings</h3>
          <p>All listings must be accurate and truthful. Prohibited items include but are not limited to: illegal goods, weapons, drugs, and counterfeit items.</p>
          <h3 className="font-semibold text-lg">3. Ride Sharing</h3>
          <p>Ride sharing is a voluntary arrangement between students. The platform is not responsible for any incidents during rides.</p>
          <h3 className="font-semibold text-lg">4. User Conduct</h3>
          <p>Users must treat each other with respect. Harassment, fraud, or abuse will result in account termination.</p>
          <h3 className="font-semibold text-lg">5. Privacy</h3>
          <p>Your data is handled in accordance with our Privacy Policy. We do not share your personal information without consent.</p>
        </div>
        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
