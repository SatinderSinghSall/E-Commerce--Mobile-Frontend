import { Product } from "@/assets/constants/types";
import api from "@/assets/constants/api";
import { useAuth } from "@clerk/clerk-expo";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (productId: string, size: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    size: string,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const requireAuth = () => {
    if (!isSignedIn) {
      Toast.show({
        type: "info",
        text1: "Login Required",
        text2: "Please sign in to use the cart",
      });
      return false;
    }
    return true;
  };

  // FETCH CART
  const fetchCart = async () => {
    try {
      setIsLoading(true);

      const token = await getToken();

      const { data } = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        const mappedItems: CartItem[] = data.data.items.map((item: any) => ({
          id: `${item.product._id}-${item.size}`,
          productId: item.product._id,
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        }));

        setCartItems(mappedItems);
        setCartTotal(data.data.totalAmount);
      }
    } catch (error) {
      console.log("Fetch Cart Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ADD TO CART
  const addToCart = async (product: Product, size: string) => {
    if (!requireAuth()) return;

    try {
      const token = await getToken();

      const { data } = await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: 1,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        fetchCart();

        Toast.show({
          type: "success",
          text1: "Added to Cart",
          text2: `${product.name} added successfully`,
        });
      }
    } catch (error) {
      console.log("Add To Cart Error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to add item to cart",
      });
    }
  };

  // REMOVE FROM CART
  const removeFromCart = async (productId: string, size: string) => {
    if (!requireAuth()) return;

    try {
      const token = await getToken();

      const { data } = await api.delete(
        `/cart/item/${productId}?size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        fetchCart();

        Toast.show({
          type: "success",
          text1: "Removed",
          text2: "Item removed from cart",
        });
      }
    } catch (error) {
      console.log("Remove Cart Error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to remove item from cart",
      });
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (
    productId: string,
    quantity: number,
    size: string,
  ) => {
    if (!requireAuth()) return;

    try {
      const token = await getToken();

      const { data } = await api.put(
        `/cart/item/${productId}`,
        { quantity, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        fetchCart();
      }
    } catch (error) {
      console.log("Update Cart Error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to update item from cart",
      });
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    if (!requireAuth()) return;

    try {
      const token = await getToken();

      const { data } = await api.delete("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCartItems([]);
        setCartTotal(0);

        Toast.show({
          type: "success",
          text1: "Cart Cleared",
          text2: "All items removed from cart",
        });
      }
    } catch (error) {
      console.log("Clear Cart Error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to clear cart",
      });
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [isSignedIn]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
