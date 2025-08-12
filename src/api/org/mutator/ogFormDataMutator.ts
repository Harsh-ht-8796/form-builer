type RequestBody = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  file?: File | Blob;
  files?: File[] | Blob[];
  coverImage?: File | Blob;
  logoImage?: File | Blob;
};

export const customFormData = <BodyType extends RequestBody>(
  body: BodyType,
): FormData => {
  const { files, file, coverImage, logoImage,...rest } = body;
  const formData = new FormData();

  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, JSON.stringify(value));
  });

  if (files !== undefined && files.length !== 0) {
    files.forEach((file) => formData.append('files', file));
  }

  if (file) {
    formData.append('file', file);
  }

  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  if (logoImage) {
    formData.append('logoImage', logoImage);
  }

  return formData;
};
