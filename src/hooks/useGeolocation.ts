"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null;
  position: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
}

export const useGeolocation = (options?: PositionOptions) => {
  // 초기 상태 설정
  const [state, setState] = useState<GeolocationState>({
    loading: false, // 초기 로딩 상태는 false로 변경
    error: null,
    position: null,
  });
  
  // 초기화 상태 추적을 위한 ref
  const initialized = useRef(false);

  // 옵션을 ref로 저장하여 변경되지 않도록 함
  const optionsRef = useRef<PositionOptions>({
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 10 * 60 * 1000, // 10분
    ...options,
  });

  // Geolocation API 콜백 함수들
  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      loading: false,
      error: null,
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      },
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    setState({
      loading: false,
      error,
      position: null,
    });
  }, []);

  // 초기화 및 감시 설정
  useEffect(() => {
    // 이미 초기화 되었으면 중복 실행 방지
    if (initialized.current) return;
    initialized.current = true;
    
    // Geolocation API가 지원되는지 확인
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: {
          code: 0,
          message: "Geolocation not supported",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        },
        position: null,
      });
      return;
    }

    // 최초 로딩 상태로 설정
    setState(prev => ({ ...prev, loading: true }));

    // 위치 감시 시작
    const geoWatchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      optionsRef.current
    );

    // 클린업 함수
    return () => {
      navigator.geolocation.clearWatch(geoWatchId);
    };
  }, []); // 의존성 배열에서 options 제거, 빈 배열로 변경

  // 위치 수동 새로고침 함수
  const refreshLocation = useCallback(() => {
    // 이미 로딩 중이면 중복 요청 방지
    if (state.loading) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      optionsRef.current
    );
  }, [onSuccess, onError, state.loading]);

  return { ...state, refreshLocation };
};
