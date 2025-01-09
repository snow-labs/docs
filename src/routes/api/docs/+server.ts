import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

function getFiles(dir: string, baseDir: string = dir): { path: string; title: string }[] {
    const files: { path: string; title: string }[] = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files.push(...getFiles(fullPath, baseDir));
        } else if (item.name.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const firstLine = content.split('\n')[0];
            const title = firstLine.replace(/^#\s+/, '') || item.name.replace('.md', '');

            const relativePath = path.relative(baseDir, fullPath)
                .replace(/\.md$/, '')
                .replace(/\\/g, '/');  // Convert Windows paths to URL format
            
            // Format title to include folder structure
            const folderPath = path.relative(baseDir, dir).replace(/\\/g, '/');
            const displayTitle = folderPath && !item.name.startsWith('index') 
                ? `${folderPath}/${title}`
                : title;

            if (item.name === 'index.md') {
                files.unshift({
                    path: relativePath,
                    title: 'Introduction'
                });
            } else {
                files.push({
                    path: relativePath,
                    title: displayTitle
                });
            }
        }
    }

    return files;
}

export async function GET() {
    const files = getFiles('static/docs');
    return json(files);
} 