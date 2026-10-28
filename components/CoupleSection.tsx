'use client'

import Image from 'next/image'
import { CONFIGURATION, coupleInitials } from '@/constants/configuration'
import { useScrollEffects } from '@/hooks/use-scroll-effects'
import WaxSeal from './WaxSeal'

type Person = {
    role: string
    name: string
    shortName: string
    photo: string
    objectPosition: string
}

const NameFlourish = () => (
    <svg
        viewBox='0 0 200 16'
        className='w-36 sm:w-48 h-3 sm:h-4 mx-auto'
        aria-hidden
    >
        <path
            d='M2 10 C 40 14, 80 2, 120 8 S 180 14, 198 4'
            fill='none'
            stroke='#7a2a2a'
            strokeWidth='1'
            strokeLinecap='round'
        />
    </svg>
)

const NameLabel = ({
    person,
    visible,
    delay,
}: {
    person: Person
    visible: boolean
    delay: string
}) => {
    // Family + middle names on one line, the given name larger on the next
    const prefix = person.name.endsWith(person.shortName)
        ? person.name.slice(0, -person.shortName.length).trim()
        : ''
    return (
        <div
            className={`text-center transition-all duration-1000 ${delay} ${
                visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
            }`}
        >
            <p className='font-eb-garamond font-bold text-[#7a2a2a] text-xl sm:text-3xl'>
                {person.role}
            </p>
            {prefix && (
                <p className='font-cormorant uppercase text-[#7a2a2a] text-sm sm:text-xl tracking-[0.2em] mt-1'>
                    {prefix}
                </p>
            )}
            <p className='font-cormorant font-light uppercase text-[#7a2a2a] text-lg sm:text-3xl tracking-[0.06em] leading-tight'>
                {prefix ? person.shortName : person.name}
            </p>
            <NameFlourish />
        </div>
    )
}

const TiltedPhoto = ({
    person,
    rotate,
    visible,
    from,
}: {
    person: Person
    rotate: string
    visible: boolean
    from: string
}) => (
    <div
        className='transition-all duration-[1200ms] ease-out'
        style={{
            transform: visible ? `rotate(${rotate})` : `rotate(0deg) ${from}`,
            opacity: visible ? 1 : 0,
        }}
    >
        <div className='couple-frame group'>
            <Image
                src={person.photo}
                alt={`${person.role} ${person.name}`}
                width={480}
                height={480}
                quality={90}
                className='w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105'
                style={{ objectPosition: person.objectPosition }}
            />
        </div>
    </div>
)

export default function CoupleSection() {
    const { elementRef, isVisible } = useScrollEffects({ threshold: 0.25 })

    const bride: Person = {
        role: 'Cô Dâu',
        name: CONFIGURATION.brideFullName,
        shortName: CONFIGURATION.brideName,
        photo: '/the_bride_avatar.jpg',
        objectPosition: 'center 20%',
    }
    const groom: Person = {
        role: 'Chú Rể',
        name: CONFIGURATION.groomFullName,
        shortName: CONFIGURATION.groomName,
        photo: '/the_groom_avatar.jpg',
        objectPosition: 'center 20%',
    }
    const initials = coupleInitials()

    return (
        <section
            ref={elementRef}
            className='paper-bg py-16 sm:py-24 px-4 overflow-hidden'
        >
            <div className='text-center mb-6 sm:mb-10'>
                <h2 className='text-4xl md:text-5xl font-eb-garamond text-[#7a2a2a]'>
                    Giới thiệu
                </h2>
            </div>

            <div className='relative mx-auto w-full max-w-[640px] aspect-[4/5]'>
                {/* Bride: top-left photo, name on the right */}
                <div className='absolute left-[2%] top-[6%] w-[50%] sm:w-[56%]'>
                    <TiltedPhoto
                        person={bride}
                        rotate='-14deg'
                        visible={isVisible}
                        from='translateX(-30px)'
                    />
                </div>
                <div className='absolute right-0 top-[16%] w-[46%] sm:w-[42%]'>
                    <NameLabel
                        person={bride}
                        visible={isVisible}
                        delay='delay-500'
                    />
                </div>

                {/* Groom: bottom-right photo, name on the left */}
                <div className='absolute right-[2%] top-[44%] w-[50%] sm:w-[56%]'>
                    <TiltedPhoto
                        person={groom}
                        rotate='14deg'
                        visible={isVisible}
                        from='translateX(30px)'
                    />
                </div>
                <div className='absolute left-0 top-[62%] w-[46%] sm:w-[42%]'>
                    <NameLabel
                        person={groom}
                        visible={isVisible}
                        delay='delay-700'
                    />
                </div>

                {/* Seal where the two frames meet */}
                <div
                    className={`absolute left-[50%] top-[43%] w-[18%] -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 delay-1000 ${
                        isVisible
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-150'
                    }`}
                >
                    <WaxSeal
                        initials={initials}
                        className='w-full h-auto drop-shadow-lg'
                    />
                </div>
            </div>
        </section>
    )
}
