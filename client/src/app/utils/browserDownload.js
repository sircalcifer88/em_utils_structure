export const browserDownload = async ({
    path,
    name =  ''
}) => {
    const blobUrl = await fetch(path).then(r => r.blob());
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobUrl);
    link.download = name;
    link.click();
};