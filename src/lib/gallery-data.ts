export type GalleryItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string[];
};

export const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "Geometric Sleeve",
    description: "Intricate geometric patterns forming a full sleeve design",
    imageUrl:
      "https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",
    category: ["geometric", "sleeve"],
  },
  {
    id: 2,
    title: "Minimalist Linework",
    description: "Clean, simple lines creating an elegant design",
    imageUrl:
      "https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",
    category: ["minimalist", "linework"],
  },
  {
    id: 3,
    title: "Dotwork Portrait",
    description: "Detailed portrait created entirely with dotwork technique",
    imageUrl:
      "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",
    category: ["dotwork", "portrait"],
  },
  {
    id: 4,
    title: "Blackwork Floral",
    description: "Bold floral design with heavy black ink",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",
    category: ["blackwork", "floral"],
  },

  {
    id: 6,
    title: "Abstract Composition",
    description: "Modern abstract design with dynamic composition",
    imageUrl:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",
    category: ["abstract", "composition"],
  },

  {
    id: 9,
    title: "Botanical Study",
    description: "Detailed botanical illustration with scientific accuracy",
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",
    category: ["botanical", "illustration"],
  },
];

export const categories = [
  "All",
  "geometric",
  "sleeve",
  "minimalist",
  "linework",
  "dotwork",
  "portrait",
  "blackwork",
  "floral",
  "script",
  "fineline",
  "abstract",
  "composition",
  "mandala",
  "ornamental",
  "surrealist",
  "symbolic",
  "botanical",
  "illustration",
];
