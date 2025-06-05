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

export function tokenize(input: string): string {
    let result = input;

    // escaped quotes
    const stringLiteralRegex = /"(?:\\.|[^"\\])*"/g;
    const strings: string[] = [];

    // placeholder
    result = result.replace(stringLiteralRegex, (match) => {
        strings.push(match);
        return `___STRING_${strings.length - 1}___`;
    });

    result = result.replace(/\#.*/g, '');
    result = result.replace(/\/\/.*/g, '');
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');

    for (const [char, token] of CHARS) {
        const escChar = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const re = new RegExp(escChar, 'g');
        result = result.replace(re, ` ${token} `);
    }

    result = result.trim();
    result = result.replace(/\s+/g, TOKENS.SPACE);

    // restore
    result = result.replace(/___STRING_(\d+)___/g, (match, indexStr) => {
        const index = parseInt(indexStr, 10);
        return strings[index];
    });

    return result;
}
