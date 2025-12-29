import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import anime from 'animejs';

export default function Hero() {
    const titleRef = useRef(null);

    useEffect(() => {
        // Wrap each letter in a span
        const textWrapper = titleRef.current;
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        anime.timeline({ loop: false })
            .add({
                targets: '.letter',
                translateY: [100, 0],
                translateZ: 0,
                opacity: [0, 1],
                easing: "easeOutExpo",
                duration: 1400,
                delay: (el, i) => 300 + 30 * i
            });

        anime({
            targets: '.hero-subtitle',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
            delay: 1000,
            easing: 'easeOutQuad'
        });
    }, []);

    return (
        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
                <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                    <Image
                        src="/logo-new.png"
                        alt="ClarAI Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
                <h1 ref={titleRef} className="text-4xl font-bold tracking-tight neon-text glitch-hover" style={{ display: 'inline-block', overflow: 'hidden' }}>
                    ClarAI
                </h1>
            </div>
            <p className="hero-subtitle text-xl text-dim mb-2" style={{ opacity: 0 }}>
                Ask once. Get clarity. Share anywhere.
            </p>
            <p className="hero-subtitle text-sm text-dim opacity-70 max-w-md mx-auto" style={{ opacity: 0 }}>
                Structured intent capture for perfect AI results on the first try.
            </p>
        </div>
    );
}
