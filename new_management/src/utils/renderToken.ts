/**
 * 随机生成字符串
 *
 * @param {number} length - 字符串长度
 * @returns {string} - 随机生成的字符串
 */
function generateRandomToken(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let token = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }

    return token;
}

export default generateRandomToken
