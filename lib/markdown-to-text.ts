import { remark } from 'remark';
import html from 'remark-html';


export async function markdownToSafeHTML(markdown: string){
    
    const processed = await remark()
    .use(html)
    .process(markdown)

    return processed.toString(); 
}