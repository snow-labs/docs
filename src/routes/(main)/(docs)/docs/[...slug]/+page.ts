import type { PageLoad } from './$types';

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

    const markdown = await markdownResponse.text();
    const files = await filesResponse.json();

    return {
        props: {
            markdown,
            files,
            slug
        }
    };
};