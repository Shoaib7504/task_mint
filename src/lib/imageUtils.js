/**
 * Utility functions for handling image proofs and uploads in TaskMint
 */

/**
 * Parse submissionDetails into structured { image, notes }
 * Handles JSON strings, raw Data URLs, image URLs, and plain text notes
 */
export function parseProof(details) {
  if (!details) return { image: null, notes: "" };

  if (typeof details === "object" && details !== null) {
    return {
      image: details.image || null,
      notes: details.notes || details.text || "",
    };
  }

  const str = String(details).trim();

  // 1. Try parsing as JSON
  if (str.startsWith("{") && str.endsWith("}")) {
    try {
      const parsed = JSON.parse(str);
      return {
        image: parsed.image || null,
        notes: parsed.notes || parsed.text || "",
      };
    } catch {
      // not valid JSON, proceed to other checks
    }
  }

  // 2. Check if whole string is a Data URL
  if (str.startsWith("data:image/")) {
    return { image: str, notes: "" };
  }

  // 3. Check if whole string is an image URL
  if (
    str.match(/^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i) ||
    str.includes("i.ibb.co") ||
    str.includes("res.cloudinary.com") ||
    str.includes("images.unsplash.com")
  ) {
    return { image: str, notes: "" };
  }

  // 4. Check if text contains an image URL inside it
  const urlMatch = str.match(/(https?:\/\/[^\s]+?\.(png|jpe?g|webp|gif|svg)(\?[^\s]*)?)/i);
  if (urlMatch) {
    const imageUrl = urlMatch[0];
    const notes = str.replace(imageUrl, "").trim();
    return { image: imageUrl, notes };
  }

  // 5. Fallback: Entire text is notes
  return { image: null, notes: str };
}

/**
 * Compress an image file in the browser using HTML5 Canvas
 * Ensures uploaded proof screenshots don't overload server or database
 */
export async function compressImageFile(file, maxWidth = 1280, maxHeight = 1280, quality = 0.85) {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("File must be an image (PNG, JPG, WEBP, etc.)"));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image format"));
      img.onload = () => {
        let { width, height } = img;

        // If already smaller than target bounds and small file, return original base64
        if (width <= maxWidth && height <= maxHeight && file.size < 400 * 1024) {
          return resolve(event.target.result);
        }

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with chosen quality
        const outputMime = file.type === "image/png" ? "image/png" : "image/jpeg";
        const compressedDataUrl = canvas.toDataURL(outputMime, quality);
        resolve(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file:
 * - Attempts ImgBB if NEXT_PUBLIC_IMGBB_API_KEY is configured
 * - Otherwise falls back to browser-compressed Base64 Data URL
 */
export async function uploadProofImage(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (apiKey) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.success && data?.data?.url) {
        return data.data.url;
      }
    } catch (err) {
      console.warn("ImgBB upload failed, falling back to local compression:", err);
    }
  }

  // Fallback to high quality compressed Data URL
  return await compressImageFile(file);
}
