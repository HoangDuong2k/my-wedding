'use client'

import { MapPin } from 'lucide-react'
import {
    dayOfWeek,
    FAMILIES,
    formatDate,
    type Side,
    type SideEvent,
    type WeddingEvent,
} from '@/constants/configuration'
import { useScrollEffects } from '@/hooks/use-scroll-effects'

const pad = (n: number) => String(n).padStart(2, '0')

// Time | big day | weekday row, then the full and lunar dates, shared by ceremonies and side events
const DateBlock = ({ moment, small }: { moment: SideEvent; small?: boolean }) => (
    <>
        <div className={`grid grid-cols-3 items-center text-[#7a2a2a] ${small ? 'mt-4' : 'mt-6'}`}>
            <span className={`font-quicksand border-r border-[#d7b2b2] ${small ? 'text-base' : 'text-lg'}`}>
                {moment.time}
            </span>
            <span className={`font-cormorant leading-none ${small ? 'text-4xl' : 'text-5xl'}`}>{pad(moment.day)}</span>
            <span className={`font-quicksand uppercase border-l border-[#d7b2b2] ${small ? 'text-xs' : 'text-sm'}`}>
                {dayOfWeek(moment)}
            </span>
        </div>
        <p className={`font-quicksand tracking-[0.3em] text-[#7a2a2a] mt-2 ${small ? 'text-sm' : ''}`}>
            {formatDate(moment)}
        </p>
        {moment.lunarDate && (
            <p className='font-quicksand italic text-xs text-gray-500 mt-1'>({moment.lunarDate})</p>
        )}
    </>
)

const ExtraItem = ({ extra }: { extra: SideEvent }) => (
    <div className='relative rounded-[22px] bg-gradient-to-b from-rose-50 to-[#fbefef] border border-[#ecd3d3] px-4 pt-5 pb-5 text-center shadow-sm'>
        <div className='absolute inset-1.5 rounded-[18px] border border-dashed border-[#e5c4c4] pointer-events-none'></div>
        <p className='font-great-vibes text-3xl text-[#9f1239] leading-none'>{extra.title}</p>
        <DateBlock moment={extra} small />
        {extra.venue && (
            <p className='font-eb-garamond font-semibold text-[#7a2a2a] mt-4'>Tại: {extra.venue}</p>
        )}
        {extra.address && (
            <p className='font-quicksand text-sm text-gray-600 leading-relaxed mt-0.5'>{extra.address}</p>
        )}
        {extra.mapUrl && (
            <a
                href={extra.mapUrl}
                target='_blank'
                rel='noreferrer'
                className='relative inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full border border-[#7a2a2a] text-[#7a2a2a] font-quicksand text-sm hover:bg-[#7a2a2a] hover:text-white transition-colors'
            >
                <MapPin className='w-4 h-4' />
                Chỉ đường
            </a>
        )}
    </div>
)

export default function EventsSection({ events }: { events: WeddingEvent[] }) {
    const { elementRef, isVisible } = useScrollEffects({ threshold: 0.15 })
    // The hosting family is listed first, like on the printed invitation
    const familyOrder: Side[] =
        events.length === 1 && events[0].side === 'bride' ? ['bride', 'groom'] : ['groom', 'bride']

    return (
        <section ref={elementRef} id='events' className='paper-bg py-16 sm:py-20 px-6'>
            <div className='text-center mb-8'>
                <p className='font-quicksand uppercase tracking-[0.3em] text-sm text-[#9a5a5a]'>
                    Trân trọng kính mời
                </p>
                <h2 className='font-great-vibes text-5xl sm:text-6xl text-[#7a2a2a] mt-2'>
                    {events.length > 1 ? 'Sự kiện cưới' : events[0].title}
                </h2>
            </div>

            {/* Both families host the invitation */}
            <div
                className={`max-w-xl mx-auto grid grid-cols-2 divide-x divide-[#d7b2b2] text-center mb-10 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
            >
                {familyOrder.map((side) => {
                    const family = FAMILIES[side]
                    return (
                        <div key={side} className='px-3'>
                            <p className='font-quicksand uppercase tracking-[0.2em] text-xs text-[#9a5a5a]'>
                                {family.label}
                            </p>
                            <p className='font-eb-garamond text-[#7a2a2a] mt-2 leading-snug'>
                                Ông {family.father}
                                <br />
                                Bà {family.mother}
                            </p>
                            <p className='font-quicksand text-xs text-gray-500 mt-2 leading-relaxed'>
                                {family.address}
                            </p>
                        </div>
                    )
                })}
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
                        style={{ transitionDelay: `${200 + i * 250}ms` }}
                    >
                        <div className='absolute inset-2 rounded-[22px] border border-dashed border-[#d7b2b2] pointer-events-none'></div>

                        <h3 className='font-eb-garamond font-semibold uppercase tracking-[0.2em] text-xl text-[#7a2a2a]'>
                            {event.title}
                        </h3>

                        <DateBlock moment={event} />

                        <p className='font-eb-garamond font-semibold text-lg text-[#7a2a2a] mt-6'>
                            Tại: {event.venue}
                        </p>
                        <p className='font-quicksand text-sm text-gray-600 leading-relaxed mt-1'>{event.address}</p>

                        <a
                            href={event.mapUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='relative inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-[#7a2a2a] text-white font-quicksand text-sm shadow-md hover:bg-[#8e3434] transition-colors'
                        >
                            <MapPin className='w-4 h-4' />
                            Chỉ đường
                        </a>

                        {event.extras && event.extras.length > 0 && (
                            <div className='relative mt-6 space-y-3'>
                                {event.extras.map((extra) => (
                                    <ExtraItem key={extra.title} extra={extra} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className='mt-10 text-center font-great-vibes text-3xl text-[#9f1239]'>
                Rất hân hạnh được đón tiếp!
            </p>
        </section>
    )
}
