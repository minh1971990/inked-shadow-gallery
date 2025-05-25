export function getImagePathFromUrl(url: string): string | null {
  try {
    const base =
      "https://aiimnilbbcpgpwmezdav.supabase.co/storage/v1/object/public/designs/";
    if (!url.startsWith(base)) return null;

    return url.replace(base, "").replace(/^\/+/, "");
  } catch (err) {
    console.error("❌ Error processing image URL:", err);
    return null;
  }
}
