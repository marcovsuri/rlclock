import { Menu } from '../types/lunch';
import getMenu from '../core/lunchFetcher';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MenuSection from '../components/lunch/MenuSection';
import useIsMobile from '../hooks/useIsMobile';

interface LunchProps {
  isDarkMode: boolean;
}
export default function Lunch({ isDarkMode }: LunchProps) {
  const isMobile = useIsMobile();
  const [menu, setMenu] = useState<Menu | undefined>(undefined);

  useEffect(() => {
    document.title = 'RL Clock | Lunch';
  }, []);

  useEffect(() => {
    getMenu().then((result) => {
      if (result.success) {
        setMenu(result.data);
      }
    });
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const innerStyle: React.CSSProperties = {
    flexGrow: 1,
    padding: '4vh 5vw',
    boxSizing: 'border-box',
    backgroundColor: isDarkMode ? 'black' : 'white',
    fontFamily: 'Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'center',
    color: isDarkMode ? 'white' : 'black',
    margin: 'auto',
  };

  const contentStyle: React.CSSProperties = {
    padding: isMobile ? '4vw' : '2vw',
    width: isMobile ? '90vw' : '60vw',
    margin: '2vh auto',
    boxSizing: 'border-box',
    justifyContent: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '5vh' : '3vw',
    color: 'rgb(154, 31, 54)',
    marginBottom: '4vh',
    textAlign: 'center',
  };

  const sectionContainerStyle: React.CSSProperties = {
    justifySelf: 'center',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1vh',
    width: '100%',
    maxWidth: '900px',
  };

  const noLunchStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
    marginTop: '2vh',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={containerStyle}
    >
      <div style={innerStyle}>
        <div style={contentStyle}>
          {/* <BackButton /> */}
          <h1 style={titleStyle}>RL Lunch Menu</h1>

          <div style={sectionContainerStyle}>
            {menu?.Entrées.length !== undefined && menu?.Entrées.length > 0 ? (
              <MenuSection
                title="Entrées"
                items={menu?.Entrées.map((item) => item.name) || []}
                isDarkMode={isDarkMode}
              />
            ) : null}
            {menu?.['Sides and Vegetables'].length !== undefined &&
            menu?.['Sides and Vegetables'].length > 0 ? (
              <MenuSection
                title="Sides and Vegetables"
                items={
                  menu?.['Sides and Vegetables'].map((item) => item.name) || []
                }
                isDarkMode={isDarkMode}
              />
            ) : null}
            {menu?.Soups.length !== undefined && menu?.Soups.length > 0 ? (
              <MenuSection
                title="Soups"
                items={menu?.Soups.map((item) => item.name) || []}
                isDarkMode={isDarkMode}
              />
            ) : null}
            {(menu?.Entrées.length === undefined &&
              menu?.['Sides and Vegetables'].length === undefined &&
              menu?.Soups.length === undefined) ||
            (menu.Entrées.length === 0 &&
              menu['Sides and Vegetables'].length === 0 &&
              menu.Soups.length === 0) ? (
              <p style={noLunchStyle}>
                {menu === undefined ? 'Loading...' : 'No lunch served today.'}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
