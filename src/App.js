import "./App.scss";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import DrinkPage from "./pages/DrinkPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/ProfilePage";
import RequireAuth from "./components/RequireAuth";
import Products from "./e-commerce/products/Products";
import { useShopContext } from "./contexts/ShopContext";
import ProductPage from "./e-commerce/ProductPage";
import Cart from "./e-commerce/Cart/Cart";
import Checkout from "./e-commerce/CheckoutForm/Checkout/Checkout";
import OrderPage from "./pages/OrderPage";
import SearchPage from "./pages/SearchPage";
import { Toaster } from "react-hot-toast";
import EditDrinkPage from "./pages/EditDrinkPage";
import ResetPassword from "./components/ResetPassword";

function App() {
    const {
        products,
        handleAddToCart,
        order,
        setOrder,
        handleDrawerToggle,
        refreshCart,
        cart,
        handleUpdateCartQty,
        handleRemoveFromCart,
        handleEmptyCart,
        handleCaptureCheckout,
        errorMessage,
    } = useShopContext();
    return (
        <BrowserRouter>
            <div className="App">
           
                <Toaster
               containerStyle={{
                top: '100px',
              }}
                />
              
                <Navigation
                    totalItems={cart.total_items}
                    handleDrawerToggle={handleDrawerToggle}
                />
                <Routes>
                    {/* Guest routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/kategorier" element={<CategoriesPage />} />
                    <Route path="/drink/:id" element={<DrinkPage />} />
                    <Route path="/redigera/:id" element={<EditDrinkPage />} />
                    <Route
                        path="/kategory/:category"
                        element={<CategoryPage />}
                    />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />

                    {/* Protected routes */}
                    <Route
                        path="/profil/:uid"
                        element={
                            <RequireAuth redirectTo="/login">
                                <ProfilePage />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/profil/orderhistorik"
                        element={
                            <RequireAuth redirectTo="/login">
                                <OrderPage />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/produkter"
                        element={
                            <RequireAuth redirectTo="/login">
                                <Products
                                    products={products}
                                    onAddToCart={handleAddToCart}
                                    handleUpdateCartQty
                                />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/cart"
                        element={
                            <RequireAuth redirectTo="/login">
                                <Cart
                                    cart={cart}
                                    onUpdateCartQty={handleUpdateCartQty}
                                    onRemoveFromCart={handleRemoveFromCart}
                                    onEmptyCart={handleEmptyCart}
                                    order={order}
                                    setOrder={setOrder}
                                />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path="/checkout"
                        element={
                            <RequireAuth redirectTo="/login">
                                <Checkout
                                    error={errorMessage}
                                    cart={cart}
                                    onUpdateCartQty={handleUpdateCartQty}
                                    onRemoveFromCart={handleRemoveFromCart}
                                    onEmptyCart={handleEmptyCart}
                                    order={order}
                                    setOrder={setOrder}
                                    onCaptureCheckout={handleCaptureCheckout}
                                    refreshCart={refreshCart}
                                />
                            </RequireAuth>
                        }
                    ></Route>

                    <Route
                        path="/produkt/:id"
                        element={
                            <RequireAuth redirectTo="/login">
                                <ProductPage onAddToCart={handleAddToCart} />
                            </RequireAuth>
                        }
                    />

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
