export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getFileExtension(fileName) {
  return fileName.split('.').pop().toLowerCase();
}

export function isValidFileType(file, allowedTypes) {
  return allowedTypes.includes(file.type);
}

export function generateDownloadLink(fileName) {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/downloads/${fileName}`;
}
