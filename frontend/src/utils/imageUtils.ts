export const getImageUrl = (image: {
    image_url?: string | null,
    image_data?: { type: string, data: Uint8Array }
}): string => {
    if (image?.image_url) {
        return image.image_url;
    }

    if (image?.image_data) {
        try {
            const blob = new Blob([new Uint8Array(image.image_data.data)], {type: 'image/jpeg'});
            return URL.createObjectURL(blob);
        } catch (err) {
            console.error('Error creating image URL:', err);
        }
    }

    return 'https://placehold.co/600x400?text=No+Image';
};

export const getPrimaryImage = (images: Array<{
    is_primary?: boolean,
    image_url?: string | null,
    image_data?: any
}> = []) => {
    if (!images || images.length === 0) {
        return 'https://placehold.co/600x400?text=No+Image';
    }

    const primary = images.find(img => img.is_primary);
    if (primary) return getImageUrl(primary);

    return getImageUrl(images[0]);
};

export const cleanupImageUrls = (images: Array<{ image_url?: string | null, image_data?: any }> = []) => {
    images.forEach(image => {
        if (image.image_data && !image.image_url) {
            const url = getImageUrl(image);
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        }
    });
};