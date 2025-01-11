"use client"
import React, { useEffect, useState } from 'react';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationTaskProps {
  onComplete: any ;
}

const LocationTask = ({ onComplete }: LocationTaskProps) => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const STEP_DELAY = 3000; 

    const sendLocationData = async (position: GeolocationPosition) => {
      try {
        await new Promise(resolve => setTimeout(resolve, STEP_DELAY));
        setStep(2);
        setStatus('Sending location data...');

        const response = await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send location data');
        }

        await new Promise(resolve => setTimeout(resolve, STEP_DELAY));
        setStatus('Location task completed');
        setStep(3);
        
        setTimeout(onComplete, STEP_DELAY);
      } catch (error) {
        setStatus('Error sending location data to server');
        setStep(4);
      }
    };

    const initializeGeolocation = async () => {
      if ('geolocation' in navigator) {
        await new Promise(resolve => setTimeout(resolve, STEP_DELAY));
        setStep(1);
        setStatus('Requesting your location...');
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            sendLocationData(position);
          },
          (error) => {
            setStatus(`Error: ${error.message}`);
            setStep(4);
          }
        );
      } else {
        setStatus('Geolocation is not supported by your browser.');
        setStep(4);
      }
    };

    initializeGeolocation();
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-8">
      <div className="relative w-full max-w-md aspect-square">
        {/* Animated background circles */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-48 h-48 rounded-full bg-emerald-500/10" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-64 h-64 rounded-full bg-emerald-500/5" />
        </motion.div>

        {/* Main content */}
        <div className="relative flex flex-col items-center justify-center h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-6"
            >
              {step === 3 ? (
                // Success state
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <CheckCircle className="w-20 h-20 text-emerald-500" />
                </motion.div>
              ) : step === 4 ? (
                // Error state
                <XCircle className="w-20 h-20 text-red-500" />
              ) : (
                // Loading/Processing state
                <div className="relative">
                  <motion.div
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <MapPin className="w-20 h-20 text-emerald-500" />
                  </motion.div>
                  {/* Ping animation */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: [1, 2],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-emerald-500" />
                  </motion.div>
                </div>
              )}

              <motion.p
                className={`text-xl font-medium ${
                  step === 3 
                    ? 'text-emerald-500' 
                    : step === 4 
                      ? 'text-red-500' 
                      : 'text-emerald-400'
                }`}
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              >
                {status}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="absolute bottom-0 flex justify-center space-x-2">
            {[0, 1, 2, 3].map((dot) => (
              <motion.div
                key={dot}
                className={`w-2 h-2 rounded-full ${
                  dot === step 
                    ? 'bg-emerald-500' 
                    : dot < step 
                      ? 'bg-emerald-700' 
                      : 'bg-gray-700'
                }`}
                initial={false}
                animate={{
                  scale: dot === step ? 1.5 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTask;
