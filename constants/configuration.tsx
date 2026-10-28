import type { ReactNode } from 'react'

export type Side = 'groom' | 'bride'

export type WeddingEvent = {
    // Route that shows only this event, e.g. /huong
    slug: string
    // Family hosting this ceremony; their bank account is listed first on its page
    side: Side
    title: string
    host: string
    time: string
    day: number
    month: number
    year: number
    address: ReactNode
    mapUrl: string
}

// TODO: dữ liệu giả, thay bằng thông tin thật
export const EVENTS: WeddingEvent[] = [
    {
        slug: 'huong',
        side: 'bride',
        title: 'Lễ Vu Quy',
        host: 'Tại tư gia nhà gái',
        time: '10:00',
        day: 9,
        month: 1,
        year: 2027,
        address: (
            <>
                Số 12, thôn Đông, xã Yên Phong
                <br />
                tỉnh Bắc Ninh
            </>
        ),
        mapUrl: 'https://maps.google.com/?q=Yen+Phong+Bac+Ninh',
    },
    {
        slug: 'hoang',
        side: 'groom',
        title: 'Lễ Thành Hôn',
        host: 'Tại tư gia nhà trai',
        time: '11:00',
        day: 10,
        month: 1,
        year: 2027,
        address: (
            <>
                Số 45, cụm 3, xã Tân Hội, huyện Đan Phượng
                <br />
                TP Hà Nội
            </>
        ),
        mapUrl: 'https://maps.google.com/?q=Tan+Hoi+Dan+Phuong+Ha+Noi',
    },
]

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

export const eventDate = (e: WeddingEvent) => {
    const [hour, minute] = e.time.split(':').map(Number)
    return new Date(e.year, e.month - 1, e.day, hour, minute)
}

export const dayOfWeek = (e: WeddingEvent) => WEEKDAYS[eventDate(e).getDay()]

export const formatDate = (e: WeddingEvent) =>
    `${String(e.day).padStart(2, '0')}.${String(e.month).padStart(2, '0')}.${e.year}`

export const CONFIGURATION = {
    groomFirst: true,
    // Short names for the banner and seals, full names for the introduction
    groomName: 'Việt Hoàng',
    brideName: 'Thu Hường',
    groomFullName: 'Dương Việt Hoàng',
    brideFullName: 'Bùi Thị Thu Hường',
}

export type BankAccount = {
    side: Side
    label: string
    qr: string
    accountName: string
    accountNumber: string
    bankName: string
}

// TODO: dữ liệu giả, thay bằng tài khoản và ảnh QR thật
export const BANK_ACCOUNTS: BankAccount[] = [
    {
        side: 'groom',
        label: 'Nhà trai',
        qr: '/qr_nha_trai.svg',
        accountName: 'Dương Việt Hoàng',
        accountNumber: '0123456789',
        bankName: 'VPBank',
    },
    {
        side: 'bride',
        label: 'Nhà gái',
        qr: '/qr_nha_gai.svg',
        accountName: 'Bùi Thị Thu Hường',
        accountNumber: '9876543210',
        bankName: 'Vietcombank',
    },
]

// Initials for the wax seals, e.g. "H&H"
export const coupleInitials = () => {
    const initial = (name: string) => name.trim().split(' ').pop()?.[0] ?? ''
    return CONFIGURATION.groomFirst
        ? `${initial(CONFIGURATION.groomName)}&${initial(CONFIGURATION.brideName)}`
        : `${initial(CONFIGURATION.brideName)}&${initial(CONFIGURATION.groomName)}`
}
