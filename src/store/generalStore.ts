import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface GeneralState {
    isGlobalLoading: boolean;
    globalError: string | null;
    theme: "light" | "dark";
    language: "uk" | "en";
    globalCacheTimeout: number;
    statistics: {
        completedWorks: number;
        satisfiedClients: number;
        uniqueDesigns: number;
        naturalIngredients: number;
        lastUpdated: number | null;
    };
    setGlobalLoading: (loading: boolean) => void;
    setGlobalError: (error: string | null) => void;
    setTheme: (theme: "light" | "dark") => void;
    setLanguage: (language: "uk" | "en") => void;
    updateStatistics: (
        stats: Partial<Omit<GeneralState["statistics"], "lastUpdated">>
    ) => void;
    clearAllCaches: () => void;
    resetApp: () => void;
}

export const useGeneralStore = create<GeneralState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                isGlobalLoading: false,
                globalError: null,
                theme: "light",
                language: "uk",
                globalCacheTimeout: 5 * 60 * 1000, // 5 minutes

                statistics: {
                    completedWorks: 200,
                    satisfiedClients: 150,
                    uniqueDesigns: 50,
                    naturalIngredients: 100,
                    lastUpdated: null,
                },

                // Set global loading state
                setGlobalLoading: (loading) => {
                    set({ isGlobalLoading: loading });
                },

                // Set global error
                setGlobalError: (error) => {
                    set({ globalError: error });
                },

                // Set theme
                setTheme: (theme) => {
                    set({ theme });
                    // Update document class for theme
                    if (typeof document !== "undefined") {
                        document.documentElement.classList.toggle(
                            "dark",
                            theme === "dark"
                        );
                    }
                },

                // Set language
                setLanguage: (language) => {
                    set({ language });
                },

                // Update statistics
                updateStatistics: (stats) => {
                    set((state) => ({
                        statistics: {
                            ...state.statistics,
                            ...stats,
                            lastUpdated: Date.now(),
                        },
                    }));
                },

                // Clear all caches (calls clear cache on all stores)
                clearAllCaches: () => {
                    // This will be used to trigger cache clearing in other stores
                    // You can import other stores here and call their clearCache methods
                    set({
                        statistics: {
                            ...get().statistics,
                            lastUpdated: null,
                        },
                    });
                },

                // Reset entire app state
                resetApp: () => {
                    set({
                        isGlobalLoading: false,
                        globalError: null,
                        theme: "light",
                        language: "uk",
                        statistics: {
                            completedWorks: 200,
                            satisfiedClients: 150,
                            uniqueDesigns: 50,
                            naturalIngredients: 100,
                            lastUpdated: null,
                        },
                    });
                },
            }),
            {
                name: "general-store",
                partialize: (state) => ({
                    theme: state.theme,
                    language: state.language,
                    statistics: state.statistics,
                }),
            }
        ),
        {
            name: "general-store",
        }
    )
);
