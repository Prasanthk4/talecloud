
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import CallToAction from '@/components/home/CallToAction';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <CallToAction />
    </Layout>
  );
};

export default Index;
