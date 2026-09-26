import React, { useEffect, useState } from 'react';
import BrandSpinner from './BrandSpinner';

const Preloader: React.FC = () => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsExiting(true), 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <BrandSpinner
            variant="full"
            message="Building Digital Growth"
            exiting={isExiting}
        />
    );
};

export default Preloader;
