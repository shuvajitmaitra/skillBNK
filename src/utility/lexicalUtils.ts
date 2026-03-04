interface LexicalNode {
  [key: string]: any;
  children?: LexicalNode[];
  text?: string;
  type?: string;
}

interface LexicalRoot {
  root: LexicalNode;
}

export function truncateLexicalJSON(
  jsonStr: string,
  maxWords: number = 20,
): string {
  const defaultResponse = JSON.stringify({
    root: {
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });

  try {
    // Basic input validation
    if (typeof jsonStr !== 'string' || !jsonStr.trim()) {
      return defaultResponse;
    }

    // Sanitize input
    const sanitizedJson = jsonStr
      .replace(/\\n/g, '')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"');

    // Parse with reviver to handle potential issues
    const parsed: LexicalRoot = JSON.parse(sanitizedJson, (key, value) => {
      // Handle potential undefined values
      if (value === null || value === undefined) return undefined;
      // Convert potential non-string text properties
      if (key === 'text' && typeof value !== 'string') return String(value);
      return value;
    });

    // Validate root structure
    if (
      !parsed.root ||
      typeof parsed.root !== 'object' ||
      !Array.isArray(parsed.root.children)
    ) {
      return defaultResponse;
    }

    let remainingWords = maxWords;

    const processNode = (node: LexicalNode): boolean => {
      // Skip image nodes
      if (node.type === 'image') {
        return true; // Continue processing other nodes
      }

      // Process text content
      if (node.text && typeof node.text === 'string') {
        const words = node.text.split(/\s+/).filter(w => w.length > 0);
        const wordsToKeep = Math.min(remainingWords, words.length);

        node.text = words.slice(0, wordsToKeep).join(' ');
        remainingWords -= wordsToKeep;

        // Add ellipsis if truncated
        if (wordsToKeep < words.length && remainingWords === 0) {
          node.text = node.text.trim() + '...';
        }
      }

      // Process children recursively if we still have words left
      if (remainingWords > 0 && node.children && Array.isArray(node.children)) {
        let i = 0;
        while (i < node.children.length && remainingWords > 0) {
          const child = node.children[i];
          if (child && typeof child === 'object') {
            // Skip image nodes in children
            if (child.type === 'image') {
              node.children.splice(i, 1);
              continue; // Don't increment i, as we removed the current element
            }
            const shouldContinue = processNode(child);
            if (!shouldContinue) break;
            i++;
          } else {
            // Remove invalid child entries
            node.children.splice(i, 1);
          }
        }
        // Truncate remaining children
        node.children.splice(i);
      }

      return remainingWords > 0;
    };

    // Process root node
    processNode(parsed.root);

    // Ensure final structure validity
    parsed.root.children = parsed.root.children || [];
    parsed.root.type = parsed.root.type || 'root';
    parsed.root.version = parsed.root.version || 1;

    return JSON.stringify(parsed);
  } catch (error) {
    // console.error('JSON truncation error:', error);
    return defaultResponse;
  }
}
