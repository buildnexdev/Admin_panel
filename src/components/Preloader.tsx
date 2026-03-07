import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
    const [isExiting, setIsExiting] = useState(false);
    const text = "BUILDNEX";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 2200); // Animation duration

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`preloader-container ${isExiting ? 'preloader-exit' : ''}`}>
            <div className="preloader-glass">
                <div className="preloader-text">
                    {text.split('').map((char, index) => (
                        <span
                            key={index}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            className="preloader-char"
                        >
                            {char}
                        </span>
                    ))}
                </div>
                <div className="preloader-underline"></div>
            </div>

            <div className="preloader-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>
        </div>
    );
};

export default Preloader;
