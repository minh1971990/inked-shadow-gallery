export function getImagePathFromUrl(url: string): string | null {
  try {
    const base = import.meta.env.VITE_DESIGN_IMAGE_URL;
    if (!url.startsWith(base)) return null;

    return url.replace(base, "").replace(/^\/+/, "");
  } catch (err) {
    console.error("❌ Error processing image URL:", err);
    return null;
  }
}
