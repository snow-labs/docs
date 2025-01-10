import { json } from '@sveltejs/kit';

interface Frontmatter {
    title?: string;
    'sidebar-position'?: number;
}

function parseFrontmatter(rawContent: string): { frontmatter: Frontmatter; content: string } {
    const lines = rawContent.split(/\r?\n/);
    if (lines[0] !== '---') {
        return { frontmatter: {}, content: rawContent };
    }

    const frontmatter: Frontmatter = {};
    let i = 1;
    
    // Find the end of frontmatter
    while (i < lines.length && lines[i] !== '---') {
        const line = lines[i].trim();
        if (line) {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            
            if (key === 'sidebar-position') {
                frontmatter[key] = parseInt(value);
            } else if (key === 'title') {
                frontmatter.title = value;
            }
        }
        i++;
    }

    // Skip the closing --- and join the rest as content
    const mainContent = lines.slice(i + 1).join('\n');

    return { frontmatter, content: mainContent };
}

export async function GET() {
    const markdownFiles = import.meta.glob('/static/docs/**/*.md', { eager: true, as: 'raw' });
    const files = [];

    for (const [path, content] of Object.entries(markdownFiles)) {
        const relativePath = path
            .replace('/static/docs/', '')
            .replace('.md', '');
        
        const { frontmatter } = parseFrontmatter(content);

        if (path.endsWith('index.md')) {
            files.unshift({
                path: 'index',
                title: 'Introduction',
                position: frontmatter['sidebar-position'] || 0
            });
        } else {
            files.push({
                path: relativePath,
                title: frontmatter.title || relativePath,
                position: frontmatter['sidebar-position'] || 999
            });
        }
    }

    files.sort((a, b) => a.position - b.position);
    return json(files);
} 