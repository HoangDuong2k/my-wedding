import { useId } from 'react'

// Wobbly outline so the seal looks like pressed wax; deterministic for SSR
const wavyCircle = (cx: number, cy: number, r: number) => {
    const points = 48
    let d = ''
    for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2
        const rr = r + Math.sin(a * 7) * 2.2 + Math.sin(a * 3 + 1) * 1.6
        const x = (cx + Math.cos(a) * rr).toFixed(2)
        const y = (cy + Math.sin(a) * rr).toFixed(2)
        d += `${i === 0 ? 'M' : 'L'}${x} ${y} `
    }
    return d + 'Z'
}

const PALETTES = {
    red: { light: '#b3343a', mid: '#8a1c22', dark: '#5a0f14', line: '#d9787c' },
    bronze: { light: '#e2b07a', mid: '#a86c3d', dark: '#6e4024', line: '#f3d2a6' },
}

export default function WaxSeal({
    initials,
    variant = 'red',
    className = '',
}: {
    initials: string
    variant?: keyof typeof PALETTES
    className?: string
}) {
    const id = useId().replace(/:/g, '')
    const c = PALETTES[variant]

    return (
        <svg viewBox='0 0 100 100' className={className} aria-hidden>
            <defs>
                <radialGradient id={`g${id}`} cx='38%' cy='32%' r='75%'>
                    <stop offset='0%' stopColor={c.light} />
                    <stop offset='55%' stopColor={c.mid} />
                    <stop offset='100%' stopColor={c.dark} />
                </radialGradient>
                <radialGradient id={`i${id}`} cx='60%' cy='65%' r='70%'>
                    <stop offset='0%' stopColor={c.light} />
                    <stop offset='100%' stopColor={c.mid} />
                </radialGradient>
                <filter id={`s${id}`} x='-20%' y='-20%' width='140%' height='140%'>
                    <feDropShadow dx='0' dy='2.5' stdDeviation='2.5' floodOpacity='0.35' />
                </filter>
            </defs>
            <path d={wavyCircle(50, 50, 44)} fill={`url(#g${id})`} filter={`url(#s${id})`} />
            <circle cx='50' cy='50' r='32' fill={`url(#i${id})`} stroke={c.dark} strokeOpacity='0.5' strokeWidth='1.5' />
            <circle cx='50' cy='50' r='28' fill='none' stroke={c.line} strokeOpacity='0.6' strokeWidth='0.8' strokeDasharray='1.5 2' />
            <text
                x='50'
                y='51'
                textAnchor='middle'
                dominantBaseline='middle'
                fill={c.line}
                fontSize='22'
                style={{ fontFamily: 'var(--font-great-vibes), cursive' }}
            >
                {initials}
            </text>
        </svg>
    )
}
