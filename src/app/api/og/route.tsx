import { ImageResponse } from 'next/og';
import { generateCyberPixel } from '@/lib/pixel-engine';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const idStr = searchParams.get('id');
        const id = idStr ? parseInt(idStr) : 1;

        const art = generateCyberPixel(id);

        // We need to parse the SVG content to render it in ImageResponse (React-like)
        // Actually, ImageResponse can take SVG directly if we are careful, or we can render it with divs.
        // Given the pixel nature, rendering with a grid of small divs is perfect.

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1E293B',
                        padding: '40px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            padding: '24px',
                            border: '8px solid #000',
                            boxShadow: '20px 20px 0 #00F2FF',
                        }}
                    >
                        {/* We'll embed the SVG as a data URI for the background or just use the SVG content */}
                        <div
                            style={{
                                display: 'flex',
                                width: '400px',
                                height: '400px'
                            }}
                            dangerouslySetInnerHTML={{ __html: art.svg.replace('<svg', '<svg width="400" height="400"') }}
                        />

                        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', fontFamily: 'monospace' }}>
                                PUNXEL #{id.toString().padStart(6, '0')}
                            </span>
                            <span style={{ fontSize: '18px', color: '#666', marginTop: '8px' }}>
                                @CYBERPUNXELS_GEN
                            </span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
