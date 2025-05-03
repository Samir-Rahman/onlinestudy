import {create} from "zustand"
import { axiosInstance } from "../lib/axios"

export const authStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    averageRating: 0,
    totalRatings: 0,

    login: async (email, password) => {
        try {
            const res = await axiosInstance.post("/auth/login", {
                email,
                password
            });
            set({ authUser: res.data });
            return { success: true };
        } catch (error) {
            console.error("Error in login:", error);
            return {
                success: false,
                error: error.response?.data?.message || "An error occurred during login"
            };
        }
    },

    signup: async (userData) => {
        try {
            const res = await axiosInstance.post("/auth/signup", userData);
            set({ authUser: res.data });
            return { success: true };
        } catch (error) {
            console.error("Error in signup:", error);
            return {
                success: false,
                error: error.response?.data?.message || "An error occurred during signup"
            };
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            return { success: true };
        } catch (error) {
            console.error("Error in logout:", error);
            return { 
                success: false,
                error: error.response?.data?.message || "An error occurred during logout"
            };
        }
    },

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in check auth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    updateProfile: async (profilePic) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", { profilePic });
            set({ authUser: res.data });
            return { success: true };
        } catch (error) {
            console.error("Error updating profile:", error);
            return {
                success: false,
                error: error.response?.data?.message || "An error occurred updating profile"
            };
        }
    },

    updateSubjects: async (subjects) => {
        try {
            const res = await axiosInstance.put("/auth/update-subjects", { subjects });
            set({ authUser: res.data });
            return { success: true };
        } catch (error) {
            console.error("Error updating subjects:", error);
            return {
                success: false,
                error: error.response?.data?.message || "An error occurred updating subjects"
            };
        }
    },

    updateRating: async (rating) => {
        try {
            await axiosInstance.post("/auth/rating", { rating });
            return { success: true };
        } catch (error) {
            console.error("Error updating rating:", error);
            return {
                success: false,
                error: error.response?.data?.message || "An error occurred updating rating"
            };
        }
    },

    fetchAverageRating: async () => {
        try {
            const res = await axiosInstance.get("/auth/rating");
            set({ 
                averageRating: res.data.averageRating,
                totalRatings: res.data.totalRatings 
            });
            return { success: true };
        } catch (error) {
            console.error("Error fetching average rating:", error);
            return {
                success: false,
                error: error.response?.data?.message || "An error occurred fetching rating"
            };
        }
    }
}))