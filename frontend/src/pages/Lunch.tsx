import MenuSection from '../components/lunch/MenuSection';
import BackButton from '../components/home/BackButton';
import useIsMobile from '../hooks/useIsMobile';
import { useEffect, useState } from 'react';
import { Menu } from '../types/lunch';
import getMenu from '../core/lunchFetcher';

export default function Lunch() {
    const isMobile = useIsMobile();
    const [menu, setMenu] = useState<Menu | null>(null);

    useEffect(() => {
        getMenu().then((result) => {
            if (result.success) {
                setMenu(result.data);
            }
        });
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                padding: '4vh 5vw',
                boxSizing: 'border-box',
                backgroundColor: '#fdfdfd',
                fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#1a1a1a',
            }}
        >
            {/* Back Button */}
            <BackButton />

            {/* Title */}
            <h1
                style={{
                    fontSize: isMobile ? '5vh' : '3vw',
                    color: 'rgb(154, 31, 54)',
                    marginBottom: '4vh',
                    textAlign: 'center',
                }}
            >
                RL Lunch Menu
            </h1>

            {/* Menu Sections */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1vh',
                    width: '100%',
                    maxWidth: '900px',
                }}
            >
                <MenuSection
                    title='Entrées'
                    items={menu?.Entrées.map((item) => item.name) || []}
                />
                <MenuSection
                    title='Sides and Vegetables'
                    items={
                        menu?.['Sides and Vegetables'].map(
                            (item) => item.name
                        ) || []
                    }
                />
                <MenuSection
                    title='Soups'
                    items={menu?.Soups.map((item) => item.name) || []}
                />
            </div>
        </div>
    );
}
