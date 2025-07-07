import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ServiceCategory, ServicePackage } from "@shared/schema";

interface ServicePackagesProps {
  selectedCategory: ServiceCategory | null;
  onPackageSelect: (pkg: ServicePackage) => void;
  onQuizStart: () => void;
}

export default function ServicePackages({ selectedCategory, onPackageSelect, onQuizStart }: ServicePackagesProps) {
  const { data: packages, isLoading } = useQuery<ServicePackage[]>({
    queryKey: selectedCategory 
      ? ["/api/categories", selectedCategory.id, "packages"]
      : ["/api/packages"],
    enabled: true,
  });

  const filteredPackages = packages?.filter(pkg => 
    !selectedCategory || pkg.categoryId === selectedCategory.id
  ) || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="h-6 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-4 w-24" />
                  <div className="h-20 bg-gray-200 rounded mb-6" />
                  <div className="h-10 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!packages || filteredPackages.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-medium text-gray-500 mb-4">
            {selectedCategory ? `No packages available for ${selectedCategory.name}` : "No packages available"}
          </h2>
          <p className="text-gray-400">Please select a different category or try again later.</p>
        </div>
      </section>
    );
  }

  // Define category-specific layouts based on your SVG designs
  const getCategoryLayout = () => {
    if (!selectedCategory) return null;

    const layouts = {
      'logo-identity': () => (
        <div className="bg-white">
          {/* Hero Image Section - SVG pattern0_4006_592 */}
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Logo & Identity Design</h1>
                <p className="text-xl">Professional logo and brand identity solutions</p>
              </div>
            </div>
          </div>

          {/* Service Cards Section */}
          <div style={{ backgroundColor: '#D9D9D9', height: '430px' }} className="w-full py-8">
            <div className="max-w-screen-xl mx-auto px-6">
              <div className="flex gap-6 overflow-x-auto">
                {filteredPackages?.slice(0, 5).map((pkg, index) => (
                  <ServiceCard key={pkg.id} pkg={pkg} index={index} onSelect={onPackageSelect} />
                ))}
              </div>
            </div>
          </div>

          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Logo & Identity"
          />
        </div>
      ),
      'web-design': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Web & App Design</h1>
                <p className="text-xl">Modern web and mobile application designs</p>
              </div>
            </div>
          </div>
          {/* Additional category-specific content */}
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Web Design"
          />
        </div>
      ),
      'business-advertising': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Business Advertising</h1>
                <p className="text-xl">Effective advertising and marketing materials</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Business Advertising"
          />
        </div>
      ),
      'clothing-merchandise': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Clothing & Merchandise</h1>
                <p className="text-xl">Custom apparel and promotional merchandise design</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Clothing & Merchandise"
          />
        </div>
      ),
      'art-illustration': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Art & Illustration</h1>
                <p className="text-xl">Creative artwork and custom illustrations</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Art & Illustration"
          />
        </div>
      ),
      'packaging-label': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Packaging & Label</h1>
                <p className="text-xl">Product packaging and label design solutions</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Packaging & Label"
          />
        </div>
      ),
      'book-magazine': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Book & Magazine</h1>
                <p className="text-xl">Editorial design for books and publications</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Book & Magazine"
          />
        </div>
      ),
      'social-media': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Social Media</h1>
                <p className="text-xl">Engaging social media graphics and content</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Social Media"
          />
        </div>
      ),
      'print-design': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Print Design</h1>
                <p className="text-xl">Professional print materials and layouts</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Print Design"
          />
        </div>
      ),
      'brand-guidelines': () => (
        <div className="bg-white">
          <div className="relative" style={{ paddingLeft: '24px', paddingTop: '20px' }}>
            <div 
              className="bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center text-white rounded-lg" 
              style={{ width: '775px', height: '517px' }}
            >
              <div className="text-center px-8">
                <h1 className="text-4xl font-bold mb-4">Brand Guidelines</h1>
                <p className="text-xl">Comprehensive brand style guides and standards</p>
              </div>
            </div>
          </div>
          <ContentSections 
            packages={filteredPackages} 
            onPackageSelect={onPackageSelect} 
            onQuizStart={onQuizStart}
            category="Brand Guidelines"
          />
        </div>
      )
    };

    const layoutKey = selectedCategory.slug as keyof typeof layouts;
    const layout = layouts[layoutKey];
    return layout ? layout() : layouts['logo-identity']();
  };

  return getCategoryLayout();
}

// Helper component for service cards
function ServiceCard({ pkg, index, onSelect }: { 
  pkg: ServicePackage; 
  index: number; 
  onSelect: (pkg: ServicePackage) => void; 
}) {
  const cardData = [
    { title: "Logo Design", subtitle: "Logo", width: 232, height: 266 },
    { title: "Web Design", subtitle: "Web App", width: 232, height: 260 },
    { title: "Business Card", subtitle: "Business", width: 232, height: 260 },
    { title: "Art & Design", subtitle: "Art", width: 232, height: 260 },
    { title: "Print Design", subtitle: "Print", width: 232, height: 260 }
  ];
  
  const cardInfo = cardData[index] || cardData[0];
  
  return (
    <div
      className="flex-shrink-0 bg-white rounded-lg overflow-hidden"
      style={{
        width: `${cardInfo.width}px`,
        height: `${cardInfo.height}px`,
        borderRadius: '9px'
      }}
    >
      {/* Image section */}
      <div 
        className="bg-gradient-to-br from-blue-400 to-purple-500 relative"
        style={{ height: '70%', borderRadius: '9px 9px 0 0' }}
      >
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-3">
              {index === 0 ? '🎨' : index === 1 ? '💻' : index === 2 ? '💼' : index === 3 ? '🖼️' : '📄'}
            </div>
            <h3 className="font-bold text-lg">{cardInfo.title}</h3>
            <p className="text-sm opacity-90">{cardInfo.subtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-3" style={{ height: '30%' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-base">{pkg.price} SAR</span>
          <button
            onClick={() => onSelect(pkg)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Select
          </button>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2">{pkg.description}</p>
      </div>
    </div>
  );
}

// Helper component for content sections
function ContentSections({ 
  packages, 
  onPackageSelect, 
  onQuizStart, 
  category 
}: { 
  packages: ServicePackage[]; 
  onPackageSelect: (pkg: ServicePackage) => void; 
  onQuizStart: () => void; 
  category: string; 
}) {
  return (
    <div className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Divider Line */}
        <div style={{ borderTop: '1px solid #A79F9F', margin: '50px 0' }}></div>
        
        {/* Left and Right Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Content Section with vertical divider */}
          <div style={{ borderRight: '1px solid #A79F9F', paddingRight: '40px' }}>
            <h2 className="text-3xl font-bold mb-8 text-black">Popular {category} Services</h2>
            <div className="space-y-8">
              {packages?.slice(0, 3).map((pkg) => (
                <div key={pkg.id} className="pb-6">
                  <h3 className="text-xl font-semibold mb-3 text-black">{pkg.name}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{pkg.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-black">{pkg.price} SAR</span>
                    <button
                      onClick={() => onPackageSelect(pkg)}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                      style={{ backgroundColor: '#01a1c1' }}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content Section with Portfolio Images */}
          <div className="pl-4">
            <h2 className="text-3xl font-bold mb-8 text-black">Portfolio Examples</h2>
            <div className="space-y-6">
              {/* Portfolio Image placeholders */}
              <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '138px' }}>
                <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📱</div>
                    <span className="font-semibold">{category} Sample 1</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '138px' }}>
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌐</div>
                    <span className="font-semibold">{category} Sample 2</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '138px' }}>
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <span className="font-semibold">{category} Sample 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Portfolio Image Section */}
        <div className="mt-16">
          <div 
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white"
            style={{ width: '590px', height: '289px', marginLeft: '80px' }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2">Latest {category} Work</h3>
              <p className="text-lg opacity-90">Professional designs that make an impact</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <button
            onClick={onQuizStart}
            className="bg-green-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Take Brand Discovery Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
