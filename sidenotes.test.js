import remarkSidenotes from "./sidenotes.js";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const markdown = `
  Some text with a footnote.[^1]

  [^1]: This is the content of the footnote.
`;

const result = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkSidenotes)
  .use(remarkRehype)
  .use(rehypeStringify)
  .processSync(markdown)
  .toString();

console.log(result);

// TODO: Learn how to write real tests
// TODO: Learn about versioning
// TODO: Rewrite in TypeScript?
