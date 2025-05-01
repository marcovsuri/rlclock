import { useState } from 'react';

const baseCardStyle = {
    backgroundColor: '#ffe5e5',
    border: '1px solid #f5c2c2',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    textAlign: 'center' as const,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};

const hoverCardStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

const MenuItemCard = ({ item }: { item: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                ...baseCardStyle,
                ...(isHovered ? hoverCardStyle : {}),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {item}
        </div>
    );
};

export default MenuItemCard;
