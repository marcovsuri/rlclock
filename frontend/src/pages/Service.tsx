import React, { useState, useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import ProgressBar from '../components/service/ProgressBar';
import getServiceData from '../core/serviceDataFetcher';
import { ServiceData } from '../types/serviceData';

interface ServiceProps {
  isDarkMode: boolean;
}

const Service: React.FC<ServiceProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();

  const [serviceData, setServiceData] = useState<ServiceData | undefined>(
    undefined
  );

  useEffect(() => {
    document.title = 'RL Clock | Service';
    getServiceData().then((result) => {
      if (result.success) {
        setServiceData(result.data);
      }
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100vw',
        padding: isMobile ? '4vh 2vw' : '4vh 4vw',
        boxSizing: 'border-box',
        backgroundColor: isDarkMode ? 'black' : 'white',
      }}
    >
      {/* Title Banner */}
      <h1
        style={{
          fontSize: isMobile ? '8vw' : '3vw',
          fontWeight: 'bold',
          color: 'rgb(154, 31, 54)',
          marginBottom: '3vh',
          textAlign: 'center',
          marginTop: isMobile ? '4vh' : '6vh',
        }}
      >
        🦃 Thanksgiving Food Drive! 🥫
      </h1>

      {/* Progress Card */}
      <ProgressBar
        donationGoal={serviceData?.donationGoal || 1000}
        numDonations={serviceData?.numDonations || 0} // This would be dynamic in a real app
        isDarkMode={isDarkMode}
      />

      {/* Instructions / Blurb */}
      <div
        style={{
          marginTop: '4vh',
          maxWidth: isMobile ? '90vw' : '60vw',
          fontSize: isMobile ? '4vw' : '1.2vw',
          lineHeight: 1.6,
          color: isDarkMode ? '#f0f0f0' : '#222',
          textAlign: 'left',
          backgroundColor: isDarkMode ? 'rgb(15, 0, 0)' : 'rgb(255, 240, 240)',
          border: `2px solid ${
            isDarkMode ? 'rgba(154,31,54,0.8)' : 'rgba(154,31,54,0.5)'
          }`,
          borderRadius: '16px',
          padding: isMobile ? '4vw' : '2vw',
          // boxShadow: '0 8px 24px rgba(154,31,54,0.3)',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '6vw' : '2vw',
            marginBottom: '2vh',
            color: 'rgb(154, 31, 54)',
          }}
        >
          #RLGIVES
        </h2>

        <p style={{ marginBottom: '1.5vh', textAlign: 'center' }}>
          Let’s join together to help local families in need during this season
          of giving thanks!
        </p>

        <div>
          <h3
            style={{
              fontSize: isMobile ? '5vw' : '1.2vw',
              marginBottom: '0.5vh',
              color: 'rgb(154, 31, 54)',
            }}
          >
            🎁 Our Initiative:
          </h3>
          <ul style={{ paddingLeft: '1.5em', margin: 0 }}>
            <li>
              There is an urgent need to support families who previously relied
              on SNAP, the government-assisted food program.
            </li>
            <li>
              To help, we are launching a school-wide initiative over the next
              two weeks to collect food items for donation to the Dedham Food
              Pantry.
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '1.5vh' }}>
          <h3
            style={{
              fontSize: isMobile ? '5vw' : '1.2vw',
              marginBottom: '0.5vh',
              color: 'rgb(154, 31, 54)',
            }}
          >
            🥫 Items Needed:
          </h3>
          <ul style={{ paddingLeft: '1.5em', margin: 0 }}>
            <li>
              Canned and packaged proteins: tuna, chicken, salmon, peanut butter
            </li>
            <li>
              Fruits, vegetables, and sauces: canned fruits/vegetables,
              applesauce, tomato/pasta sauces
            </li>
            <li>
              Staples and snacks: rice, pasta, macaroni & cheese, granola and
              protein bars
            </li>
          </ul>
        </div>

        <div>
          <h3
            style={{
              fontSize: isMobile ? '5vw' : '1.2vw',
              marginBottom: '0.5vh',
              color: 'rgb(154, 31, 54)',
            }}
          >
            📦 Donation Details:
          </h3>
          <ul style={{ paddingLeft: '1.5em', margin: 0 }}>
            <li>There will be a bin in each homeroom.</li>
            <li>We’re aiming to gather 1000 items of food.</li>
            <li>We need EVERYONE to pitch in!</li>
            <li>The drive will run from November 12 — 25.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Service;
