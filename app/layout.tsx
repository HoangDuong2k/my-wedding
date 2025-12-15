import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from './client-layout'

export const metadata: Metadata = {
    title: 'Thiệp mời Đám cưới Thạc Huy & Thúy Mây',
    description: '28-12-2025 | Chúng mình cưới ♥',
    openGraph: {
        title: 'Thạc Huy & Thúy Mây',
        description:
            'Thiệp cưới online của Thạc Huy & Thúy Mây | Nơi gửi gắm lời mời trân trọng và những câu chuyện tình yêu thật đẹp.',
        type: 'website',
        url: 'https://nguyenthachuy.io.vn/',
        images: [
            {
                url: 'thumbnail-3.jpg',
                width: 1200,
                height: 630,
                alt: 'Thạc Huy & Thuý Mây - Thiệp cưới online',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Thạc Huy & Thúy Mây',
        description:
            'Thiệp cưới online của Thạc Huy & Thúy Mây | Nơi gửi gắm lời mời trân trọng và những câu chuyện tình yêu thật đẹp.',
        images: ['thumbnail-3.jpg'],
    },
    icons: {
        icon: [
            {
                url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect fill='white' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-size='40' font-family='-apple-system, BlinkMacSystemFont, %22Segoe UI%22, Roboto, Helvetica, Arial, sans-serif' fill='%23e11d48'%3E%E2%99%A5%3C/text%3E%3C/svg%3E",
                type: 'image/svg+xml',
                rel: 'icon',
            },
        ],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    )
}
