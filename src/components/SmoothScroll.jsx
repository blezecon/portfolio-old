import { useEffect, createContext, useContext, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

const SmoothScroll = ({ children }) => {
    const [lenisInstance, setLenisInstance] = useState(null);

    useEffect(() => {
        // 0. Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // 1. Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        setLenisInstance(lenis);

        // 2. Set up RAF loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const rafId = requestAnimationFrame(raf);

        // 3. Handle browser back/forward
        const handlePopState = (event) => {
            if (event.state && event.state.target) {
                lenis.scrollTo(event.state.target);
            } else {
                lenis.scrollTo(0); // Scroll to top if no state
            }
        };

        window.addEventListener('popstate', handlePopState);

        // 4. Cleanup on unmount
        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
            window.removeEventListener('popstate', handlePopState);
            setLenisInstance(null);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenisInstance}>
            {children}
        </LenisContext.Provider>
    );
};

export default SmoothScroll;
