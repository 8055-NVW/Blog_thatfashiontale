export function resolveApiUrl(path: string, baseUrl?: string) {
    if (!baseUrl) {
        return path;
    }

    return new URL(path, baseUrl).toString();
}
