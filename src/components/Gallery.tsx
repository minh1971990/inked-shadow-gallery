import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Heart,
  Download,
} from "lucide-react";
import { galleryData, categories, type GalleryItem } from "@/lib/gallery-data";

import { useCategories, useDesigns } from "@/hooks/use-supabase";

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isViewAllDialogOpen, setIsViewAllDialogOpen] = useState(false);

  const { categories = [] } = useCategories();
  const { designs = [] } = useDesigns();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredImages = useMemo(
    () =>
      selectedCategory === "All"
        ? designs
        : designs?.filter((design) =>
            design.design_categories?.some(
              (dc) =>
                dc.category?.name.toLowerCase() ===
                selectedCategory.toLowerCase()
            )
          ) || [],
    [selectedCategory, designs]
  );

  const handleImageClick = (image: any) => {
    const index = filteredImages.findIndex((item) => item.id === image.id);
    setSelectedImage(image);
    setSelectedIndex(index);
    setIsDialogOpen(true);
  };

  const handlePrevImage = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedImage(filteredImages[prevIndex]);
    }
  };

  const handleNextImage = () => {
    if (selectedIndex < filteredImages.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedImage(filteredImages[nextIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDialogOpen) {
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "Escape") setIsDialogOpen(false);
    } else if (isViewAllDialogOpen) {
      if (e.key === "Escape") setIsViewAllDialogOpen(false);
    }
  };

  return (
    <section
      id="gallery"
      className="py-24 bg-black relative overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={galleryRef}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/70"></div>
              <span className="text-white/70 uppercase text-sm tracking-widest font-light">
                My Work
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/70"></div>
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white tracking-tight">
              Tattoo Gallery
            </h2>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Browse through our collection of premium black and grey tattoo
            designs. Each piece tells a unique story and showcases our
            commitment to artistic excellence.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              className={`text-sm rounded-full px-6 py-2 transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-white text-black hover:bg-white/90"
                  : "text-black capitalize border-white/20 hover:border-white/50 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </Button>
          </motion.div>
          {categories?.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Button
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                className={`text-sm rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-white text-black hover:bg-white/90"
                    : "text-black capitalize border-white/20 hover:border-white/50 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredImages?.slice(0, 8).map((item, index) => (
                <GalleryImage
                  key={item.id}
                  item={{
                    id: item.id,
                    title: item.title,
                    description: item.description || "",
                    imageUrl: item.image_url || "/placeholder.svg",
                    category:
                      item.design_categories?.map(
                        (dc) => dc.category?.name || ""
                      ) || [],
                  }}
                  onClick={() => handleImageClick(item)}
                  index={index}
                  isLoaded={isLoaded}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredImages.length === 0 && (
            <motion.div
              className="text-center py-16 text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No images found in this category. Please try another filter.
            </motion.div>
          )}
        </div>

        {/* View More Button */}
        {filteredImages.length > 8 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-black border-white/20 hover:bg-white/10 hover:text-white hover:border-white/50"
              onClick={() => setIsViewAllDialogOpen(true)}
            >
              View More Work
            </Button>
          </motion.div>
        )}

        {/* Single Image Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-4xl bg-black/95 p-0 border border-white/20 rounded-lg overflow-hidden backdrop-blur-xl h-[90vh] flex flex-col">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-1.5 sm:p-2 rounded-full bg-white/30 text-white/70 hover:text-white hover:bg-black/70 transition-all hover:scale-110"
              aria-label="Close dialog"
            >
              <X size={18} className="pointer-events-none" />
            </button>
            {selectedImage && (
              <div className="relative flex flex-col h-full">
                {/* Navigation buttons */}
                <div className="absolute inset-y-0 left-0 flex items-center z-20 px-1 sm:px-2">
                  <button
                    className={`p-1 sm:p-2 bg-white/20 rounded-full text-white/70 hover:text-white hover:bg-white/50 transition-all ${
                      selectedIndex <= 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-black/70 hover:scale-110"
                    }`}
                    onClick={handlePrevImage}
                    disabled={selectedIndex <= 0}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} className="pointer-events-none" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center z-20 px-1 sm:px-2">
                  <button
                    className={`p-1.5 sm:p-2 bg-white/20 rounded-full text-white/70 hover:text-white hover:bg-white/50 transition-all ${
                      selectedIndex >= filteredImages.length - 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-black/70 hover:scale-110"
                    }`}
                    onClick={handleNextImage}
                    disabled={selectedIndex >= filteredImages.length - 1}
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} className="pointer-events-none" />
                  </button>
                </div>

                {/* Image with enhanced animations */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative flex flex-col h-full items-center"
                  >
                    {/* Image Container */}
                    <div className="w-[90%] max-w-sm sm:w-[350px] md:w-[300px] md:max-w-[300px] max-h-[60vh] sm:max-h-none overflow-hidden rounded-lg relative group flex-shrink-0 flex items-center justify-center mx-auto">
                      <motion.img
                        src={selectedImage.image_url || "/placeholder.svg"}
                        alt={selectedImage.title}
                        className="w-full h-full object-contain transition-transform duration-700"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    {/* Image info with enhanced layout */}
                    <div className="w-full p-3 sm:p-4 bg-gradient-to-t from-black via-black/95 to-black/90 flex-1 overflow-y-auto sm:flex-none">
                      <div className="flex flex-col items-center gap-3 mb-3">
                        <div className="flex-1 text-center">
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-6 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-white/70"></div>
                            <span className="text-white/60 text-xs uppercase tracking-wider font-medium whitespace-nowrap">
                              Tattoo Design
                            </span>
                            <div className="w-6 sm:w-8 h-[1px] bg-gradient-to-l from-transparent to-white/70"></div>
                          </div>
                          <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
                            {selectedImage.title}
                          </h3>
                          <div className="flex flex-wrap justify-center gap-2">
                            {selectedImage.design_categories?.map((dc: any) => (
                              <span
                                key={dc.category?.id}
                                className="px-2 py-0.5 SESSION bg-white/10 rounded-full text-white/80 text-xs"
                              >
                                {dc.category?.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 text-white/70 hover:text-white transition-all hover:bg-white/10 rounded-full hover:scale-110">
                            <Heart size={16} className="pointer-events-none" />
                          </button>
                          <button className="p-1.5 text-white/70 hover:text-white transition-all hover:bg-white/10 rounded-full hover:scale-110">
                            <Share2 size={16} className="pointer-events-none" />
                          </button>
                          <button className="p-1.5 text-white/70 hover:text-white transition-all hover:bg-white/10 rounded-full hover:scale-110">
                            <Download
                              size={16}
                              className="pointer-events-none"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <p className="text-white/80 text-sm leading-relaxed text-center max-w-2xl mx-auto mb-3">
                            {selectedImage.description &&
                            selectedImage.description.length > 150
                              ? selectedImage.description.substring(0, 150) +
                                "..."
                              : selectedImage.description}
                          </p>

                          {/* Enhanced details section */}
                          <div className="mt-3 grid-cols-1 sm:grid-cols-3 gap-2 max-w-2xl mx-auto hidden sm:grid">
                            <div className="p-2 sm:p-3 bg-white/5 border border-white rounded-lg text-center">
                              <h4 className="text-white/50 text-xs uppercase mb-1 font-medium">
                                Artist
                              </h4>
                              <p className="text-white text-sm">@art_lllex</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-white/5 border border-white rounded-lg text-center">
                              <h4 className="text-white/50 text-xs uppercase mb-1 font-medium">
                                Session Time
                              </h4>
                              <p className="text-white text-sm">
                                1 - 1.5 hours
                              </p>
                            </div>
                            <div className="p-2 sm:p-3 bg-white/5 border border-white rounded-lg text-center">
                              <h4 className="text-white/50 text-xs uppercase mb-1 font-medium">
                                Placement
                              </h4>
                              <p className="text-white text-sm">Custom</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View All Images Dialog */}
        <Dialog
          open={isViewAllDialogOpen}
          onOpenChange={setIsViewAllDialogOpen}
        >
          <DialogContent className="sm:max-w-6xl bg-black/95 p-6 border border-white/20 rounded-lg overflow-hidden backdrop-blur-xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">All Designs</h2>
              <button
                onClick={() => setIsViewAllDialogOpen(false)}
                className="z-30 p-2 rounded-full bg-white/30 text-white/70 hover:text-white hover:bg-black/70 transition-all hover:scale-110"
                aria-label="Close dialog"
              >
                <X size={20} className="pointer-events-none" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages?.map((item, index) => (
                  <GalleryImage
                    key={item.id}
                    item={{
                      id: item.id,
                      title: item.title,
                      description: item.description || "",
                      imageUrl: item.image_url || "/placeholder.svg",
                      category:
                        item.design_categories?.map(
                          (dc) => dc.category?.name || ""
                        ) || [],
                    }}
                    onClick={() => {
                      setIsViewAllDialogOpen(false); // Close view all dialog
                      handleImageClick(item); // Open single image dialog
                    }}
                    index={index} // Index might not be relevant for animation in this grid
                    isLoaded={true} // Assume loaded in this context
                  />
                ))}
              </div>
              {filteredImages.length === 0 && (
                <div className="text-center py-16 text-white/70">
                  No images found.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

const GalleryImage: React.FC<{
  item: GalleryItem;
  onClick: () => void;
  index: number;
  isLoaded: boolean;
}> = ({ item, onClick, index, isLoaded }) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
      <motion.img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700"
        whileHover={{ scale: 1.1 }}
      />

      {/* Overlay content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white text-lg font-medium mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
      </div>

      {/* Category tags */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {item.category.slice(0, 1).map((cat) => (
          <span
            key={cat}
            className="inline-block bg-black/60 backdrop-blur-sm text-white/90 text-xs px-2 py-1 rounded-full"
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default Gallery;
