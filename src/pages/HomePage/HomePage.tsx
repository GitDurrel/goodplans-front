import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Car, Palette, Wrench } from "lucide-react";

import { Hero } from "../../components/home/Hero";
import { FiltersDrawer } from "../../components/home/FiltersDrawer";
import { SponsoredCarousel } from "../../components/home/SponsoredCarousel";
import { ListingsGrid } from "../../components/listings/ListingsGrid";
import {
  fetchCategories,
  fetchMostViewedListings,
  fetchRecentListings,
} from "./api";
import type { CarouselItem, Category, Filters, Listing } from "./types";

const HERO_IMAGE =
  "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/public/image//arab-people-demonstrating-together.jpg";

const DEFAULT_FILTERS: Filters = {
  category: "",
  subcategory: "",
  city: "",
  region: "",
  minPrice: "",
  maxPrice: "",
  transaction_type: "",
};

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    title: "Urbain Five",
    description:
      "Découvrez le fitness urbain dans un environnement moderne et inspirant. Des équipements de pointe pour tous vos objectifs de remise en forme.",
    sponsoredText: "Annonce sponsorisée",
    visitButtonText: "Visitez",
    visitUrl: "https://urbainfive.com",
  },
  {
    image:
      "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/public/image/Petit-ambassadeur-2-WhatsApp-Image-2025-07-15-at-14.12.31-1200x694.jpeg",
    title: "AMG BUILDING",
    description: "AMG BUILDING vous propose des projets immobiliers à partir de 400.000€",
    sponsoredText: "Annonce sponsorisée",
    visitButtonText: "Découvrir",
    visitUrl: "https://amg-building.com/projects/le-petit-ambassadeur/",
  },
  {
    image:
      "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/public/image//17345.jpg",
    title: "Besoin Publicitaire ?",
    description:
      "Que vous soyez une marque locale ou une grande entreprise, notre site est le canal idéal pour capter l'attention de vos futurs clients.",
    sponsoredText: "Pour vos pubs",
    visitButtonText: "Contactez nous",
    visitUrl: "https://goodplans.ma/devis",
  },
];

export function HomePage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [mostViewedListings, setMostViewedListings] = useState<Listing[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingMostViewed, setLoadingMostViewed] = useState(false);

  const categoryTabs = useMemo(() => {
    const iconMap: Record<string, typeof Building2> = {
      immobilier: Building2,
      vehicules: Car,
      services: Wrench,
      artisanat: Palette,
    };

    return categories.map((category) => ({
      id: category.slug || category.id,
      label: category.name,
      icon: iconMap[category.slug || ""] || Building2,
    }));
  }, [categories]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        setLoadingRecent(true);
        const data = await fetchRecentListings(filters);
        setRecentListings(data);
      } catch (error) {
        console.error("Erreur lors du chargement des annonces récentes", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    loadRecent();
  }, [filters]);

  useEffect(() => {
    const loadMostViewed = async () => {
      try {
        setLoadingMostViewed(true);
        const data = await fetchMostViewedListings();
        setMostViewedListings(data);
      } catch (error) {
        console.error("Erreur lors du chargement des plus consultées", error);
      } finally {
        setLoadingMostViewed(false);
      }
    };

    loadMostViewed();
  }, []);

  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.append("q", searchQuery);
    if (filters.category) searchParams.append("category", filters.category);
    if (filters.subcategory) searchParams.append("subcategory", filters.subcategory);
    if (filters.city) searchParams.append("city", filters.city);
    if (filters.region) searchParams.append("region", filters.region);
    if (filters.minPrice) searchParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.append("maxPrice", filters.maxPrice);
    if (filters.transaction_type)
      searchParams.append("transaction_type", filters.transaction_type);

    navigate(`/search?${searchParams.toString()}`);
  };

  const handleViewMore = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/listings?${params.toString()}`);
  };

  const selectedCategoryLabel =
    categoryTabs.find((tab) => tab.id === filters.category)?.label || undefined;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="px-4">
        <Hero
          title="Des milliers d'annonces sur"
          subtitle="Achetez, louez ou proposez vos services en toute simplicité."
          heroImage={HERO_IMAGE}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSubmitSearch={handleSearch}
          onOpenFilters={() => setShowFilters(true)}
          selectedCategory={filters.category}
          onSelectCategory={(cat) => handleFilterChange("category", cat)}
          tabs={categoryTabs}
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        <ListingsGrid
          title={
            selectedCategoryLabel
              ? `Annonces ${selectedCategoryLabel}`
              : "Annonces récentes"
          }
          listings={recentListings}
          loading={loadingRecent}
          onSeeMore={handleViewMore}
          emptyMessage="Aucune annonce ne correspond aux filtres."
        />

        <SponsoredCarousel items={CAROUSEL_ITEMS} />

        <ListingsGrid
          title="Les plus consultées"
          listings={mostViewedListings}
          loading={loadingMostViewed}
          onSeeMore={() => navigate("/listings")}
        />
      </div>

      <FiltersDrawer
        open={showFilters}
        filters={filters}
        categories={categoryTabs}
        loadingCategories={loadingCategories}
        onChange={handleFilterChange}
        onReset={resetFilters}
        onApply={() => undefined}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
}
