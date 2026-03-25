import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import {useAuth} from "./AuthContext";
import {
    createTreatmentCategory as apiCreateTreatmentCategory,
    createTreatment as apiCreateTreatment,
    deleteTreatmentCategory as apiDeleteTreatmentCategory,
    deleteTreatment as apiDeleteTreatment,
    getAllTreatments as apiGetAllTreatments,
    getTreatmentCategories as apiGetTreatmentCategories,
    updateTreatmentCategory as apiUpdateTreatmentCategory,
    updateTreatment as apiUpdateTreatment,
    type Treatment,
    type TreatmentCategory,
} from "@/api/Treatment";

type TreatmentContextValue = {
    treatments: Treatment[];
    categories: TreatmentCategory[];
    createCategory: (payload: {title: string; description?: string | null}) => Promise<TreatmentCategory>;
    updateCategory: (id: number, payload: {title?: string; description?: string | null}) => Promise<TreatmentCategory>;
    deleteCategory: (id: number) => Promise<void>;
    createTreatment: (payload: {category_id: number; name: string; price: number}) => Promise<Treatment>;
    updateTreatment: (id: number, payload: {category_id?: number; name?: string; price?: number}) => Promise<Treatment>;
    deleteTreatment: (id: number) => Promise<void>;
};

const TreatmentContext = createContext<TreatmentContextValue | undefined>(undefined);

export function TreatmentProvider({children}: PropsWithChildren) {
    const {loggedIn} = useAuth();
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [categories, setCategories] = useState<TreatmentCategory[]>([]);

    useEffect(() => {
        void fetchTreatments();
        void fetchCategories();
    }, [loggedIn]);

    async function fetchTreatments() {
        if (!loggedIn) {
            setTreatments([]);
            return;
        }

        try {
            const response = await apiGetAllTreatments();
            setTreatments(response.data.treatments ?? []);
        } catch {
            setTreatments([]);
        }
    }

    async function fetchCategories() {
        if (!loggedIn) {
            setCategories([]);
            return;
        }

        try {
            const response = await apiGetTreatmentCategories();
            setCategories(response.data.categories ?? []);
        } catch {
            setCategories([]);
        }
    }

    async function createTreatment(payload: {category_id: number; name: string; price: number}) {
        const response = await apiCreateTreatment(payload);
        const created = response.data.treatment;
        setTreatments((prev) => [created, ...prev]);
        return created;
    }

    async function createCategory(payload: {title: string; description?: string | null}) {
        const response = await apiCreateTreatmentCategory(payload);
        const created = response.data.category;
        setCategories((prev) => [created, ...prev]);
        return created;
    }

    async function updateCategory(id: number, payload: {title?: string; description?: string | null}) {
        const response = await apiUpdateTreatmentCategory(id, payload);
        const updated = response.data.category;
        setCategories((prev) => prev.map((category) => (category.id === id ? updated : category)));
        return updated;
    }

    async function deleteCategory(id: number) {
        await apiDeleteTreatmentCategory(id);
        setCategories((prev) => prev.filter((category) => category.id !== id));
    }

    async function updateTreatment(id: number, payload: {category_id?: number; name?: string; price?: number}) {
        const response = await apiUpdateTreatment(id, payload);
        const updated = response.data.treatment;
        setTreatments((prev) => prev.map((treatment) => (treatment.id === id ? updated : treatment)));
        return updated;
    }

    async function deleteTreatment(id: number) {
        await apiDeleteTreatment(id);
        setTreatments((prev) => prev.filter((treatment) => treatment.id !== id));
    }

    return (
        <TreatmentContext.Provider
            value={{
                treatments,
                categories,
                createCategory,
                updateCategory,
                deleteCategory,
                createTreatment,
                updateTreatment,
                deleteTreatment,
            }}
        >
            {children}
        </TreatmentContext.Provider>
    );
}

export function useTreatment() {
    const context = useContext(TreatmentContext);
    if (!context) {
        throw new Error('useTreatment must be used within TreatmentProvider');
    }
    return context;
}
