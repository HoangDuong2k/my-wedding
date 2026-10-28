import WeddingInvitation from '@/components/WeddingInvitation'
import { EVENTS } from '@/constants/configuration'

export default function HomePage() {
    return <WeddingInvitation events={EVENTS} />
}
