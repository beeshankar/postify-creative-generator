
import React from 'react';
import SocialPostGenerator from '@/components/SocialPostGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Social Media Post Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into engaging social media posts with AI-generated images
          </p>
        </div>
        <SocialPostGenerator />
      </div>
    </div>
  );
};

export default Index;
