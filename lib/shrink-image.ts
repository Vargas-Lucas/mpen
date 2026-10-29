const TARGET_BYTES = 700 * 1024;
const MAX_EDGE = 1600;

function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

export async function shrinkImage(file: File): Promise<File> {
  if (file.size <= TARGET_BYTES && /image\/(jpeg|png|webp)/.test(file.type)) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Não foi possível ler essa imagem.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.82;
  let blob = await canvasBlob(canvas, quality);
  while (blob && blob.size > TARGET_BYTES && quality > 0.45) {
    quality -= 0.12;
    blob = await canvasBlob(canvas, quality);
  }
  if (!blob) throw new Error("Não foi possível ler essa imagem.");
  if (blob.size > 1024 * 1024) throw new Error("Essa imagem continua grande demais. Escolha outra.");

  const name = file.name.replace(/\.[^.]+$/, "") || "capa";
  return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
}
