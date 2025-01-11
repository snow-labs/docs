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

interface DocFile {
    path: string;
    title: string;
    position: number;
}

interface DocFolder {
    name: string;
    files: DocFile[];
    folders: Record<string, DocFolder>;
    isOpen?: boolean;
}

function addToFolderStructure(folders: Record<string, DocFolder>, path: string, file: DocFile) {
    const parts = path.split('/');
    const fileName = parts.pop() || '';
    let currentLevel = folders;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!currentLevel[part]) {
            currentLevel[part] = {
                name: part,
                files: [],
                folders: {},
                isOpen: true
            };
        }

        if (i === parts.length - 1) {
            currentLevel[part].files.push(file);
        }

        currentLevel = currentLevel[part].folders;
    }
}

export async function GET() {
    const markdownFiles = import.meta.glob('/static/docs/**/*.md', { eager: true, as: 'raw' });
    const folders: Record<string, DocFolder> = {};
    const rootFiles: DocFile[] = [];

    for (const [path, content] of Object.entries(markdownFiles)) {
        const relativePath = path
            .replace('/static/docs/', '')
            .replace('.md', '');
        
        const { frontmatter } = parseFrontmatter(content);
        const file: DocFile = {
            path: relativePath,
            title: frontmatter.title || relativePath.split('/').pop() || '',
            position: frontmatter['sidebar-position'] || 999
        };

        if (path.endsWith('index.md')) {
            rootFiles.unshift({
                path: 'index',
                title: 'Introduction',
                position: frontmatter['sidebar-position'] || 0
            });
        } else if (relativePath.includes('/')) {
            addToFolderStructure(folders, relativePath, file);
        } else {
            rootFiles.push(file);
        }
    }

    console.log('Files structure:', JSON.stringify({ folders, rootFiles }, null, 2));

    function sortFolderContents(folder: DocFolder) {
        folder.files.sort((a, b) => a.position - b.position);
        
        for (const subfolder of Object.values(folder.folders)) {
            sortFolderContents(subfolder);
        }
        
        return folder;
    }

    for (const folder of Object.values(folders)) {
        sortFolderContents(folder);
    }

    const sortedRootFiles = rootFiles.sort((a, b) => a.position - b.position);
    const sortedFolders = Object.entries(folders)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([_, folder]) => folder);

    return json({
        rootFiles: sortedRootFiles,
        folders: sortedFolders
    });
} 