export const adminCheck: (userId: string) => boolean = (userId: string) => {
    if (userId === '1') {
        return true;
    } else {
        return false;
    }
} 