import { TOKENS } from './tokens';
import { tokenize } from './tokenize';
import * as utils from './utils';

function parseValue(rawTokens: string[], idxRef: { idx: number }) {
    const peek = () => rawTokens[idxRef.idx] ?? null;
    const consume = () => rawTokens[idxRef.idx++] ?? null;

    const tok = peek();
    if (tok === TOKENS.LBRACE) {
        consume();
        const obj = parseBlockBody(rawTokens, idxRef);
        consume();
        return obj;
    }

    if (tok === TOKENS.LBRACKET) {
        consume();
        const arr: any[] = [];
        while (peek() !== TOKENS.RBRACKET) {
            if (peek() === TOKENS.COMMA) {
                consume();
                continue;
            }
            arr.push(parseValue(rawTokens, idxRef));
        }
        consume();
        return arr;
    }

    let raw = consume()!;
    raw = raw.replace(/,+$/, '');
    const unquoted = raw.replace(/^"/, '').replace(/"$/, '');
    return utils.doConversions(unquoted);
}

function parseBlockBody(rawTokens: string[], idxRef: { idx: number }) {
    const obj: Record<string, any> = {};
    const peek = () => rawTokens[idxRef.idx] ?? null;
    const consume = () => rawTokens[idxRef.idx++] ?? null;

    while (peek() !== TOKENS.RBRACE) {
        if (peek() === TOKENS.COMMA) {
            consume();
            continue;
        }

        const keyRaw = consume()!;
        const key = keyRaw.replace(/"/g, '');

        if (peek() === TOKENS.ASSIGN) {
            consume();
            obj[key] = parseValue(rawTokens, idxRef);
        } else if (peek() === TOKENS.LBRACE) {
            consume();
            const nested = parseBlockBody(rawTokens, idxRef);
            consume();

            if (!Array.isArray(obj[key])) {
                obj[key] = [];
            }
            obj[key].push(nested);
        } else {
            throw new Error(`Expected "=" or "{" after key ${key}, but got ${peek()}`);
        }
    }

    return obj;
}

export function hclToJson(hclInput: string) {
    if (!hclInput?.trim()) {
        return {};
    }

    const tokenString = tokenize(hclInput);
    const rawTokens = tokenString.split(TOKENS.SPACE).filter((t) => t);

    const idxRef = { idx: 0 };
    const peek = () => rawTokens[idxRef.idx] ?? null;
    const consume = () => rawTokens[idxRef.idx++] ?? null;

    const result: Record<string, any> = {};

    while (idxRef.idx < rawTokens.length) {
        if (peek() === TOKENS.RBRACE) {
            consume();
            continue;
        }

        const blockType = consume()!;

        const labels: string[] = [];
        while (peek() !== TOKENS.LBRACE && peek() !== null) {
            labels.push(consume()!.replace(/"/g, ''));
        }

        if (consume() !== TOKENS.LBRACE) {
            throw new Error(`Expected "{" after block ${blockType}`);
        }

        const obj = parseBlockBody(rawTokens, idxRef);

        if (consume() !== TOKENS.RBRACE) {
            throw new Error(`Expected "}" to close block ${blockType}`);
        }

        if (!Array.isArray(result[blockType])) {
            result[blockType] = [];
        }

        let nested: any = obj;
        for (let i = labels.length - 1; i >= 0; --i) {
            nested = { [labels[i]]: [nested] };
        }

        (result[blockType] as any[]).push(nested);
    }

    return result;
}
