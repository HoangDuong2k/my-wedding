'use client'

import { MapPin } from 'lucide-react'
import { dayOfWeek, formatDate, type WeddingEvent } from '@/constants/configuration'
import { useScrollEffects } from '@/hooks/use-scroll-effects'

export default function EventsSection({ events }: { events: WeddingEvent[] }) {
    const { elementRef, isVisible } = useScrollEffects({ threshold: 0.2 })

    return (
        <section ref={elementRef} id='events' className='paper-bg py-16 sm:py-20 px-6'>
            <div className='text-center mb-10'>
                <p className='font-quicksand uppercase tracking-[0.3em] text-sm text-[#9a5a5a]'>
                    Trân trọng kính mời
                </p>
                <h2 className='font-great-vibes text-5xl sm:text-6xl text-[#7a2a2a] mt-2'>
                    {events.length > 1 ? 'Sự kiện cưới' : events[0].title}
                </h2>
            </div>

            <div
                className={`mx-auto grid gap-6 sm:gap-8 ${
                    events.length > 1 ? 'max-w-4xl md:grid-cols-2' : 'max-w-md'
                }`}
            >
                {events.map((event, i) => (
                    <div
                        key={event.slug}
                        className={`relative rounded-[28px] bg-white/80 border border-[#e3c9c9] shadow-xl px-6 py-8 text-center transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                        style={{ transitionDelay: `${i * 250}ms` }}
                    >
                        <div className='absolute inset-2 rounded-[22px] border border-dashed border-[#d7b2b2] pointer-events-none'></div>

                        <h3 className='font-eb-garamond font-semibold uppercase tracking-[0.2em] text-xl text-[#7a2a2a]'>
                            {event.title}
                        </h3>
                        <p className='font-quicksand text-sm text-[#9a5a5a] mt-1'>{event.host}</p>

                        <div className='mt-6 grid grid-cols-3 items-center text-[#7a2a2a]'>
                            <span className='font-quicksand text-lg border-r border-[#d7b2b2]'>{event.time}</span>
                            <span className='font-cormorant text-5xl leading-none'>{String(event.day).padStart(2, '0')}</span>
                            <span className='font-quicksand text-sm uppercase border-l border-[#d7b2b2]'>
                                {dayOfWeek(event)}
                            </span>
                        </div>
                        <p className='font-quicksand tracking-[0.3em] text-[#7a2a2a] mt-2'>{formatDate(event)}</p>

                        <p className='font-quicksand text-sm text-gray-600 leading-relaxed mt-6'>{event.address}</p>

                        <a
                            href={event.mapUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='relative inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-[#7a2a2a] text-white font-quicksand text-sm shadow-md hover:bg-[#8e3434] transition-colors'
                        >
                            <MapPin className='w-4 h-4' />
                            Chỉ đường
                        </a>
                    </div>
                ))}
            </div>
        </section>
    )
}
