export function getHereDoc(input: string, token: string): [string, string] {
    const re = new RegExp(`<<\\s?(.+?)\\s([\\s\\S]*?)${token}`, 'g');
    const res = re.exec(input);
    if (!res) return ['', input];
    const [full, , body] = res;
    const part = body.replace(/\n$/, '');
    const remaining = input.replace(full, '');
    return [part, remaining];
}

export function doConversions(raw: string): string | number | boolean {
    let part = raw.replace(/^"/, '').replace(/"$/, '').replace(/"/g, '\\"');

    if (part === 'false') {
        return false;
    }
    if (part === 'true') {
        return true;
    }

    if (part === '') return part;

    const num = Number(part);
    if (!isNaN(num)) {
        return num;
    }

    return part;
}
