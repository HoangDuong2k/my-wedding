'use client'

import { useEffect, useState } from 'react'
import WaxSeal from './WaxSeal'

type Phase = 'closed' | 'opening' | 'done'

const OPEN_DELAY = 1200
const OPEN_DURATION = 1800

// Two red doors with a wax seal on the seam that slide apart to reveal the banner
export default function DoorIntro({
    initials,
    onOpen,
}: {
    initials: string
    onOpen: () => void
}) {
    const [phase, setPhase] = useState<Phase>('closed')

    const open = () => {
        setPhase((prev) => (prev === 'closed' ? 'opening' : prev))
    }

    useEffect(() => {
        const timer = setTimeout(open, OPEN_DELAY)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (phase !== 'opening') return
        onOpen()
        const timer = setTimeout(() => setPhase('done'), OPEN_DURATION)
        return () => clearTimeout(timer)
    }, [phase, onOpen])

    useEffect(() => {
        document.documentElement.style.overflow = phase === 'done' ? '' : 'hidden'
        return () => {
            document.documentElement.style.overflow = ''
        }
    }, [phase])

    if (phase === 'done') return null

    const opening = phase === 'opening'

    return (
        <div
            className='fixed inset-0 z-[100] cursor-pointer'
            onClick={open}
            role='button'
            aria-label='Mở thiệp'
        >
            <div
                className={`door door-left ${opening ? 'door-open-left' : ''}`}
                style={{ transitionDuration: `${OPEN_DURATION}ms` }}
            >
                <WaxSeal
                    initials={initials}
                    variant='bronze'
                    className={`door-seal ${opening ? '' : 'animate-sealPulse'}`}
                />
            </div>
            <div
                className={`door door-right ${opening ? 'door-open-right' : ''}`}
                style={{ transitionDuration: `${OPEN_DURATION}ms` }}
            />
        </div>
    )
}
