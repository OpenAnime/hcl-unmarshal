export function getHereDoc(input: string, token: string): [string, string] {
    const re = new RegExp(`<<\\s?(.+?)\\s([\\s\\S]*?)${token}`, 'g');
    const res = re.exec(input);
    if (!res) return ['', input];
    const [full, , body] = res;
    const part = body.replace(/\n$/, '');
    const remaining = input.replace(full, '');
    return [part, remaining];
}

export function doConversions(hclStringContent: string) {
    let val = hclStringContent;

    val = val.replace(/\\\\/g, '\uFFFE'); // temp placeholder for literal backslash
    val = val.replace(/\\"/g, '"');
    val = val.replace(/\\n/g, '\n');
    val = val.replace(/\\r/g, '\r');
    val = val.replace(/\\t/g, '\t');
    val = val.replace(/\\f/g, '\f');
    val = val.replace(/\\b/g, '\b');
    val = val.replace(/\uFFFE/g, '\\'); // restoring literal backslash

    if (val === 'false') {
        return false;
    }
    if (val === 'true') {
        return true;
    }

    if (val === '') return val;

    const num = Number(val);

    if (!isNaN(num) && val.trim() === String(num).trim() && val.trim() !== '') {
        return num;
    }

    return val;
}
