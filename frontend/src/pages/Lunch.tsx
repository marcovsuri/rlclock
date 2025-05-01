import { useNavigate } from 'react-router-dom';
import MenuSection from '../components/MenuSection';

export default function Lunch() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#fff',
                padding: '40px',
                color: '#333',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className='lunch-back-btn-container'>
                    <button
                        onClick={() => navigate('/')}
                        className='lunch-back-btn'
                    >
                        ← Back
                    </button>
                </div>

                <h1
                    style={{
                        fontSize: '36px',
                        color: '#cc0000',
                        textAlign: 'center',
                        marginBottom: '40px',
                    }}
                >
                    RL Lunch Menu
                </h1>

                <MenuSection
                    title='Entrées'
                    items={[
                        'Quinoa with Chickpeas and Tomatoes',
                        'Garlic Pasta',
                        'Seasoned Ground Beef',
                        'Filipino Pork Tocino',
                        'Honey-Ginger Teriyaki Chicken Breast',
                    ]}
                />

                <MenuSection
                    title='Sides and Vegetables'
                    items={[
                        'Steamed Cauliflower',
                        'White Rice',
                        'Steamed Peas and Carrots',
                        'Braised Lentils',
                        'Rotini (GF)',
                    ]}
                />

                <MenuSection
                    title='Soups'
                    items={['Beef and Vegetable Soup', 'Vegetable Chili']}
                />
            </div>
        </div>
    );
}
