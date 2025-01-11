import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

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

const folderMetadataFiles = import.meta.glob('/static/**/folder.json', { eager: true }) as Record<string, any>;

async function getFolderMetadata(folderPath: string, paramValue: string): Promise<FolderMetadata> {
    try {
        const jsonPath = `/static/${paramValue}/${folderPath}/folder.json`;
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

async function addToFolderStructure(folders: Record<string, DocFolder>, path: string, file: DocFile, paramValue: string) {
    const parts = path.split('/');
    const fileName = parts.pop() || '';
    let currentLevel = folders;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!currentLevel[part]) {
            const metadata = await getFolderMetadata(currentPath, paramValue);
            
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

function normalizePath(itemPath: string): string {
    // Strip everything before the '/static' part and replace backslashes with forward slashes
    let relativePath = itemPath.replace(/^.*\/static/, '/static');  // Strip everything before '/static'
    return relativePath.replace(/\\/g, '/');  // Replace all backslashes with forward slashes
}

// @ts-ignore
export async function GET({ request }) {
    const url = new URL(request.url);

    const paramValue = url.searchParams.has('instance') ? url.searchParams.get('instance') : 'docs';
    const staticDir = path.join(process.cwd(), 'static');

    const items = fs.readdirSync(staticDir);

    let instances = [];

    for(const item of items) {
        const itemPath = path.join(staticDir, item);
        if(fs.statSync(itemPath).isDirectory()) {
            const instanceJsonPath = path.join(itemPath, 'instance.json')
            if(item == "docs") {
                const content = fs.existsSync(instanceJsonPath) ? JSON.parse(fs.readFileSync(instanceJsonPath).toString()) : {};
                instances.push({
                    name: content.name ? content.name : "Latest",
                    path: item,
                    sidebarPosition: 0
                })
                continue;
            }
            if(fs.existsSync(instanceJsonPath)) {
                const content = JSON.parse(fs.readFileSync(instanceJsonPath).toString())
                instances.push({
                    name: content.name ? content.name : item,
                    path: item,
                    sidebarPosition: content.sidebarposition ? content.sidebarPosition : 999
                })
            }
        }
    }

    instances = instances.sort((a,b)=>a.sidebarPosition-b.sidebarPosition);

    let hasFile = await fs.existsSync(path.join(process.cwd(), 'static', paramValue ? paramValue : "docs", "instance.json"))
    if(paramValue != "docs" && !hasFile) return json({
        rootFiles: [],
        folders: [],
        instances
    })
    // return json({
    //     rootFiles: sortedRootFiles,
    //     folders: sortedFolders
    // });
    const markdownFiles = import.meta.glob("/static/**/*.md", { eager: true, as: 'raw' });
 
    // const folderPath = path.join(process.cwd(), 'static', paramValue)
    // const markdownFiles = globMarkdownFiles(folderPath, /.*\.md/)
    const folders: Record<string, DocFolder> = {};
    const rootFiles: DocFile[] = [];

    for (const [path, content] of Object.entries(markdownFiles)) {
        // console.log(path)
        if(!path.startsWith(`/static/${paramValue}/`)) continue;
        const relativePath = path
            .replace(`/static/${paramValue}/`, '')
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
                title: frontmatter && frontmatter['title'] ? frontmatter['title'] : 'Introduction',
                position: frontmatter['sidebar-position'] || 0
            });
        } else if (relativePath.includes('/')) {
            await addToFolderStructure(folders, relativePath, file, paramValue);
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
        folders: sortedFolders,
        instances
    });
} 