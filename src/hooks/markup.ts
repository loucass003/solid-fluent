export type MarkupParser = (str: string) => Array<Node>

let cachedParseMarkup: MarkupParser
export function createParseMarkup(): MarkupParser {
  if (typeof document === 'undefined') {
    throw new Error('`document` is undefined. Without it, translations cannot be safely sanitized')
  }

  // eslint is wrong, it is used
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!cachedParseMarkup) {
    const template = document.createElement('template')
    cachedParseMarkup = function parseMarkup(str: string): Array<Node> {
      template.innerHTML = str
      return Array.from(template.content.childNodes)
    }
  }

  return cachedParseMarkup
}
