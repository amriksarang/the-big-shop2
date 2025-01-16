import React from 'react';
import CarousalLarge from '../../components/carousal-large/CarousalLarge';
import CarousalSmall from '../../components/carousal-small/CarousalSmall';
import HighlightedProduct from '../../components/highlighted-product/HighlightedProduct';
import Shipping from '../../components/shipping/Shipping';

const LandingPage: React.FC = () => {

    return (
        <>
            <CarousalLarge />
            <CarousalSmall />
            <HighlightedProduct />
            <Shipping />
        </>
    );
}

export default LandingPage;
