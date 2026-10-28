'use client'

import { useEffect, useState } from 'react'

type Heart = {
    left: number
    size: number
    duration: number
    delay: number
    sway: number
    opacity: number
    color: string
}

const COLORS = ['#e11d48', '#f43f5e', '#be123c', '#fb7185']

// Hearts are generated on the client only, so server and client markup match
export default function FallingHearts() {
    const [hearts, setHearts] = useState<Heart[]>([])

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const count = window.innerWidth < 768 ? 16 : 26
        setHearts(
            Array.from({ length: count }, () => ({
                left: Math.random() * 100,
                size: 8 + Math.random() * 12,
                duration: 9 + Math.random() * 9,
                delay: -Math.random() * 18,
                sway: 20 + Math.random() * 40,
                opacity: 0.45 + Math.random() * 0.45,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            })),
        )
    }, [])

    return (
        <div
            aria-hidden
            className='pointer-events-none fixed inset-0 z-40 overflow-hidden'
        >
            {hearts.map((h, i) => (
                <span
                    key={i}
                    className='falling-heart'
                    style={
                        {
                            left: `${h.left}%`,
                            animationDuration: `${h.duration}s`,
                            animationDelay: `${h.delay}s`,
                            '--sway': `${h.sway}px`,
                        } as React.CSSProperties
                    }
                >
                    <svg
                        viewBox='0 0 24 24'
                        width={h.size}
                        height={h.size}
                        fill={h.color}
                        style={{ opacity: h.opacity }}
                    >
                        <path d='M12 21s-7.5-4.6-10-9.3C.4 8.6 2 4.5 5.8 4.1 8.1 3.8 10 5 12 7.2 14 5 15.9 3.8 18.2 4.1 22 4.5 23.6 8.6 22 11.7 19.5 16.4 12 21 12 21z' />
                    </svg>
                </span>
            ))}
        </div>
    )
}
