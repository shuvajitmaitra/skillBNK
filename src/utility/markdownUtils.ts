export function truncateMarkdown(md: string, maxWords: number = 20): string {
  let wordCount = 0;
  const result: string[] = [];
  const blocks = md.split(/(\n+)/); // Split while preserving newlines

  // Helper to count words in plain text
  const countWords = (text: string) =>
    text
      .replace(/([*_`\]]|\[.*?\]\(.*?\))/g, '') // Remove markdown syntax
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0).length;

  // Helper to truncate text with markdown awareness
  const truncateText = (text: string, max: number) => {
    const words = text.split(/(\s+)/);
    let count = 0;
    const resultWords = [];

    for (const word of words) {
      const plainWord = word.replace(/([*_`\]]|\[.*?\]\(.*?\))/g, '').trim();
      if (plainWord) count++;
      if (count > max) break;
      resultWords.push(word);
    }

    let truncated = resultWords.join('').trim();
    if (truncated !== text) truncated += '...';
    return truncated;
  };

  for (const block of blocks) {
    if (wordCount >= maxWords) break;
    if (!block.trim()) {
      result.push(block);
      continue;
    }

    const blockWordCount = countWords(block);

    if (wordCount + blockWordCount <= maxWords) {
      result.push(block);
      wordCount += blockWordCount;
    } else {
      const remaining = maxWords - wordCount;
      const truncatedBlock = truncateText(block, remaining);
      result.push(truncatedBlock);
      wordCount = maxWords;
    }
  }

  return result.join('').trim();
}
