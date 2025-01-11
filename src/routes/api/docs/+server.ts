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
    title?: string;
    position?: number;
    files: DocFile[];
    folders: Record<string, DocFolder>;
    isOpen?: boolean;
}

interface FolderMetadata {
    title?: string;
    'sidebar-position'?: number;
}

const folderMetadataFiles = import.meta.glob('/static/docs/**/folder.json', { eager: true }) as Record<string, any>;

async function getFolderMetadata(folderPath: string): Promise<FolderMetadata> {
    try {
        const jsonPath = `/static/docs/${folderPath}/folder.json`;
        if (folderMetadataFiles[jsonPath]) {
            const data = folderMetadataFiles[jsonPath].default || folderMetadataFiles[jsonPath];
            return {
                title: data.title,
                'sidebar-position': data['sidebar-position']
            };
        }
    } catch (error) {
        console.warn(`Error reading folder.json for ${folderPath}:`, error);
    }
    return {};
}

async function addToFolderStructure(folders: Record<string, DocFolder>, path: string, file: DocFile) {
    const parts = path.split('/');
    const fileName = parts.pop() || '';
    let currentLevel = folders;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!currentLevel[part]) {
            const metadata = await getFolderMetadata(currentPath);
            
            currentLevel[part] = {
                name: part,
                title: metadata.title || part,
                position: metadata['sidebar-position'] || 999,
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
            await addToFolderStructure(folders, relativePath, file);
        } else {
            rootFiles.push(file);
        }
    }

    function sortFolderContents(folder: DocFolder) {
        folder.files.sort((a, b) => a.position - b.position);
        
        const subfolders = Object.values(folder.folders);
        subfolders.sort((a, b) => (a.position || 999) - (b.position || 999));
        
        for (const subfolder of subfolders) {
            sortFolderContents(subfolder);
        }
        
        return folder;
    }

    for (const folder of Object.values(folders)) {
        sortFolderContents(folder);
    }

    const sortedRootFiles = rootFiles.sort((a, b) => a.position - b.position);
    const sortedFolders = Object.entries(folders)
        .sort(([_, a], [__, b]) => (a.position || 999) - (b.position || 999))
        .map(([_, folder]) => folder);

    return json({
        rootFiles: sortedRootFiles,
        folders: sortedFolders
    });
} 