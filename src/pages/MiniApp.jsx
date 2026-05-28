import React, { useState, useEffect } from 'react';
import Onboarding from '../components/miniapp/Onboarding';
import MainApp from '../components/miniapp/MainApp';

export default function MiniApp() {
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('flowx_onboarding_done');
    if (done) setOnboardingDone(true);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('flowx_onboarding_done', 'true');
    setOnboardingDone(true);
  };

  if (!onboardingDone) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <MainApp />;
}