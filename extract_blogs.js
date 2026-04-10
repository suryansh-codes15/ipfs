import fs from 'fs';

const htmlPath = 'blogs.html';
const html = fs.readFileSync(htmlPath, 'utf-8');

// More robust regex for blog cards
const cardRegex = /<div class="blog-card (dark-card|light-card)[\s\S]*?">([\s\S]*?)<\/div>\s*<\/div>/g;
let match;
const blogCards = [];

while ((match = cardRegex.exec(html)) !== null) {
    const themeClass = match[1];
    const content = match[2];

    const extract = (tagRegex) => {
        const m = content.match(tagRegex);
        return m ? m[1].replace(/<[^>]*>?/gm, '').trim() : '';
    };

    const title = extract(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const description = extract(/<p class="blog-desc">([\s\S]*?)<\/p>/);
    const meta = extract(/<div class="blog-meta">([\s\S]*?)<\/div>/);
    const imgMatch = content.match(/<img[^>]*src="([^"]+)"/);
    const pdfMatch = content.match(/<a[^>]*href="([^"]+\.pdf)"/);
    const readMatch = content.match(/<a[^>]*href="([^"]+\.html)"/);
    const comingSoonMatch = content.includes('coming-soon-badge');

    if (title || description) {
        blogCards.push({
            title,
            description: description.replace(/\s+/g, ' '),
            meta,
            image_url: imgMatch ? imgMatch[1] : '',
            pdf_url: pdfMatch ? pdfMatch[1] : null,
            read_url: readMatch ? readMatch[1] : null,
            theme: themeClass === 'dark-card' ? 'dark' : 'light',
            is_coming_soon: comingSoonMatch,
        });
    }
}

fs.writeFileSync('blogs_data.json', JSON.stringify(blogCards, null, 2));
console.log(`Extracted ${blogCards.length} blogs to blogs_data.json`);
