import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WeddingInvitation from '@/components/WeddingInvitation'
import { coupleOrder, dayOfWeek, EVENTS, formatDate, guestMoment } from '@/constants/configuration'

// Only the slugs defined in EVENTS exist, e.g. /huong and /hoang
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
    return EVENTS.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const event = EVENTS.find((e) => e.slug === slug)
    if (!event) return {}
    const couple = coupleOrder(event.side === 'bride').join(' & ')
    const moment = guestMoment(event)
    const title = `${event.title} ${couple}`
    const description = `${moment.title} · ${moment.time} ${dayOfWeek(moment)}, ${formatDate(moment)} | Trân trọng kính mời bạn tới chung vui cùng gia đình chúng mình ♥`
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `/${event.slug}`,
            locale: 'vi_VN',
            images: [{ url: event.shareImage, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [event.shareImage] },
    }
}

export default async function EventPage({ params }: Props) {
    const { slug } = await params
    const event = EVENTS.find((e) => e.slug === slug)
    if (!event) notFound()
    return <WeddingInvitation events={[event]} />
}
