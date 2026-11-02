import type { ReactNode } from 'react'

export type Side = 'groom' | 'bride'

// A smaller gathering tied to a ceremony, e.g. the dinner the evening before
export type SideEvent = {
    title: string
    time: string
    day: number
    month: number
    year: number
    lunarDate?: string
    // Guests can confirm attendance to this gathering separately from the ceremony
    rsvp?: boolean
    venue?: string
    address?: ReactNode
    mapUrl?: string
}

export type WeddingEvent = {
    // Route that shows only this event, e.g. /huong
    slug: string
    // Family hosting this ceremony; their bank account is listed first on its page
    side: Side
    title: string
    venue: string
    time: string
    day: number
    month: number
    year: number
    lunarDate: string
    address: ReactNode
    mapUrl: string
    // 1200x630 image shown when this event's link is shared on Zalo/Facebook
    shareImage: string
    extras?: SideEvent[]
    // Index into extras of the gathering guests are invited to, when it is not the ceremony itself;
    // the banner, calendar, countdown and RSVP use that date instead
    guestExtra?: number
}

const NGAN_HA_HOTEL_MAP =
    'https://www.google.com/maps/place/Kh%C3%A1ch+S%E1%BA%A1n+Ng%C3%A2n+H%C3%A0/@18.3469029,105.8882231,17z/data=!4m9!3m8!1s0x31384e6d633605e7:0x8f353057a7e43fd7!5m2!4m1!1i2!8m2!3d18.3469029!4d105.8882231!16s%2Fg%2F1hc0vr8g_'

export const EVENTS: WeddingEvent[] = [
    {
        slug: 'huong',
        side: 'bride',
        title: 'Lễ Vu Quy',
        venue: 'Tư gia nhà gái',
        time: '11:00',
        day: 16,
        month: 11,
        year: 2026,
        lunarDate: 'Ngày 08 tháng 10 năm Bính Ngọ',
        address: 'Thôn Hợp Tiến, xã Cao Phong, tỉnh Phú Thọ',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=20.737702819209584,105.3525185173112',
        shareImage: '/photos/og-huong.jpg',
        extras: [
            {
                title: 'Bữa cơm thân mật',
                rsvp: true,
                time: '16:30',
                day: 15,
                month: 11,
                year: 2026,
                lunarDate: 'Ngày 07 tháng 10 năm Bính Ngọ',
                venue: 'Nhà văn hoá Thiều Nau (Thu Phong)',
                address: 'Thôn Hợp Tiến, xã Cao Phong, tỉnh Phú Thọ',
                mapUrl: 'https://maps.app.goo.gl/GGHb8qzj8ZYbUmXdA',
            },
        ],
        guestExtra: 0,
    },
    {
        slug: 'hoang',
        side: 'groom',
        title: 'Lễ Thành Hôn',
        venue: 'Hội trường tầng 1 – Khách sạn Ngân Hà',
        time: '11:00',
        day: 29,
        month: 11,
        year: 2026,
        lunarDate: 'Ngày 21 tháng 10 năm Bính Ngọ',
        address: 'Số 158 đường Trần Phú, phường Thành Sen, tỉnh Hà Tĩnh',
        mapUrl: NGAN_HA_HOTEL_MAP,
        shareImage: '/photos/og-hoang.jpg',
        extras: [
            {
                title: 'Lễ rước dâu',
                time: '09:20',
                day: 29,
                month: 11,
                year: 2026,
                lunarDate: 'Ngày 21 tháng 10 năm Bính Ngọ',
                venue: 'Khách sạn Ngân Hà',
                address: 'Số 158 đường Trần Phú, phường Thành Sen, tỉnh Hà Tĩnh',
                mapUrl: NGAN_HA_HOTEL_MAP,
            },
        ],
    },
]

export type Family = {
    label: string
    father: string
    mother: string
    address: string
}

export const FAMILIES: Record<Side, Family> = {
    groom: {
        label: 'Nhà trai',
        father: 'Dương Đình Duệ',
        mother: 'Nguyễn Thị Chinh',
        address: 'Số 09, ngõ 17, đường Nguyễn Huy Tự, TDP 13, phường Thành Sen, Hà Tĩnh',
    },
    bride: {
        label: 'Nhà gái',
        father: 'Bùi Thế Quyên',
        mother: 'Bùi Thị Như',
        address: 'Thôn Hợp Tiến, xã Cao Phong, tỉnh Phú Thọ',
    },
}

// The date guests should come: the guest gathering if there is one, otherwise the ceremony
export const guestMoment = (e: WeddingEvent): SideEvent =>
    e.guestExtra !== undefined && e.extras?.[e.guestExtra] ? e.extras[e.guestExtra] : e

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

export const eventDate = (e: WeddingEvent | SideEvent) => {
    const [hour, minute] = e.time.split(':').map(Number)
    return new Date(e.year, e.month - 1, e.day, hour, minute)
}

export const dayOfWeek = (e: WeddingEvent | SideEvent) => WEEKDAYS[eventDate(e).getDay()]

export const formatDate = (e: WeddingEvent | SideEvent) =>
    `${String(e.day).padStart(2, '0')}.${String(e.month).padStart(2, '0')}.${e.year}`

export const SITE = {
    url: 'https://gaosausubebi.io.vn',
    shareImage: '/photos/og.jpg',
}

export const CONFIGURATION = {
    groomName: 'Việt Hoàng',
    brideName: 'Thu Hường',
}

export type BankAccount = {
    side: Side
    label: string
    qr: string
    accountName: string
    accountNumber: string
    bankName: string
}

export const BANK_ACCOUNTS: BankAccount[] = [
    {
        side: 'groom',
        label: 'Nhà trai',
        qr: '/photos/qr-nha-trai.png',
        accountName: 'Dương Việt Hoàng',
        accountNumber: '0941099936',
        bankName: 'VPBank',
    },
    {
        side: 'bride',
        label: 'Nhà gái',
        qr: '/photos/qr-nha-gai.png',
        accountName: 'Bùi Thị Thu Hường',
        accountNumber: '1061710179',
        bankName: 'Vietcombank',
    },
]

// Everything a guest can confirm attending, in date order: each ceremony plus its RSVP-able side events
export type RsvpOption = { key: string; event: WeddingEvent; moment: SideEvent }

export const rsvpOptions = (events: WeddingEvent[]): RsvpOption[] =>
    events
        .flatMap((event) =>
            [...(event.extras ?? []).filter((x) => x.rsvp), event].map((moment) => ({
                key: `${event.slug}:${moment.title}`,
                event,
                moment,
            })),
        )
        .sort((a, b) => eventDate(a.moment).getTime() - eventDate(b.moment).getTime())

// Names in display order; the bride's own invitation (/huong) lists her first, like the printed card
export const coupleOrder = (brideFirst = false) =>
    brideFirst
        ? [CONFIGURATION.brideName, CONFIGURATION.groomName]
        : [CONFIGURATION.groomName, CONFIGURATION.brideName]

// Initials for the wax seals, e.g. "H&H"
export const coupleInitials = (brideFirst = false) =>
    coupleOrder(brideFirst)
        .map((name) => name.trim().split(' ').pop()?.[0] ?? '')
        .join('&')
