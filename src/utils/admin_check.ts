export const adminCheck: (userId: string) => boolean = (userId: string) => {
    if (userId === '0') {
        return true;
    } else {
        return false;
    }
} 