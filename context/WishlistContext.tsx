import { Product, WishlistContextType } from "@/assets/constants/types";
import api from "@/assets/constants/api";
import { useAuth } from "@clerk/clerk-expo";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // FETCH WISHLIST
  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await api.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.log("Wishlist Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // TOGGLE WISHLIST
  const toggleWishlist = async (product: Product) => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        "/wishlist/toggle",
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        fetchWishlist();
      }
    } catch (error) {
      console.log("Toggle Wishlist Error:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
