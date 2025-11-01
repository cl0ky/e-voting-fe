'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ServerRedirect({
    href,
    duration = 1000,
    type = 'replace',
}: {
    href: string;
    duration?: number;
    type?: 'replace' | 'push';
}) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (type === 'push') router.push(href);
            else router.replace(href);
        }, duration || 1000);

        return () => clearTimeout(timer);
    }, [duration, href, router, type]);

    return null;
}