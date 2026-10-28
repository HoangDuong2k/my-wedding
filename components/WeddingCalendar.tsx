'use client'

import { useEffect, useState } from 'react'
import { eventDate, type WeddingEvent } from '@/constants/configuration'
import { useScrollEffects } from '@/hooks/use-scroll-effects'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const pad = (n: number) => String(n).padStart(2, '0')

const HeartOutline = () => (
    <svg viewBox='0 0 24 24' className='absolute inset-0 m-auto w-11 h-11 sm:w-14 sm:h-14 animate-heartBeat' aria-hidden>
        <path
            d='M12 20.5s-7.2-4.4-9.6-8.9C.9 8.7 2.4 4.9 6 4.5c2.2-.3 4 .9 6 3 2-2.1 3.8-3.3 6-3 3.6.4 5.1 4.2 3.6 7.1-2.4 4.5-9.6 8.9-9.6 8.9z'
            fill='rgba(225,29,72,0.12)'
            stroke='#9f1239'
            strokeWidth='1.2'
        />
    </svg>
)

// Counts down to the next event that hasn't started yet
function useCountdown(targets: Date[]) {
    const [now, setNow] = useState<number | null>(null)

    useEffect(() => {
        setNow(Date.now())
        const timer = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (now === null) return null
    const next = targets.map((t) => t.getTime()).sort((a, b) => a - b).find((t) => t > now)
    if (next === undefined) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    const diff = next - now
    return {
        done: false,
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
    }
}

function MonthGrid({ year, month, events }: { year: number; month: number; events: WeddingEvent[] }) {
    // Monday-first grid: leading blanks, then the days of the month
    const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month, 0).getDate()
    const cells: (number | null)[] = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    const marked = new Map(events.map((e) => [e.day, e]))

    return (
        <div>
            <h2 className='font-great-vibes text-6xl sm:text-7xl text-[#7a2a2a] mt-2'>Tháng {month}</h2>
            <p className='font-cormorant text-2xl text-[#7a2a2a] tracking-[0.3em] mt-1'>{year}</p>

            <div className='mt-8 border-t border-[#c9a3a3] pt-4'>
                <div className='grid grid-cols-7 font-eb-garamond font-semibold text-[#7a2a2a] text-base sm:text-lg pb-3 border-b border-[#c9a3a3]'>
                    {WEEKDAYS.map((w) => (
                        <span key={w}>{w}</span>
                    ))}
                </div>
                <div className='grid grid-cols-7 gap-y-3 sm:gap-y-4 pt-4 font-quicksand text-[#7a4a4a]'>
                    {cells.map((d, i) => (
                        <div key={i} className='relative h-10 sm:h-12 flex items-center justify-center'>
                            {d && marked.has(d) ? (
                                <>
                                    <HeartOutline />
                                    <span className='relative font-bold text-[#9f1239] text-lg'>{d}</span>
                                </>
                            ) : (
                                d && <span className='text-base sm:text-lg'>{d}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-6 space-y-1'>
                {events.map((e) => (
                    <p key={e.slug} className='font-quicksand text-[#7a2a2a]'>
                        <span className='font-semibold'>{pad(e.day)}</span> · {e.title} · {e.time}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default function WeddingCalendar({ events }: { events: WeddingEvent[] }) {
    const { elementRef, isVisible } = useScrollEffects({ threshold: 0.2 })
    const countdown = useCountdown(events.map(eventDate))

    // One calendar per month that has an event
    const months = new Map<string, WeddingEvent[]>()
    for (const e of [...events].sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime())) {
        const key = `${e.year}-${e.month}`
        months.set(key, [...(months.get(key) ?? []), e])
    }

    return (
        <section ref={elementRef} id='calendar' className='paper-bg py-16 sm:py-24 px-6'>
            <div
                className={`max-w-md mx-auto text-center transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <p className='font-quicksand uppercase tracking-[0.3em] text-sm text-[#9a5a5a]'>Save the date</p>

                <div className='space-y-14'>
                    {[...months.values()].map((monthEvents) => (
                        <MonthGrid
                            key={`${monthEvents[0].year}-${monthEvents[0].month}`}
                            year={monthEvents[0].year}
                            month={monthEvents[0].month}
                            events={monthEvents}
                        />
                    ))}
                </div>

                {countdown && (
                    <div className='mt-10'>
                        {countdown.done ? (
                            <p className='font-great-vibes text-4xl text-[#9f1239]'>
                                Chúng mình đã về chung một nhà ♥
                            </p>
                        ) : (
                            <>
                                <p className='font-quicksand uppercase tracking-[0.25em] text-xs text-[#9a5a5a] mb-4'>
                                    Cùng đếm ngược thời gian
                                </p>
                                <div className='grid grid-cols-4 gap-3'>
                                    {[
                                        [countdown.days, 'Ngày'],
                                        [countdown.hours, 'Giờ'],
                                        [countdown.minutes, 'Phút'],
                                        [countdown.seconds, 'Giây'],
                                    ].map(([value, label]) => (
                                        <div
                                            key={label}
                                            className='rounded-2xl bg-[#7a2a2a] text-white py-3 shadow-lg'
                                        >
                                            <p className='font-eb-garamond text-3xl leading-none tabular-nums'>
                                                {pad(value as number)}
                                            </p>
                                            <p className='font-quicksand text-xs mt-1 opacity-80'>{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
