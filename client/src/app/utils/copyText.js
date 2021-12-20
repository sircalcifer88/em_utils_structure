export const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
};