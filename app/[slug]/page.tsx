import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WeddingInvitation from '@/components/WeddingInvitation'
import { CONFIGURATION, EVENTS, formatDate } from '@/constants/configuration'

// Only the slugs defined in EVENTS exist, e.g. /huong and /hoang
export const dynamicParams = false

export function generateStaticParams() {
    return EVENTS.map((event) => ({ slug: event.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const event = EVENTS.find((e) => e.slug === params.slug)
    if (!event) return {}
    return {
        title: `${event.title} ${CONFIGURATION.groomName} & ${CONFIGURATION.brideName}`,
        description: `${event.time} · ${formatDate(event)} | Chúng mình cưới ♥`,
    }
}

export default function EventPage({ params }: { params: { slug: string } }) {
    const event = EVENTS.find((e) => e.slug === params.slug)
    if (!event) notFound()
    return <WeddingInvitation events={[event]} />
}
