'use client'

import type React from 'react'

import CoupleSection from '@/components/CoupleSection'
import DoorIntro from '@/components/DoorIntro'
import FallingHearts from '@/components/FallingHearts'
import PhotoAlbum from '@/components/PhotoAlbum'
import EventsSection from '@/components/EventsSection'
import WeddingCalendar from '@/components/WeddingCalendar'
import {
    BANK_ACCOUNTS,
    CONFIGURATION,
    coupleInitials,
    type BankAccount,
    dayOfWeek,
    formatDate,
    type WeddingEvent,
} from '@/constants/configuration'
import { useScrollEffects } from '@/hooks/use-scroll-effects'
import { Gift, Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import AudioWedding from '@/components/ui/audio-wedding'

export default function WeddingInvitation({ events }: { events: WeddingEvent[] }) {
    const [opened, setOpened] = useState(false)
    const handleOpen = useCallback(() => setOpened(true), [])
    const [guestForm, setGuestForm] = useState({
        name: '',
        attendance: 'yes',
        guestCount: '1',
        wishes: '',
    })
    // Which ceremonies the guest will attend; preselected when the page shows only one
    const defaultSlugs = events.length === 1 ? [events[0].slug] : []
    const [attendingSlugs, setAttendingSlugs] = useState<string[]>(defaultSlugs)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')

    // Scroll effects for different sections
    const giftSection = useScrollEffects({ threshold: 0.2 })
    const guestSection = useScrollEffects({ threshold: 0.2 })
    const thankYouSection = useScrollEffects({ threshold: 0.3 })

    const initials = coupleInitials()
    // Staggered entrance for hero content once the doors open
    const reveal = (delay: number) => ({
        className: `transition-all duration-1000 ease-out ${
            opened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`,
        style: { transitionDelay: `${delay}ms` },
    })

    const carouselPhotos = [
        {
            src: '/carosel_1.jpg',
        },
        {
            src: '/carosel_3.jpg',
        },
        {
            src: '/carosel_4.jpg',
            style: {},
        },
        {
            src: '/carosel_5.jpg',
            // style: { objectPosition: "-70px top" },
            alt: 'Khoảnh khắc 5',
        },
        {
            src: '/carosel_6.jpg',
            // style: { objectPosition: "center 0px" },
        },
        '/carosel_7.jpg',
        {
            src: '/carosel_8.jpg',
            // style: { objectPosition: "-200px top" },
        },
        {
            src: '/carosel_9.jpg',
            // style: { objectPosition: "-40px top" },
        },
        '/carosel_2.jpg',
    ]

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const handleFormChange = (field: string, value: string) => {
        setGuestForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const accepted = guestForm.attendance === 'yes'
        const attending = events.filter((ev) => attendingSlugs.includes(ev.slug))
        if (accepted && attending.length === 0) {
            setSubmitError('Bạn chọn giúp mình lễ sẽ tham dự nhé')
            return
        }

        setIsSubmitting(true)
        setSubmitSuccess(false)
        setSubmitError('')

        const baseUrlEnv = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
        const baseUrl = baseUrlEnv.replace(/\/$/, '')

        const eventLine = (ev: WeddingEvent) =>
            `• ${ev.title} - ${ev.time} ${formatDate(ev)} (/${ev.slug})`

        // Gửi thông báo sang Telegram
        try {
            const telegramMessage = `
🎉 *Phản hồi mời cưới mới!*
🔗 *Thiệp:* ${events.length === 1 ? `/${events[0].slug}` : '/ (cả 2 lễ)'}

👤 *Tên khách:* ${guestForm.name.trim()}
${accepted ? '✅ *Tham dự:* Có' : '❌ *Tham dự:* Không'}
${accepted ? `📍 *Dự lễ:*\n${attending.map(eventLine).join('\n')}` : ''}
${accepted ? `👥 *Số khách:* ${guestForm.guestCount}` : ''}
${guestForm.wishes?.trim() ? `💌 *Lời chúc:* ${guestForm.wishes.trim()}` : ''}

📅 *Thời gian:* ${new Date().toLocaleString('vi-VN')}
        `
                .replace(/\n{3,}/g, '\n\n')
                .trim()

            const res = await fetch(`${baseUrl}/api/telegram/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: telegramMessage }),
            })
            if (!res.ok) throw new Error(`Telegram API returned ${res.status}`)

            setGuestForm({
                name: '',
                attendance: 'yes',
                guestCount: '1',
                wishes: '',
            })
            setAttendingSlugs(defaultSlugs)
            setSubmitSuccess(true)
            setTimeout(() => setSubmitSuccess(false), 2000)
        } catch (telegramError) {
            console.error(
                'Failed to send Telegram notification:',
                telegramError,
            )
            setSubmitError('Gửi chưa thành công, bạn thử lại giúp mình nhé')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Gift section helpers

    // On a single-ceremony page, the hosting family's account comes first
    const hostSide = events.length === 1 ? events[0].side : null
    const bankAccounts = [...BANK_ACCOUNTS].sort(
        (a, b) => Number(b.side === hostSide) - Number(a.side === hostSide),
    )
    const [copiedSide, setCopiedSide] = useState<string | null>(null)

    const copyAccountNumber = async (account: BankAccount) => {
        try {
            await navigator.clipboard.writeText(account.accountNumber)
            setCopiedSide(account.side)
            setTimeout(() => setCopiedSide(null), 1500)
        } catch (err) {
            console.error('Failed to copy STK', err)
        }
    }

    const downloadQrImage = (account: BankAccount) => {
        try {
            const link = document.createElement('a')
            link.href = account.qr
            link.download = `qr-mung-cuoi-${account.side === 'groom' ? 'nha-trai' : 'nha-gai'}${
                account.qr.slice(account.qr.lastIndexOf('.'))
            }`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Failed to download QR', err)
        }
    }

    return (
        <div className='min-h-screen paper-bg'>
            <DoorIntro initials={initials} onOpen={handleOpen} />
            <FallingHearts />

            {/* Hero Banner Section */}
            <section className='relative h-[100svh] flex items-center justify-center overflow-hidden'>
                {/* One banner photo for every screen size; slow zoom-out once opened */}
                <div className='absolute inset-0'>
                    <Image
                        src='/banner_desktop.jpg'
                        alt='Wedding couple'
                        fill
                        priority
                        sizes='100vw'
                        quality={90}
                        className={`object-cover object-center ${opened ? 'animate-kenBurns' : 'scale-110'}`}
                    />
                    <div className='absolute inset-0 bg-black/30'></div>
                    <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#5a1418]/80 via-[#5a1418]/30 to-transparent'></div>
                </div>

                {/* Content Overlay */}
                <div className='relative z-10 text-center text-white px-6 w-full max-w-3xl mx-auto mt-auto mb-10 sm:mb-14'>
                    <p {...reveal(300)} className={`${reveal(300).className} font-great-vibes text-4xl sm:text-5xl md:text-6xl`}>
                        Save the Date
                    </p>

                    <h1
                        {...reveal(600)}
                        className={`${reveal(600).className} mt-3 font-cormorant uppercase font-light tracking-[0.12em] text-3xl sm:text-5xl leading-tight`}
                    >
                        <span className='block lg:inline'>
                            {CONFIGURATION.groomFirst ? CONFIGURATION.groomName : CONFIGURATION.brideName}
                        </span>
                        <span className='block lg:inline font-great-vibes normal-case lg:mx-4 text-4xl sm:text-5xl'>&</span>
                        <span className='block lg:inline'>
                            {CONFIGURATION.groomFirst ? CONFIGURATION.brideName : CONFIGURATION.groomName}
                        </span>
                    </h1>

                    <div {...reveal(900)} className={`${reveal(900).className} mt-6 space-y-4 font-quicksand`}>
                        {events.map((event) => (
                            <div key={event.slug}>
                                {events.length > 1 && (
                                    <p className='uppercase tracking-[0.3em] text-xs sm:text-sm opacity-90 mb-1'>
                                        {event.title}
                                    </p>
                                )}
                                <div className='flex items-center justify-center gap-4'>
                                    <span className='h-px w-8 sm:w-16 bg-white/60'></span>
                                    <span className='text-base sm:text-xl tracking-[0.2em]'>
                                        {event.time} · {formatDate(event)}
                                    </span>
                                    <span className='h-px w-8 sm:w-16 bg-white/60'></span>
                                </div>
                                <p className='mt-1 uppercase tracking-[0.3em] text-xs sm:text-sm opacity-90'>
                                    {dayOfWeek(event)}
                                </p>
                                {events.length === 1 && (
                                    <p className='mt-4 text-xs sm:text-sm opacity-90 leading-relaxed'>
                                        {event.address}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Action Icons */}
                    <div {...reveal(1500)} className={`${reveal(1500).className} flex justify-center gap-3 sm:gap-4 pt-6`}>
                        <button
                            onClick={() =>
                                events.length === 1
                                    ? window.open(events[0].mapUrl, '_blank')
                                    : scrollToSection('events')
                            }
                            className='p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer'
                            title='Xem bản đồ'
                        >
                            <MapPin className='w-5 h-5 sm:w-6 sm:h-6' />
                        </button>
                        <button
                            onClick={() => scrollToSection('gift')}
                            className='p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer'
                            title='Mừng cưới'
                        >
                            <Gift className='w-5 h-5 sm:w-6 sm:h-6' />
                        </button>
                        <button
                            onClick={() => scrollToSection('guest')}
                            className='p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer'
                            title='Xác nhận tham dự'
                        >
                            <Heart className='w-5 h-5 sm:w-6 sm:h-6' />
                        </button>
                    </div>
                </div>
            </section>

            <CoupleSection />

            <EventsSection events={events} />

            <WeddingCalendar events={events} />

            {/* Photo Album Section */}
            <PhotoAlbum photos={carouselPhotos} />

            {/* Gift Section - Mừng Cưới */}
            <section
                ref={giftSection.elementRef}
                id='gift'
                className='py-20 px-6 paper-bg'
            >
                <div className='max-w-3xl mx-auto text-center'>
                    <div
                        className={`transition-all duration-1000 ${
                            giftSection.isVisible
                                ? 'animate-scaleIn opacity-100'
                                : 'opacity-0 scale-90'
                        }`}
                    >
                        <h2 className='text-5xl md:text-6xl font-ballet text-[#8c4a4a] mb-6'>
                            Mừng Cưới
                        </h2>
                        <p className='text-gray-600 font-quicksand leading-relaxed max-w-2xl mx-auto'>
                            Mình rất muốn được chụp chung với bạn những tấm hình
                            kỷ niệm vì vậy hãy đến sớm hơn một chút bạn yêu nhé!
                            Đám cưới của chúng mình sẽ trọn vẹn hơn khi có thêm
                            lời chúc phúc và sự hiện diện của các bạn.
                        </p>
                    </div>

                    {/* One QR + bank info card per family */}
                    <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left'>
                        {bankAccounts.map((account, i) => (
                            <div
                                key={account.side}
                                className={`border-2 border-dashed border-[#b77c7c] rounded-2xl p-6 bg-rose-50/40 transition-all duration-1000 ${
                                    giftSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{ transitionDelay: `${300 + i * 200}ms` }}
                            >
                                <p className='text-center font-eb-garamond font-semibold uppercase tracking-[0.2em] text-xl text-[#7a2a2a] mb-4'>
                                    {account.label}
                                </p>
                                <button
                                    type='button'
                                    onClick={() => downloadQrImage(account)}
                                    className='block w-full max-w-56 mx-auto rounded-xl overflow-hidden shadow hover:shadow-md focus:outline-none'
                                    title='Bấm để tải ảnh QR'
                                >
                                    <img
                                        src={account.qr}
                                        alt={`QR chuyển khoản ${account.label.toLowerCase()}`}
                                        className='w-full h-auto object-contain bg-white cursor-pointer'
                                    />
                                </button>
                                <div className='mt-5 space-y-1.5 font-quicksand text-gray-800 text-center'>
                                    <p>
                                        <span className='font-medium'>CTK:</span> {account.accountName}
                                    </p>
                                    <p>
                                        <span className='font-medium'>STK:</span>{' '}
                                        <button
                                            type='button'
                                            onClick={() => copyAccountNumber(account)}
                                            className='underline decoration-dotted text-rose-700 hover:text-rose-800 cursor-pointer'
                                            title='Bấm để copy STK'
                                        >
                                            {account.accountNumber}
                                        </button>
                                        {copiedSide === account.side && (
                                            <span className='ml-2 text-xs text-emerald-600'>Đã copy</span>
                                        )}
                                    </p>
                                    <p>
                                        <span className='font-medium'>NH:</span> {account.bankName}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className='mt-6 text-sm text-gray-600 font-quicksand'>
                        Bấm vào STK để copy hoặc bấm vào ảnh QR để lưu
                    </p>
                </div>
            </section>

            {/* Guest Information Form Section */}
            <section
                ref={guestSection.elementRef}
                id='guest'
                className='py-20 px-6 bg-[#f6ecea]'
            >
                <div className='max-w-2xl mx-auto'>
                    <div
                        className={`text-center mb-12 transition-all duration-1000 ${
                            guestSection.isVisible
                                ? 'animate-slideInFromBottom opacity-100'
                                : 'opacity-0 translate-y-12'
                        }`}
                    >
                        <h2 className='text-4xl md:text-5xl font-eb-garamond text-gray-800 mb-4'>
                            Xác Nhận Tham Dự
                        </h2>
                        <p className='text-lg font-quicksand text-gray-600 leading-relaxed'>
                            Chúng tôi rất mong được chia sẻ niềm vui này cùng
                            bạn
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className='backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50'
                    >
                        <div className='space-y-6'>
                            {/* Guest Name */}
                            <div>
                                <label className='block text-sm font-quicksand font-medium text-gray-700 mb-2'>
                                    Tên khách mời *
                                </label>
                                <input
                                    type='text'
                                    required
                                    value={guestForm.name}
                                    onChange={(e) =>
                                        handleFormChange('name', e.target.value)
                                    }
                                    className='w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-quicksand'
                                    placeholder='Nhập tên của bạn'
                                />
                            </div>

                            {/* Attendance Confirmation */}
                            <div>
                                <label className='block text-sm font-quicksand font-medium text-gray-700 mb-3'>
                                    Xác nhận tham dự *
                                </label>
                                <div className='space-y-3'>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            name='attendance'
                                            value='yes'
                                            checked={
                                                guestForm.attendance === 'yes'
                                            }
                                            onChange={(e) =>
                                                handleFormChange(
                                                    'attendance',
                                                    e.target.value,
                                                )
                                            }
                                            className='w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300'
                                        />
                                        <span className='ml-3 font-quicksand text-gray-700'>
                                            Có, tôi sẽ tham dự
                                        </span>
                                    </label>
                                    <label className='flex items-center'>
                                        <input
                                            type='radio'
                                            name='attendance'
                                            value='no'
                                            checked={
                                                guestForm.attendance === 'no'
                                            }
                                            onChange={(e) =>
                                                handleFormChange(
                                                    'attendance',
                                                    e.target.value,
                                                )
                                            }
                                            className='w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300'
                                        />
                                        <span className='ml-3 font-quicksand text-gray-700'>
                                            Xin lỗi, tôi bận mất rồi
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Which ceremony - Only show if attending */}
                            {guestForm.attendance === 'yes' && (
                                <div>
                                    <label className='block text-sm font-quicksand font-medium text-gray-700 mb-3'>
                                        {events.length > 1
                                            ? 'Bạn sẽ dự lễ nào? * (chọn được cả hai)'
                                            : 'Địa điểm bạn sẽ tham dự'}
                                    </label>
                                    <div className='grid gap-3'>
                                        {events.map((ev) => {
                                            const checked = attendingSlugs.includes(ev.slug)
                                            return (
                                                <label
                                                    key={ev.slug}
                                                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                                                        events.length > 1 ? 'cursor-pointer' : ''
                                                    } ${
                                                        checked
                                                            ? 'border-rose-400 bg-rose-50/70'
                                                            : 'border-gray-200 bg-white/70 hover:border-rose-200'
                                                    }`}
                                                >
                                                    {events.length > 1 && (
                                                        <input
                                                            type='checkbox'
                                                            checked={checked}
                                                            onChange={() => {
                                                                setSubmitError('')
                                                                setAttendingSlugs((prev) =>
                                                                    checked
                                                                        ? prev.filter((s) => s !== ev.slug)
                                                                        : [...prev, ev.slug],
                                                                )
                                                            }}
                                                            className='mt-1 w-4 h-4 accent-rose-500'
                                                        />
                                                    )}
                                                    <span className='font-quicksand text-gray-700'>
                                                        <span className='font-semibold text-[#7a2a2a]'>
                                                            {ev.title}
                                                        </span>{' '}
                                                        · {ev.time} {dayOfWeek(ev)}, {formatDate(ev)}
                                                        <span className='block text-sm text-gray-500 mt-0.5'>
                                                            {ev.address}
                                                        </span>
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Guest Count - Only show if attending */}
                            {guestForm.attendance === 'yes' && (
                                <div>
                                    <label className='block text-sm font-quicksand font-medium text-gray-700 mb-3'>
                                        Số lượng khách
                                    </label>
                                    <div className='flex gap-4'>
                                        {['1', '2', '3'].map((count) => (
                                            <label
                                                key={count}
                                                className='flex items-center'
                                            >
                                                <input
                                                    type='radio'
                                                    name='guestCount'
                                                    value={count}
                                                    checked={
                                                        guestForm.guestCount ===
                                                        count
                                                    }
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            'guestCount',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className='w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300'
                                                />
                                                <span className='ml-2 font-quicksand text-gray-700'>
                                                    {count}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Wishes */}
                            <div>
                                <label className='block text-sm font-quicksand font-medium text-gray-700 mb-2'>
                                    Lời chúc
                                </label>
                                <textarea
                                    value={guestForm.wishes}
                                    onChange={(e) =>
                                        handleFormChange(
                                            'wishes',
                                            e.target.value,
                                        )
                                    }
                                    rows={4}
                                    className='w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm resize-none font-quicksand'
                                    placeholder='Gửi lời chúc tốt đẹp đến cô dâu chú rể...'
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type='submit'
                                disabled={isSubmitting || submitSuccess}
                                className={`${
                                    submitSuccess
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : isSubmitting
                                        ? 'bg-rose-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                                } w-full text-white font-quicksand font-medium py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className='inline-block h-5 w-5 rounded-full border-2 border-white/60 border-t-transparent animate-spin'></span>
                                        <span>Đang gửi...</span>
                                    </>
                                ) : submitSuccess ? (
                                    <span>Đã gửi thành công!</span>
                                ) : (
                                    <span>Gửi xác nhận</span>
                                )}
                            </button>
                            {submitError && (
                                <p className='text-center text-sm font-quicksand text-rose-600 -mt-2'>
                                    {submitError}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </section>
            {/* Thank You Section */}
            <section
                ref={thankYouSection.elementRef}
                id='thank-you'
                className='py-24 px-6 paper-bg'
            >
                <div className='max-w-4xl mx-auto'>
                    <div
                        className={`relative flex flex-col items-center transition-all duration-1000 ${
                            thankYouSection.isVisible
                                ? 'animate-bounceIn opacity-100'
                                : 'opacity-0 scale-90'
                        }`}
                    >
                        {/* Floral background frame */}
                        <Image
                            src='/thankyou_flower_background.png'
                            alt='Floral frame'
                            className='z-10 pointer-events-none select-none w-[400px] h-[600px] -top-[90px]  sm:w-[680px] sm:h-[830px] sm:-top-[140px] max-w-full absolute left-1/2 -translate-x-1/2'
                            aria-hidden
                            width={680}
                            height={830}
                            quality={100}
                        />
                        {/* Arched photo */}
                        <div className='relative w-[300] h-[400px] rounded-[160px] sm:w-[380px] sm:h-[540px] sm:rounded-[180px]  overflow-hidden shadow-xl border-2 border-rose-300 bg-white'>
                            <Image
                                src='/thankyou_bride_groom.jpg'
                                alt='Bride and Groom'
                                className='w-full h-full object-cover'
                                width={376}
                                height={536}
                                quality={100}
                            />
                        </div>

                        {/* Title */}
                        <h3 className='mt-14 md:mt-18 text-[68px] leading-none md:text-[108px] font-eb-garamond text-[#7d4a4a] text-center'>
                            Thank you!
                        </h3>
                    </div>
                </div>
            </section>
            <section className='h-30'></section>
            {/* Music */}
            <AudioWedding />
        </div>
    )
}
