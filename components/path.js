import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getCurrentDirname = () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    return __dirname;
};
