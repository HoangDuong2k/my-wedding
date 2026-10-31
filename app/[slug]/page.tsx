import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import WeddingInvitation from '@/components/WeddingInvitation'
import { CONFIGURATION, EVENTS, formatDate, guestMoment } from '@/constants/configuration'

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
    return {
        title: `${event.title} ${CONFIGURATION.groomName} & ${CONFIGURATION.brideName}`,
        description: `${guestMoment(event).time} · ${formatDate(guestMoment(event))} | Chúng mình cưới ♥`,
    }
}

export default async function EventPage({ params }: Props) {
    const { slug } = await params
    const event = EVENTS.find((e) => e.slug === slug)
    if (!event) notFound()
    return <WeddingInvitation events={[event]} />
}
