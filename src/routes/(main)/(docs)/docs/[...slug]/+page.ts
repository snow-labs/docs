import type { PageLoad } from './$types';

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

export const load: PageLoad = async ({ params, fetch }) => {
    const { slug } = params;
    const [markdownResponse, filesResponse] = await Promise.all([
        fetch(`/docs/${slug}.md`),
        fetch('/api/docs')
    ]);

    if (!markdownResponse.ok) {
        return {
            props: {
                markdown: '',
                files: [],
                error: 'Markdown file not found'
            }
        };
    }

    const rawMarkdown = await markdownResponse.text();
    const { frontmatter, content } = parseFrontmatter(rawMarkdown);
    const files = await filesResponse.json();

    return {
        props: {
            markdown: content,
            files,
            slug
        }
    };
};