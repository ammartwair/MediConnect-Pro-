import axios from "axios";
import { createContext } from "react";

export const CartContext = createContext(null);

export function CartContextProvider({ children }) {

    async function addToCart(productId) {
        try {
            const token = localStorage.getItem('userToken');
            let objData = {
                productId: productId
            }
            const { data } = await axios.post(`https://king-prawn-app-3mgea.ondigitalocean.app/cart/add`, objData,
                { headers: { authorization: `Tariq__${token}` } });
            return data;
        }
        catch (e) {
            console.log(e);
        }
    }
    async function getCart() {
        try {
            const token = localStorage.getItem('userToken');
            let { data } = await axios.get(`https://king-prawn-app-3mgea.ondigitalocean.app/cart`, { headers: { authorization: `Tariq__${token}` } });
            return data;
        } catch (e) {
            console.log(e);
        }
    }
    async function updateCount(quantity, productId){
        try{
            const token = localStorage.getItem('userToken');
            let {objData} = {
                quantity:quantity
            }
            const {data} = await axios.put(`https://king-prawn-app-3mgea.ondigitalocean.app/cart/${productId}`, objData ,{headers: {authorization:`Taariq__${token}`}});
            return data;
        }catch(e){
            console.log(e);
        }
    }
    async function deleteCart(productId){
        try{
            const token = localStorage.getItem('userToken');
            const {data} = await axios.delete(`https://king-prawn-app-3mgea.ondigitalocean.app/cart/${productId}` ,{headers: {authorization:`Taariq__${token}`}});
            return data;
        }catch(e){
            console.log(e);
        }
    }

    return <CartContext.Provider value={{ addToCart, getCart , updateCount }}>
        {children}
    </CartContext.Provider>
}