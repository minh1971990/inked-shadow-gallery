import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus, Search, Edit, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { useCategories } from "@/hooks/use-supabase";
import { useToast } from "@/components/ui/use-toast";

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    featured: false,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const { categories, isLoading, addCategory, updateCategory, deleteCategory } =
    useCategories();

  const filteredCategories = categories?.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "featured" && category.featured) ||
      (filterStatus === "standard" && !category.featured);

    return matchesSearch && matchesFilter;
  });

  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      featured: false,
    });
    setSelectedCategory(null);
  };

  const validateCategory = () => {
    if (!newCategory.name.trim()) {
      return { isValid: false, message: "Category name is required" };
    }

    const isDuplicate = categories?.some(
      (cat) =>
        cat.name.toLowerCase() === newCategory.name.toLowerCase() &&
        cat.id !== selectedCategory
    );

    if (isDuplicate) {
      return {
        isValid: false,
        message: "A category with this name already exists",
      };
    }

    return { isValid: true };
  };

  const handleAddCategory = async () => {
    console.log("handleAddCategory called");
    const validationResult = validateCategory();
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
      await addCategory.mutateAsync(newCategory);
      setIsAddDialogOpen(false);
      resetNewCategory();
      toast({
        title: "Success",
        description: "Category added successfully",
        duration: 1500,
      });
    } catch (error) {
      console.log(error);
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        duration: 1500,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditCategory = async (id: number) => {
    const category = categories?.find((c) => c.id === id);
    if (category) {
      setSelectedCategory(id);
      setNewCategory({
        name: category.name,
        description: category.description || "",
        featured: category.featured,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateCategory = async () => {
    console.log("handleUpdateCategory called");
    const validationResult = validateCategory();
    if (!selectedCategory || !validationResult.isValid) {
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
      await updateCategory.mutateAsync({
        id: selectedCategory,
        ...newCategory,
      });
      setIsEditDialogOpen(false);
      resetNewCategory();
      toast({
        title: "Success",
        description: "Category updated successfully",
        duration: 1500,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        duration: 1500,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategory.mutateAsync(categoryToDelete);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast({
        title: "Success",
        description: "Category deleted successfully",
        duration: 1500,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        duration: 1500,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <AdminSidebar />
        <div className="md:pl-64">
          <main className="p-8">
            <div className="flex items-center justify-center h-full">
              <p className="text-white">Loading...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <main className="p-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Categories Management
            </h1>
            <div className="flex justify-between items-center">
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) {
                    resetNewCategory();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-white/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border border-white/10 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Create a new tattoo style category for organizing designs.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Watercolor"
                        required
                        className="bg-white/5 border-white/10 text-white"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe this tattoo style..."
                        className="bg-white/5 border-white/10 text-white"
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        className="rounded border-white/30 bg-white/10 text-white/70"
                        checked={newCategory.featured}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            featured: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="featured" className="text-white/70">
                        Featured category
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
                      onClick={handleAddCategory}
                      className="bg-white text-black hover:bg-white/90"
                      disabled={isAdding}
                    >
                      {isAdding ? "Adding..." : "Add Category"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  type="search"
                  placeholder="Search categories..."
                  className="pl-8 bg-black/30 border-white/10 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/10 text-black"
                  >
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-black bg-white border-white/10">
                  <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("all")}
                    className={filterStatus === "all" ? "bg-white/10" : ""}
                  >
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("featured")}
                    className={filterStatus === "featured" ? "bg-white/10" : ""}
                  >
                    Featured
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("standard")}
                    className={filterStatus === "standard" ? "bg-white/10" : ""}
                  >
                    Standard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-md border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/30">
                  <TableRow className="hover:bg-black/40 border-white/10">
                    <TableHead className="text-white/70">Name</TableHead>
                    <TableHead className="text-white/70 hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="text-white/70 text-center hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-white/70 hidden lg:table-cell">
                      Created at
                    </TableHead>
                    <TableHead className="text-white/70 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories?.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-black/40 border-white/10"
                    >
                      <TableCell className="font-medium text-white">
                        {category.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-white/70 line-clamp-2">
                          {category.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        {category.featured ? (
                          <Badge className="bg-white text-black hover:bg-white">
                            Featured
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-white/30 text-white/70"
                          >
                            Standard
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-white">
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-white/70 hover:text-black"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(category.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit category
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {category.featured ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateCategory.mutate({
                                    id: category.id,
                                    featured: false,
                                  })
                                }
                              >
                                Remove from featured
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateCategory.mutate({
                                    id: category.id,
                                    featured: true,
                                  })
                                }
                              >
                                Add to featured
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleDeleteClick(category.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            resetNewCategory();
          }
        }}
      >
        <DialogContent className="bg-black/95 border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription className="text-white/70">
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Watercolor"
                required
                className="bg-white/5 border-white/10 text-white"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe this tattoo style..."
                className="bg-white/5 border-white/10 text-white"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-featured"
                className="rounded border-white/30 bg-white/10 text-white/70"
                checked={newCategory.featured}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    featured: e.target.checked,
                  })
                }
              />
              <Label htmlFor="edit-featured" className="text-white/70">
                Featured category
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
              onClick={handleUpdateCategory}
              className="bg-white text-black hover:bg-white/90"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Category"}
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
              Are you sure you want to delete this category? This action cannot
              be undone.
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
              onClick={() => handleDeleteCategory()}
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
