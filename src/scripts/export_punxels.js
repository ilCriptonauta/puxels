
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

const DESCRIPTION = "The Punxels are a lost people, once just strings of code in a forgotten mainframe, now seeking to rebuild a world where technology serves the spirit. Slowly, they are gathering the fragments of the past to construct a better future—a haven for the disconnected and the brave.";

async function exportPunxels() {
    console.log('🚀 Starting Punxel Export with Enhanced Metadata Format...');

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

        // 1. Transform and Save JSON metadata
        const metadata = {
            name: `Cyber Punxel #${idStr}`,
            description: DESCRIPTION,
            image: `${idStr}.png`,
            attributes: char.traits.map(t => ({
                trait_type: t.label,
                value: t.value
            }))
        };

        const jsonPath = path.join(JSON_DIR, `${idStr}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));

        // 2. Convert SVG to PNG
        const pngPath = path.join(PNG_DIR, `${idStr}.png`);
        try {
            await sharp(Buffer.from(char.svg))
                .png()
                .resize(1024, 1024, {
                    kernel: sharp.kernel.nearest,
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

    console.log('✨ Export and Metadata Enhancement Complete!');
    console.log(`📂 Files saved in: ${EXPORT_DIR}`);
}

exportPunxels();
