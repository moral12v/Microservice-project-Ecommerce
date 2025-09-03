import { AddToCartDTO, UpdateCartItemDTO } from "../dtos/cartDTO";
import { cartRepository } from "../repositories/cartRepository";

class CartService {
  async getCartByCustomerId(customerId: string) {
    return await cartRepository.findByCustomerId(customerId);
  }
  async getCartByCustomerIdV2(customerId: string) {
    return await cartRepository.findByCustomerIdV2(customerId);
  }
  async getCartId(id: any) {
    return await cartRepository.findById(id);
  }

  async getCartByCustomerIdAndMerchantId(customerId: string, merchantId:string) {
    return await cartRepository.findByCustomerIdAndMerchantId(customerId, merchantId);
  }

  async createCart(customerId: string, merchantId:string, deliveryType:string) {
    let cart = await cartRepository.findByCustomerId(customerId);
    if (!cart?.cart) {
      cart = await cartRepository.createCart(customerId,merchantId,deliveryType);
    }
    return cart;
  }

  async addItemToCart(customerId: string, item: AddToCartDTO) {
    return await cartRepository.addItemToCart(customerId, item);
  }

  async updateCartItem(customerId: string, item: UpdateCartItemDTO) {
    return await cartRepository.updateCartItem(customerId, item);
  }

  async removeItemFromCart(customerId: string, productId: string, addons:any,variantId:any ) {
    return await cartRepository.removeItemFromCart(customerId,productId,variantId,addons );
  }

  async clearCart(customerId: string) {
    return await cartRepository.clearCart(customerId);
  }
  async deleteCartByUserId(customerId: string): Promise<any> {
    return await cartRepository.deleteCartByUserId(customerId);
  }
}

export const cartService = new CartService();
