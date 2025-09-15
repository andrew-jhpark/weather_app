"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, MapPin, Star, History } from "lucide-react";
import { useLocationContext } from "@/contexts/LocationContext";
import { LocationInfo } from "@/types/weather.types";
import { GeocodeResult } from "@/types/api.types";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);

  const {
    selectLocation,
    recentLocations,
    favoriteLocations,
    toggleFavoriteLocation,
  } = useLocationContext();
  const { t } = useI18n();

  const majorCities: LocationInfo[] = useMemo(() => [
    { id: "kr-seoul", name: "서울", country: "KR", lat: 37.5665, lon: 126.978 },
    { id: "kr-busan", name: "부산", country: "KR", lat: 35.1796, lon: 129.0756 },
    { id: "kr-incheon", name: "인천", country: "KR", lat: 37.4563, lon: 126.7052 },
    { id: "kr-daegu", name: "대구", country: "KR", lat: 35.8714, lon: 128.6014 },
    { id: "kr-gwangju", name: "광주", country: "KR", lat: 35.1595, lon: 126.8526 },
    { id: "kr-daejeon", name: "대전", country: "KR", lat: 36.3504, lon: 127.3845 },
    { id: "kr-ulsan", name: "울산", country: "KR", lat: 35.5384, lon: 129.3114 },
    { id: "kr-sejong", name: "세종", country: "KR", lat: 36.4801, lon: 127.289 },
    { id: "kr-suwon", name: "수원", country: "KR", lat: 37.2636, lon: 127.0286 },
    { id: "kr-jeju", name: "제주", country: "KR", lat: 33.4996, lon: 126.5312 },
    { id: "kr-changwon", name: "창원", country: "KR", lat: 35.227, lon: 128.681 },
    { id: "kr-sokcho", name: "속초", country: "KR", lat: 38.2068, lon: 128.5919 },
    { id: "kr-gangneung", name: "강릉", country: "KR", lat: 37.7519, lon: 128.8761 },
    { id: "kr-chuncheon", name: "춘천", country: "KR", lat: 37.8813, lon: 127.7298 },
    { id: "kr-wonju", name: "원주", country: "KR", lat: 37.342, lon: 127.9201 },
    { id: "kr-cheongju", name: "청주", country: "KR", lat: 36.6425, lon: 127.4891 },
    { id: "kr-chungju", name: "충주", country: "KR", lat: 36.9783, lon: 127.9259 },
    { id: "kr-cheonan", name: "천안", country: "KR", lat: 36.815, lon: 127.1139 },
    { id: "kr-jeonju", name: "전주", country: "KR", lat: 35.8242, lon: 127.148 },
    { id: "kr-gunsan", name: "군산", country: "KR", lat: 35.967, lon: 126.737 },
    { id: "kr-mokpo", name: "목포", country: "KR", lat: 34.8119, lon: 126.3917 },
    { id: "kr-yeosu", name: "여수", country: "KR", lat: 34.7604, lon: 127.6622 },
    { id: "kr-pohang", name: "포항", country: "KR", lat: 36.0319, lon: 129.3644 },
    { id: "kr-gyeongju", name: "경주", country: "KR", lat: 35.8562, lon: 129.2248 },
    { id: "kr-gumi", name: "구미", country: "KR", lat: 36.1134, lon: 128.3393 },
    { id: "kr-gimhae", name: "김해", country: "KR", lat: 35.234, lon: 128.881 },
  ], []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  useEffect(() => {
    const searchLocations = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      // 1. Client-side search first
      const normalizedQuery = debouncedQuery.toLowerCase().normalize("NFC");
      const clientResults = majorCities.filter(city => 
        city.name.toLowerCase().normalize("NFC").includes(normalizedQuery)
      );

      if (clientResults.length > 0) {
        setSearchResults(clientResults);
        setIsSearching(false);
        return;
      }
      
      // 2. If no client results, call API
      try {
        const response = await fetch(
          `/api/geocode?q=${encodeURIComponent(debouncedQuery)}&limit=5`
        );
        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const sortedData = data.data.sort((a: GeocodeResult, b: GeocodeResult) => {
            if (a.country === 'KR' && b.country !== 'KR') return -1;
            if (a.country !== 'KR' && b.country === 'KR') return 1;
            return 0;
          });

          const processedResults = sortedData.map((item: GeocodeResult) => {
            if (!item.lat || !item.lon) return null;
            const koreanName = item.local_names?.ko || item.name;
            const normalizedName = koreanName ? koreanName.normalize("NFC") : t("common.unknown");
            const latStr = Math.round(item.lat * 1e6) / 1e6;
            const lonStr = Math.round(item.lon * 1e6) / 1e6;
            const uniqueId = `${item.country?.toLowerCase() || 'unknown'}-${item.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${latStr}-${lonStr}${item.state ? `-${item.state.toLowerCase().replace(/\s+/g, '-')}` : ''}`;

            return {
              id: uniqueId,
              name: normalizedName,
              state: item.state || '',
              country: item.country || '??',
              lat: item.lat,
              lon: item.lon,
            };
          }).filter(Boolean);

          setSearchResults(processedResults as LocationInfo[]);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Location search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchLocations();
    }, [debouncedQuery, t, majorCities]);

  const handleSelectLocation = (location: LocationInfo) => {
    selectLocation(location);
    setOpen(false);
    setSearchQuery("");
  };

  const isFavorite = (locationId: string) => {
    return favoriteLocations.some((loc) => loc.id === locationId);
  };

  const handleToggleFavorite = (
    e: React.MouseEvent,
    location: LocationInfo
  ) => {
    e.stopPropagation();
    toggleFavoriteLocation(location);
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm text-muted-foreground sm:pr-12 md:w-full"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">
          {t("header.searchPlaceholder")}
        </span>
        <span className="inline-flex lg:hidden">{t("common.search")}...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={t("header.searchPlaceholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">{t("common.searching")}...</span>
              </div>
            ) : (
              t("search.noResults")
            )}
          </CommandEmpty>

          {(searchResults.length > 0) && (
            <CommandGroup heading={t("search.results")}>
              {searchResults.map((location) => (
                <CommandItem
                  key={location.id}
                  value={`${location.name} ${location.state || ''} ${location.country}`}
                  onSelect={() => handleSelectLocation(location)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>
                      {location.name}
                      {location.state ? `, ${location.state}` : ""}{" "}
                      ({location.country})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => handleToggleFavorite(e, location)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        isFavorite(location.id) ? "fill-yellow-400" : ""
                      }`}
                    />
                    <span className="sr-only">
                      {isFavorite(location.id)
                        ? t("search.removeFavorite")
                        : t("search.addFavorite")}
                    </span>
                  </Button>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {favoriteLocations.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t("search.favorites")}>
                {favoriteLocations.map((location) => (
                  <CommandItem
                    key={`favorite-${location.id}`}
                    value={`favorite-${location.name} ${location.state || ''} ${location.country}`}
                    onSelect={() => handleSelectLocation(location)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Star className="mr-2 h-4 w-4 fill-yellow-400" />
                      <span>
                        {location.name}
                        {location.state ? `, ${location.state}` : ""},{" "}
                        {location.country}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {recentLocations.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t("search.recents")}>
                {recentLocations.map((location) => (
                  <CommandItem
                    key={`recent-${location.id}`}
                    value={`recent-${location.name} ${location.state || ''} ${location.country}`}
                    onSelect={() => handleSelectLocation(location)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <History className="mr-2 h-4 w-4" />
                      <span>
                        {location.name}
                        {location.state ? `, ${location.state}` : ""},{" "}
                        {location.country}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleToggleFavorite(e, location)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isFavorite(location.id) ? "fill-yellow-400" : ""
                        }`}
                      />
                      <span className="sr-only">
                        {isFavorite(location.id)
                          ? t("search.removeFavorite")
                          : t("search.addFavorite")}
                      </span>
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}