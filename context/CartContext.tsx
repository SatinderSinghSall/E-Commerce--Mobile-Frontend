import { dummyCart, dummyWishlist } from "@/assets/assets";
import { Product, WishlistContextType } from "@/assets/constants/types";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartItem = {
  id: String;
  productId: String;
  product: Product;
  quantity: number;
  size: String;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size: String) => Promise<void>;
  removeFromCart: (itemId: String, size: String) => Promise<void>;
  updateQuantity: (
    itemId: String,
    quantity: number,
    size: String,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = async () => {
    setIsLoading(true);
    const serverCart = dummyCart;
    const mappedItems: CartItem[] = serverCart.items.map((item: any) => ({
      id: item.product._id,
      productId: item.product._id,
      product: item.product,
      quantity: item.quantity,
      size: item?.size || "M",
      price: item.price,
    }));
    setCartItems(mappedItems);
    setCartTotal(serverCart.totalAmount);
    setIsLoading(false);
  };

  const addToCart = async (product: Product, size: String) => {};

  const removeFromCart = async (productId: String, size: String) => {};

  const updateQuantity = async (
    productId: String,
    quantity: number,
    size: String = "M",
  ) => {};

  const clearCart = async () => {};

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, []);

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

  if (context == undefined) {
    throw new Error("useCart must be used within a CartProvider");
    return context;
  }
}
