import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingScreen, { driveProgress } from "../components/LoadingScreen";

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: true });

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const driverRef = useRef<ReturnType<typeof driveProgress> | null>(null);

  useEffect(() => {
    // Start the fake progress bar immediately
    driverRef.current = driveProgress(setPercent);

    // Finish when the window load event fires (all assets ready)
    const handleLoad = () => {
      driverRef.current?.finish();
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const handleComplete = () => {
    setIsLoading(false);
    // Re-enable scroll (loading screen sets overflow:hidden on body)
    document.body.style.overflow = "";
  };

  // Lock body scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {isLoading && (
        <LoadingScreen percent={percent} onComplete={handleComplete} />
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
