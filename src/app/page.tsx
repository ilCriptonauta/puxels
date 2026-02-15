import { Metadata, ResolvingMetadata } from 'next';
import HomePage from './HomePage';
import { generateCyberPixel } from '@/lib/pixel-engine';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await searchParams;
    const id = typeof params.id === 'string' ? parseInt(params.id) : null;

    if (id) {
        return {
            title: `Cyber Punxel #${id.toString().padStart(6, '0')} | CyberPunxels`,
            description: "Check out this #PUNXEL I just generated! ⚡️",
            openGraph: {
                title: `Cyber Punxel #${id.toString().padStart(6, '0')}`,
                description: "Check out this #PUNXEL I just generated! ⚡️",
                images: [`/api/og?id=${id}`],
            },
            twitter: {
                card: 'summary_large_image',
                title: `Cyber Punxel #${id.toString().padStart(6, '0')}`,
                description: "Check out this #PUNXEL I just generated! ⚡️",
                images: [`/api/og?id=${id}`],
            },
        };
    }

    return {
        title: "CyberPunxels GEN",
        description: "Create unique high-fidelity pixel art street warriors for the digital underworld.",
        openGraph: {
            title: "CyberPunxels GEN",
            description: "Create unique high-fidelity pixel art street warriors for the digital underworld.",
            images: ['/api/og?id=1'],
        },
        twitter: {
            card: 'summary_large_image',
            title: "CyberPunxels GEN",
            description: "Create unique high-fidelity pixel art street warriors for the digital underworld.",
            images: ['/api/og?id=1'],
        }
    };
}

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;
    const initialId = typeof params.id === 'string' ? parseInt(params.id) : undefined;

    return <HomePage initialId={initialId} />;
}
