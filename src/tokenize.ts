import { TOKENS } from './tokens';

const CHARS = [
    [',', TOKENS.COMMA],
    [':', TOKENS.COLON],
    ['=', TOKENS.ASSIGN],
    ['{', TOKENS.LBRACE],
    ['}', TOKENS.RBRACE],
    ['[', TOKENS.LBRACKET],
    [']', TOKENS.RBRACKET],
    ['<<', TOKENS.HEREDOC],
];

function clearQuotes(match: string) {
    return match[0] === '"' ? match : '';
}

export function tokenize(input: string) {
    let result = input;

    result = result.replace(/".+?"|\#[\s\S]*?.*/gim, clearQuotes);
    result = result.replace(/".+?"|\/\*[\s\S]*?\*\/|\/\/.*/gm, clearQuotes);

    for (const [char, token] of CHARS) {
        const esc = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const re = new RegExp(`".+?"|(${esc})`, 'g');
        result = result.replace(re, (m, g1) => (g1 ? ` ${token} ` : m));
    }

    result = result.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/gm, TOKENS.SPACE);

    return result;
}
