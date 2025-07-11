import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@shared/schema";

interface ServiceCategoriesProps {
  selectedCategory: ServiceCategory | null;
  onCategorySelect: (category: ServiceCategory) => void;
}

export default function ServiceCategories({ selectedCategory, onCategorySelect }: ServiceCategoriesProps) {
  const { data: categories, isLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="col-span-2 bg-gray-200 rounded-lg p-4 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (!categories) {
    return (
      <div className="text-center text-gray-500">
        Failed to load service categories. Please try again.
      </div>
    );
  }

  const getIconClass = (icon: string) => {
    const iconMap: Record<string, string> = {
      "fas fa-palette": "🎨",
      "fas fa-laptop-code": "💻",
      "fas fa-bullhorn": "📢",
      "fas fa-tshirt": "👕",
      "fas fa-paint-brush": "🖌️",
      "fas fa-box": "📦",
      "fas fa-book": "📚"
    };
    return iconMap[icon] || "🎨";
  };

  return (
    <div className="w-full">
      {/* Category Buttons - Exact Figma positioning */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {categories.map((category, index) => {
          const isSelected = selectedCategory?.id === category.id || category.isActive;
          
          // Figma-based widths and colors matching your design
          const getCategoryStyle = () => {
            const styles = [
              { width: '163px', color: '#D9D9D9' },   // Logo & Identity  
              { width: '156px', color: '#01A1C1' },   // Web App Design (active in Figma)
              { width: '222px', color: '#D9D9D9' },   // Business Advertising
              { width: '231px', color: '#D9D9D9' },   // Clothing & Merchandise
              { width: '158px', color: '#D9D9D9' },   // Art & Illustration
              { width: '157px', color: '#D9D9D9' },   // Packaging & Label
              { width: '161px', color: '#D9D9D9' },   // Book & Magazine
              { width: '140px', color: '#D9D9D9' },   // Social Media
              { width: '150px', color: '#D9D9D9' },   // Print Design
              { width: '170px', color: '#D9D9D9' }    // Brand Guidelines
            ];
            
            if (isSelected) {
              const colors = ['#01A1C1', '#B74514', '#D23640', '#B86577', '#8C29BA', '#CC373B'];
              return { 
                ...styles[index % styles.length], 
                color: colors[index % colors.length] 
              };
            }
            
            return styles[index % styles.length] || { width: '150px', color: '#D9D9D9' };
          };
          
          const style = getCategoryStyle();
          
          return (
            <button
              key={category.id}
              onClick={() => {
                // All categories now go to the tabbed category page
                window.location.href = '/categories';
              }}
              className="text-base font-medium transition-all hover:opacity-90 shadow-sm"
              style={{
                backgroundColor: isSelected ? style.color : '#D9D9D9',
                color: isSelected ? '#ffffff' : '#313030',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: isSelected ? 600 : 500,
                border: 'none',
                cursor: 'pointer',
                height: '62px',
                width: style.width,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {category.name === 'Logo & Identity' ? 'Logo & Identity' :
               category.name === 'Web App Design' ? 'Web & App Design' :
               category.name === 'Business Advertising' ? 'Business & Advertising' :
               category.name === 'Clothing & Merchandise' ? 'Clothing & Merchandise' :
               category.name === 'Art & Illustration' ? 'Art & Illustration' :
               category.name === 'Packaging & Label' ? 'Packaging & Label' :
               category.name === 'Book & Magazine' ? 'Book & Magazine' :
               category.name === 'Social Media' ? 'Social Media' :
               category.name === 'Print Design' ? 'Print Design' :
               category.name === 'Brand Guidelines' ? 'Brand Guidelines' :
               category.name}
            </button>
          );
        })}
      </div>

      {/* Horizontal divider matching Figma */}
      <div className="h-px bg-gray-400 w-full"></div>
    </div>
  );
}
