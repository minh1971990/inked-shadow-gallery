import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { useDesigns, useCategories } from "@/hooks/use-supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { supabase } from "@/lib/supabase";

import { getImagePathFromUrl } from "@/lib/getImagePathFromUrl";

export default function AdminDesignsPage() {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [designToDelete, setDesignToDelete] = useState<number | null>(null);
  const [newDesign, setNewDesign] = useState({
    title: "",
    description: "",
    image_url: "",
    featured: false,
    category_ids: [] as number[],
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();
  const {
    designs,
    isLoading,
    addDesign,
    updateDesign,
    deleteDesign,
    addDesignCategory,
    removeDesignCategory,
  } = useDesigns();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const resetNewDesignState = () => {
    setNewDesign({
      title: "",
      description: "",
      image_url: "",
      featured: false,
      category_ids: [],
    });
    setSelectedDesign(null);
  };

  const validateDesign = () => {
    if (!newDesign.title.trim()) {
      return { isValid: false, message: "Title is required" };
    }

    // Check for duplicate titles
    const isDuplicate = designs?.some(
      (design) =>
        design.title.toLowerCase() === newDesign.title.toLowerCase() &&
        design.id !== selectedDesign
    );

    if (isDuplicate) {
      return {
        isValid: false,
        message: "A design with this title already exists",
      };
    }

    // Validate image
    if (!newDesign.image_url && !selectedImageFile) {
      return { isValid: false, message: "Design image is required" };
    }

    // Validate categories
    if (newDesign.category_ids.length === 0) {
      return { isValid: false, message: "Please select at least one category" };
    }

    return { isValid: true };
  };

  const handleAddDesign = async () => {
    console.log("handleAddDesign called");
    const validationResult = validateDesign();
    if (!validationResult.isValid) {
      toast({
        title: "Validation Error",
        description: validationResult.message,
        variant: "destructive",
        duration: 3000,
      });
      console.log("Validation failed:", validationResult.message);
      return;
    }
    console.log("Validation successful");
    setIsAdding(true);
    try {
      let imageUrl = newDesign.image_url;

      if (selectedImageFile) {
        const fileExt = selectedImageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("designs")
          .upload(filePath, selectedImageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("designs").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const designData = {
        title: newDesign.title,
        description: newDesign.description || null,
        image_url: imageUrl || null,
        artist: "art_lllex",
        featured: newDesign.featured,
      };

      const { id, ...result } = await addDesign.mutateAsync(designData);

      for (const categoryId of newDesign.category_ids) {
        await addDesignCategory.mutateAsync({
          design_id: id,
          category_id: categoryId,
        });
      }

      setIsAddDialogOpen(false);
      resetNewDesignState();
      setSelectedImageFile(null);
      toast({
        title: "Success",
        description: "Design added successfully",
        duration: 1500,
      });
    } catch (error) {
      console.log(error);
      console.error("Error adding design:", error);
      console.error("Error details:", error);
      toast({
        title: "Error",
        description: "Failed to add design",
        duration: 1500,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditDesign = async (id: number) => {
    const design = designs?.find((d) => d.id === id);
    if (design) {
      setSelectedDesign(id);
      setNewDesign({
        title: design.title,
        description: design.description || "",
        image_url: design.image_url || "",
        featured: design.featured,
        category_ids:
          design.design_categories?.map((dc) => dc.category_id) || [],
      });
      setSelectedImageFile(null);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateDesign = async () => {
    console.log("handleUpdateDesign called");
    const validationResult = validateDesign();
    if (!selectedDesign || !validationResult.isValid) {
      toast({
        title: "Validation Error",
        description:
          validationResult.message || "Please check the form and try again",
        variant: "destructive",
        duration: 3000,
      });
      console.log("Validation failed:", validationResult.message);
      return;
    }
    console.log("Validation successful");
    setIsUpdating(true);
    try {
      let imageUrl = newDesign.image_url;
      const oldDesign = designs?.find((d) => d.id === selectedDesign);
      const oldImageUrl = oldDesign?.image_url;

      if (selectedImageFile) {
        const oldImagePath = getImagePathFromUrl(oldImageUrl ?? "");
        if (oldImagePath) {
          const { error: deleteError } = await supabase.storage
            .from("designs")
            .remove([oldImagePath]);
          if (deleteError) {
            console.error(
              "❌ Error deleting old image on update:",
              deleteError
            );
          } else {
            console.log("✅ Old image deleted successfully:", oldImagePath);
          }
        }

        const fileExt = selectedImageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("designs")
          .upload(filePath, selectedImageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("designs").getPublicUrl(filePath);

        imageUrl = publicUrl;
      } else if (newDesign.image_url === "" && oldImageUrl) {
        const oldImagePath = getImagePathFromUrl(oldImageUrl);
        if (oldImagePath) {
          const { error: deleteError } = await supabase.storage
            .from("designs")
            .remove([oldImagePath]);
          if (deleteError) {
            console.error("❌ Error deleting image on unselect:", deleteError);
          } else {
            console.log(
              "✅ Unselected image deleted successfully:",
              oldImagePath
            );
          }
        }
        imageUrl = null;
      }

      // Update design first
      await updateDesign.mutateAsync({
        id: selectedDesign,
        title: newDesign.title,
        description: newDesign.description,
        image_url: imageUrl,
        featured: newDesign.featured,
      });

      // Get current categories
      const currentCategories =
        oldDesign?.design_categories?.map((dc) => dc.category_id) || [];

      // Remove categories that are no longer selected
      for (const categoryId of currentCategories) {
        if (!newDesign.category_ids.includes(categoryId)) {
          await removeDesignCategory.mutateAsync({
            design_id: selectedDesign,
            category_id: categoryId,
          });
        }
      }

      // Add new categories
      for (const categoryId of newDesign.category_ids) {
        if (!currentCategories.includes(categoryId)) {
          await addDesignCategory.mutateAsync({
            design_id: selectedDesign,
            category_id: categoryId,
          });
        }
      }

      setIsEditDialogOpen(false);
      resetNewDesignState();
      setSelectedImageFile(null);
      toast({
        title: "Success",
        description: "Design updated successfully",
        duration: 1500,
      });
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "Error",
        description: "Failed to update design",
        duration: 1500,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDesignToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDesign = async () => {
    if (!designToDelete) return;
    setIsDeleting(true);
    try {
      const design = designs?.find((d) => d.id === designToDelete);
      const imagePath = getImagePathFromUrl(design?.image_url ?? "");

      if (imagePath) {
        const { error: deleteError } = await supabase.storage
          .from("designs")
          .remove([imagePath]);

        if (deleteError) {
          console.error("❌ Error deleting image from Supabase:", deleteError);
          toast({
            title: "Warning",
            description: "Failed to delete image from storage.",
            variant: "destructive",
          });
        } else {
          console.log("✅ Image deleted successfully:", imagePath);
        }
      }

      await deleteDesign.mutateAsync(designToDelete);
      setIsDeleteDialogOpen(false);
      setDesignToDelete(null);
      toast({
        title: "Success",
        description: "Design deleted successfully!",
      });
    } catch (error) {
      console.error("❌ Error deleting design:", error);
      toast({
        title: "Error",
        description: "Failed to delete design!",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter designs
  const filteredDesigns = designs?.filter(
    (design) =>
      design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.artist?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Designs Management
            </h1>

            <div className="flex justify-between items-center">
              <Button
                onClick={() => {
                  resetNewDesignState();
                  setIsAddDialogOpen(true);
                }}
                className="bg-white text-black hover:bg-white/90"
                disabled={isAdding}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isAdding ? "Adding..." : "Add Design"}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  type="search"
                  placeholder="Search designs..."
                  className="pl-8 bg-black/30 border-white/10 text-white w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-white/10 text-black"
                    >
                      <Filter className="mr-2 h-4 w-4 " />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>All Designs</DropdownMenuItem>
                    <DropdownMenuItem>Black & Grey</DropdownMenuItem>
                    <DropdownMenuItem>Geometric</DropdownMenuItem>
                    <DropdownMenuItem>Japanese</DropdownMenuItem>
                    <DropdownMenuItem>Minimalist</DropdownMenuItem>
                    <DropdownMenuItem>Portrait</DropdownMenuItem>
                    <DropdownMenuItem>Realism</DropdownMenuItem>
                    <DropdownMenuItem>Traditional</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Featured</DropdownMenuItem>
                    <DropdownMenuItem>Not Featured</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center border text-white/90 border-white/70 rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 rounded-none ${
                      viewMode === "grid" ? "bg-white/40" : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <svg
                      xmlns="http://www.w3.org/1500/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 rounded-none ${
                      viewMode === "list" ? "bg-white/40" : ""
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <svg
                      xmlns="http://www.w3.org/1500/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-white/70">Loading designs...</div>
            ) : filteredDesigns && filteredDesigns.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDesigns.map((design) => (
                    <Card
                      key={design.id}
                      className="bg-black/30 border-white/10 overflow-hidden group hover:border-white/20 transition-colors"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={design.image_url || "/placeholder.svg"}
                          alt={design.title}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 z-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 hover:text-white rounded-full"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleEditDesign(design.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit design
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  updateDesign.mutate({
                                    id: design.id,
                                    featured: !design.featured,
                                  });
                                }}
                              >
                                {design.featured
                                  ? "Remove from featured"
                                  : "Add to featured"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleDeleteClick(design.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete design
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {design.featured && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="text-black bg-white hover:bg-white">
                              Featured
                            </Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-white">
                              {design.title}
                            </h3>
                            <p className="text-sm text-white/70 line-clamp-2">
                              {design.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">
                              {design.title}
                            </h3>
                            <p className="text-sm text-white/70">
                              By {design.artist}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {design.design_categories?.map((dc) => (
                              <Badge
                                key={dc.category_id}
                                variant="outline"
                                className="text-xs border-white/20 text-white/70"
                              >
                                {dc.category?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-black/30">
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/70 font-medium">
                          Image
                        </th>
                        <th className="text-left p-4 text-white/70 font-medium">
                          Title
                        </th>
                        <th className="text-left p-4 text-white/70 font-medium hidden md:table-cell">
                          Artist
                        </th>
                        <th className="text-left p-4 text-white/70 font-medium hidden lg:table-cell">
                          Categories
                        </th>
                        <th className="text-left p-4 text-white/70 font-medium hidden sm:table-cell">
                          Status
                        </th>
                        <th className="text-right p-4 text-white/70 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDesigns.map((design) => (
                        <tr
                          key={design.id}
                          className="border-b border-white/10 hover:bg-black/40"
                        >
                          <td className="p-4">
                            <div className="w-12 h-12 rounded overflow-hidden">
                              <img
                                src={design.image_url || "/placeholder.svg"}
                                alt={design.title}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-white">
                                {design.title}
                              </div>
                              <div className="text-sm text-white/70 line-clamp-1">
                                {design.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden text-white md:table-cell">
                            {design.artist}
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {design.design_categories?.map((dc) => (
                                <Badge
                                  key={dc.category_id}
                                  variant="outline"
                                  className="text-xs border-white/20 text-white/70"
                                >
                                  {dc.category?.name}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 hidden sm:table-cell">
                            {design.featured ? (
                              <Badge className="text-black bg-white hover:bg-white">
                                Featured
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-white/20 text-white/70"
                              >
                                Standard
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-white/70 hover:text-white"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditDesign(design.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit design
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    updateDesign.mutate({
                                      id: design.id,
                                      featured: !design.featured,
                                    });
                                  }}
                                >
                                  {design.featured
                                    ? "Remove from featured"
                                    : "Add to featured"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={() => handleDeleteClick(design.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete design
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-white/70">No designs found</div>
            )}
          </div>
        </main>
      </div>

      {/* Add Design Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            resetNewDesignState();
          }
        }}
      >
        <DialogContent className="bg-black/95 border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Design</DialogTitle>
            <DialogDescription className="text-white/70">
              Create a new tattoo design.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter design title"
                required
                className="bg-white/5 border-white/10 text-white"
                value={newDesign.title}
                onChange={(e) =>
                  setNewDesign({
                    ...newDesign,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter design description"
                className="bg-white/5 border-white/10 text-white"
                value={newDesign.description}
                onChange={(e) =>
                  setNewDesign({
                    ...newDesign,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <ImageUpload
                onImageUploaded={(url) =>
                  setNewDesign({
                    ...newDesign,
                    image_url: url,
                  })
                }
                currentImageUrl={newDesign.image_url}
                onRemoveImage={() => {
                  setNewDesign({ ...newDesign, image_url: "" });
                  setSelectedImageFile(null);
                }}
                onFileSelect={(file) => setSelectedImageFile(file)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {isLoadingCategories ? (
                  <div className="text-white/70">Loading categories...</div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={newDesign.category_ids.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewDesign({
                              ...newDesign,
                              category_ids: [
                                ...newDesign.category_ids,
                                category.id,
                              ],
                            });
                          } else {
                            setNewDesign({
                              ...newDesign,
                              category_ids: newDesign.category_ids.filter(
                                (id) => id !== category.id
                              ),
                            });
                          }
                        }}
                        className="rounded border-white/30 bg-white/10 text-white/70"
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal text-white/70"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-white/70">No categories available</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={newDesign.featured}
                onCheckedChange={(checked) =>
                  setNewDesign({
                    ...newDesign,
                    featured: checked as boolean,
                  })
                }
                className="rounded border-white/30 bg-white/10 text-white/70"
              />
              <Label htmlFor="featured" className="text-white/70">
                Featured design
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="bg-white text-black hover:bg-white/90"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDesign}
              className="bg-white text-black hover:bg-white/90"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add Design"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Design Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/95 border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Design</DialogTitle>
            <DialogDescription className="text-white/70">
              Edit the tattoo design details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter design title"
                required
                className="bg-white/5 border-white/10 text-white"
                value={newDesign.title}
                onChange={(e) =>
                  setNewDesign({
                    ...newDesign,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter design description"
                className="bg-white/5 border-white/10 text-white"
                value={newDesign.description}
                onChange={(e) =>
                  setNewDesign({
                    ...newDesign,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <ImageUpload
                onImageUploaded={(url) =>
                  setNewDesign({
                    ...newDesign,
                    image_url: url,
                  })
                }
                currentImageUrl={newDesign.image_url}
                onRemoveImage={() => {
                  setNewDesign({ ...newDesign, image_url: "" });
                  setSelectedImageFile(null);
                }}
                onFileSelect={(file) => setSelectedImageFile(file)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {isLoadingCategories ? (
                  <div className="text-white/70">Loading categories...</div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={newDesign.category_ids.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewDesign({
                              ...newDesign,
                              category_ids: [
                                ...newDesign.category_ids,
                                category.id,
                              ],
                            });
                          } else {
                            setNewDesign({
                              ...newDesign,
                              category_ids: newDesign.category_ids.filter(
                                (id) => id !== category.id
                              ),
                            });
                          }
                        }}
                        className="rounded border-white/30 bg-white/10 text-white/70"
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal text-white/70"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-white/70">No categories available</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={newDesign.featured}
                onCheckedChange={(checked) =>
                  setNewDesign({
                    ...newDesign,
                    featured: checked as boolean,
                  })
                }
                className="rounded border-white/30 bg-white/10 text-white/70"
              />
              <Label htmlFor="featured" className="text-white/70">
                Featured design
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-white/10 text-black hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDesign}
              className="bg-white text-black hover:bg-white/90"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Design"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/95 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete this design? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-black hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteDesign}
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
