
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { GalleryItem } from '@/lib/gallery-data';

interface GalleryImageProps {
  item: GalleryItem;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ item, onClick }) => {
  return (
    <div className="group relative overflow-hidden rounded-md gallery-image" onClick={onClick}>
      <AspectRatio ratio={4/5} className="bg-muted">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-500"
        />
      </AspectRatio>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-medium text-lg">{item.title}</h3>
        <p className="text-gray-200 text-sm">{item.description}</p>
      </div>
    </div>
  );
};

export default GalleryImage;
