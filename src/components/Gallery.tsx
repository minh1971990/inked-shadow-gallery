
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import GalleryImage from './GalleryImage';
import { galleryData, categories, type GalleryItem } from '@/lib/gallery-data';

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredImages = selectedCategory === "All" 
    ? galleryData
    : galleryData.filter(item => item.category.includes(selectedCategory.toLowerCase()));

  const handleImageClick = (image: GalleryItem) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <section id="gallery" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our collection of premium black and white tattoo designs. 
            Filter by style or technique to find your inspiration.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.slice(0, 8).map((category) => (
            <Button 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className="text-sm rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {filteredImages.map((item) => (
            <GalleryImage 
              key={item.id} 
              item={item} 
              onClick={() => handleImageClick(item)} 
            />
          ))}
        </div>

        {/* Image Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-3xl bg-black p-0 border-none">
            {selectedImage && (
              <div className="relative">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title} 
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.title}</h3>
                  <p className="text-gray-300">{selectedImage.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
