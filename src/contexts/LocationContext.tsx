"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { LocationInfo } from "@/types/weather.types";
import { openweatherApi } from "@/lib/api/openweather";
import { toast } from "sonner";

interface LocationContextType {
  currentPosition: {
    latitude: number;
    longitude: number;
  } | null;
  isLoading: boolean;
  locationError: GeolocationPositionError | null;
  currentLocationInfo: LocationInfo | null;
  selectedLocation: LocationInfo | null;
  recentLocations: LocationInfo[];
  favoriteLocations: LocationInfo[];
  getCurrentLocation: () => void;
  selectLocation: (location: LocationInfo) => void;
  toggleFavoriteLocation: (location: LocationInfo) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const { loading, error, position, refreshLocation } = useGeolocation({
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 10 * 60 * 1000, // 10분
  });

  const [currentLocationInfo, setCurrentLocationInfo] =
    useState<LocationInfo | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );
  const [recentLocations, setRecentLocations] = useState<LocationInfo[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<LocationInfo[]>([]);

  // 로컬 스토리지에서 최근 및 즐겨찾기 위치 로드
  useEffect(() => {
    // 브라우저 환경인지 확인
    if (typeof window === "undefined") return;

    try {
      const storedRecents = localStorage.getItem("wa:recentLocations");
      const storedFavorites = localStorage.getItem("wa:favoriteLocations");
      const storedSelected = localStorage.getItem("wa:selectedLocation");

      if (storedRecents) {
        setRecentLocations(JSON.parse(storedRecents));
      }
      if (storedFavorites) {
        setFavoriteLocations(JSON.parse(storedFavorites));
      }
      if (storedSelected) {
        setSelectedLocation(JSON.parse(storedSelected));
      }
    } catch (error) {
      console.error("Error loading locations from localStorage:", error);
    }
  }, []);

  // 위치 정보 업데이트 시 위치명 가져오기
  useEffect(() => {
    const fetchLocationName = async () => {
      if (position && !loading) {
        try {
          console.log("역지오코딩 API 호출 시작");
          const response = await openweatherApi.reverseGeocode(
            position.latitude,
            position.longitude
          );

          if (response && response.length > 0) {
            console.log("역지오코딩 성공:", response[0].name);
            const locationData = response[0];
            const locationInfo: LocationInfo = {
              id: `current-${locationData.lat}-${locationData.lon}`,
              name: locationData.name || "현재 위치",
              state: locationData.state || "",
              country: locationData.country || "",
              lat: locationData.lat,
              lon: locationData.lon,
            };
            setCurrentLocationInfo(locationInfo);
            
            // 현재 위치를 선택된 위치로 설정 (처음에만)
            if (!selectedLocation) {
              setSelectedLocation(locationInfo);
            }
          } else {
            throw new Error("역지오코딩 결과가 없습니다.");
          }
        } catch (error) {
          console.error("Error fetching location name:", error);
          toast.error("위치 정보를 가져오는데 실패했습니다.");
          
          // 오류 시 기본 위치 정보 설정
          const fallbackInfo: LocationInfo = {
            id: `current-${position.latitude}-${position.longitude}`,
            name: "현재 위치",
            state: "",
            country: "",
            lat: position.latitude,
            lon: position.longitude,
          };
          
          setCurrentLocationInfo(fallbackInfo);
          
          // 현재 위치를 선택된 위치로 설정 (처음에만)
          if (!selectedLocation) {
            setSelectedLocation(fallbackInfo);
          }
        }
      }
    };

    fetchLocationName();
  }, [position, loading]); // selectedLocation 의존성 제거

  // 최근 위치 업데이트
  const updateRecentLocations = useCallback((location: LocationInfo) => {
    setRecentLocations((prevLocations) => {
      // 위도/경도 기준으로 중복 항목 필터링 (ID가 다르더라도 같은 위치면 중복 제거)
      const filteredLocations = prevLocations.filter(
        (loc) => !(Math.abs(loc.lat - location.lat) < 0.001 && Math.abs(loc.lon - location.lon) < 0.001)
      );
      // 최대 5개 유지
      const newLocations = [location, ...filteredLocations].slice(0, 5);
      localStorage.setItem("wa:recentLocations", JSON.stringify(newLocations));
      return newLocations;
    });
  }, []);

  // 위치 선택 함수
  const selectLocation = useCallback(
    (location: LocationInfo) => {
      setSelectedLocation(location);
      localStorage.setItem("wa:selectedLocation", JSON.stringify(location));
      updateRecentLocations(location);
    },
    [updateRecentLocations]
  );

  // 즐겨찾기 토글 함수
  const toggleFavoriteLocation = useCallback(
    (location: LocationInfo) => {
      setFavoriteLocations((prevFavorites) => {
        // 위도/경도 기준으로 같은 위치 찾기 (ID가 달라도 같은 위치인지 확인)
        const locationIndex = prevFavorites.findIndex(
          (fav) => Math.abs(fav.lat - location.lat) < 0.001 && Math.abs(fav.lon - location.lon) < 0.001
        );

        let newFavorites;
        if (locationIndex >= 0) {
          // 즐겨찾기에서 제거 (위도/경도 기준)
          newFavorites = prevFavorites.filter(
            (fav) => !(Math.abs(fav.lat - location.lat) < 0.001 && Math.abs(fav.lon - location.lon) < 0.001)
          );
        } else {
          // 즐겨찾기에 추가
          newFavorites = [...prevFavorites, location];
        }

        localStorage.setItem(
          "wa:favoriteLocations",
          JSON.stringify(newFavorites)
        );
        return newFavorites;
      });
    },
    []
  );

  // 현재 위치 갱신 함수
  const getCurrentLocation = useCallback(() => {
    refreshLocation();
    
    // 현재 위치를 선택된 위치로 변경
    if (currentLocationInfo) {
      selectLocation(currentLocationInfo);
      toast.success("현재 위치로 변경되었습니다.");
    }
  }, [refreshLocation, currentLocationInfo, selectLocation]);

  const value = {
    currentPosition: position
      ? { latitude: position.latitude, longitude: position.longitude }
      : null,
    isLoading: loading,
    locationError: error,
    currentLocationInfo,
    selectedLocation,
    recentLocations,
    favoriteLocations,
    getCurrentLocation,
    selectLocation,
    toggleFavoriteLocation,
  };

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
};
