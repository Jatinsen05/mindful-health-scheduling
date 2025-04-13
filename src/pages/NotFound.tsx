
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center">
      <h1 className="text-7xl font-bold text-health-700">404</h1>
      <p className="text-xl mt-4 mb-8">Oops! We couldn't find the page you're looking for.</p>
      <Button asChild>
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
