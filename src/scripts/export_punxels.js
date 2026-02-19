
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const supabaseUrl = 'https://dauhjaidotzahufwiaqd.supabase.co';
const supabaseKey = 'sb_publishable_yetWM2mTmzXi9Bovk7r4KQ_h4Lq1b2Y';
const supabase = createClient(supabaseUrl, supabaseKey);

const EXPORT_DIR = path.join(__dirname, '../../exports/punxels_v1');
const PNG_DIR = path.join(EXPORT_DIR, 'png');
const JSON_DIR = path.join(EXPORT_DIR, 'json');

async function exportPunxels() {
    console.log('🚀 Starting Punxel Export with Pagination...');

    // Create directories
    if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR, { recursive: true });
    if (!fs.existsSync(PNG_DIR)) fs.mkdirSync(PNG_DIR, { recursive: true });
    if (!fs.existsSync(JSON_DIR)) fs.mkdirSync(JSON_DIR, { recursive: true });

    let allCharacters = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
        console.log(`Fetching from ${from} to ${from + step - 1}...`);
        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .range(from, from + step - 1)
            .order('id', { ascending: true });

        if (error) {
            console.error('❌ Error fetching characters:', error);
            break;
        }

        allCharacters = allCharacters.concat(data);
        if (data.length < step) {
            hasMore = false;
        } else {
            from += step;
        }
    }

    console.log(`📦 Found ${allCharacters.length} characters total. Processing...`);

    for (const char of allCharacters) {
        const idStr = char.id.toString().padStart(6, '0');

        // 1. Save JSON traits
        const jsonPath = path.join(JSON_DIR, `${idStr}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(char.traits, null, 2));

        // 2. Convert SVG to PNG
        // We'll resize them to 1024x1024 for high quality
        const pngPath = path.join(PNG_DIR, `${idStr}.png`);
        try {
            await sharp(Buffer.from(char.svg))
                .png()
                .resize(1024, 1024, {
                    kernel: sharp.kernel.nearest, // Keep pixel art sharp
                    fit: 'contain'
                })
                .toFile(pngPath);

            if (char.id % 100 === 0) {
                console.log(`✅ Processed up to #${char.id}`);
            }
        } catch (err) {
            console.error(`❌ Failed to convert #${char.id}:`, err);
        }
    }

    console.log('✨ Export Complete!');
    console.log(`📂 Files saved in: ${EXPORT_DIR}`);
}

exportPunxels();
