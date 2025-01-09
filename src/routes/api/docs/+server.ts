import { json } from '@sveltejs/kit';

export async function GET() {
    const markdownFiles = import.meta.glob('/static/docs/**/*.md', { eager: true, as: 'raw' });
    const files = [];

    for (const [path, content] of Object.entries(markdownFiles)) {
        const relativePath = path
            .replace('/static/docs/', '')
            .replace('.md', '');
        
        const firstLine = content.split('\n')[0];
        const title = firstLine.replace(/^#\s+/, '') || relativePath;

        if (path.endsWith('index.md')) {
            files.unshift({
                path: 'index',
                title: 'Introduction'
            });
        } else {
            files.push({
                path: relativePath,
                title: title
            });
        }
    }

    return json(files);
} 