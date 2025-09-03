import { Types } from "mongoose";
import { Cart } from "../models/Cart";
import { cartRepository } from "../repositories/cartRepository";
import haversine from "haversine-distance";
import { getDeliveryDetailsById } from "../gRPC/controller/deliveryType";
import { Span, trace } from "@opentelemetry/api";
import coupons from "../models/coupons";

interface MerchantDetailsResponse {
  _id: string;
  name: string;
  deliveryTypes: [];
  scheduledOrder: any;
  packagingCharge: number;
}

class CheckoutService {
  async calculateTotals(
    customerId: string,
    cartProducts: any[],
    merchantName: string,
    merchantId: string,
    deliveryTypes: any[],
    scheduledOrder: any,
    cartId: string,
    merchantPackagingCharge: number,
    couponCode: string,
    selectedDeliveryType: any
  ): Promise<{
    products: any[];
    subTotal: number;
    gstCost: number;
    grandTotal: number;
    actualPrice: number;
    productPrice: number;
    deliveryCharge: number;
    totalAmount: number;
    savedAmount: number;
    discount: number;
    packagingCharge: number;
    platformFee: number;
    merchantName: string;
    merchantId: string;
    deliveryTypes: any[];
    scheduledOrder: any;
    cartId: string;
    couponIsValid: boolean;
    couponDetails: any;
    selectedDeliveryType: any;
  }> {
    let subTotal = 0;
    let gstCost = 0;
    let grandTotal = 0;
    let actualPrice = 0;
    let productPrice = 0;
    let deliveryCharge = 0;
    let totalAmount = 0;
    let savedAmount = 0;
    let discount = 0;
    let packagingCharge = 0;
    let platformFee = 0;
    let totalWeight = 0;
    const maxWeight = 10;
    const products = [];
    let couponIsValid = false;
    let couponDetails = null;
  
    for (const cartProduct of cartProducts) {
      const product = cartProduct.product;
      if (product) {
        const quantity = Number(cartProduct.quantity);
        const productGst = (Number(product.gst) / 100) * Number(product.sellingPrice) * quantity;
        const totalProductPrice = Number(product.sellingPrice) * quantity;
        const totalActualPrice = Number(product.actualPrice) * quantity;
        gstCost += productGst;
        subTotal += totalProductPrice;
        actualPrice += totalActualPrice;
        productPrice += totalProductPrice;
        packagingCharge += Number(product.packingCharge) * quantity;
        totalWeight += Number(product.weight) * quantity;
        if (totalWeight > maxWeight) {
          throw new Error(`Total weight of products exceeds the maximum allowed weight of ${maxWeight} kg.`);
        }
        let addonCost = 0;
        if (cartProduct.addons && Array.isArray(cartProduct.addons)) {
          for (const addon of cartProduct.addons) {
            if (addon.choices && Array.isArray(addon.choices)) {
              for (const choice of addon.choices) {
                addonCost += Number(choice.sellingPrice) * quantity;
                gstCost += (Number(choice.gst) / 100) * Number(choice.sellingPrice) * quantity;
              }
            }
          }
        }
  
        subTotal += addonCost;
        productPrice += addonCost;
        products.push({
          productId: product?._id,
          name: product.productTitle,
          imgUrl: product?.productImageUrl,
          price: product.sellingPrice,
          actualPrice: product.actualPrice,
          cartQuantity: quantity,
          weight: product.weight,
          packagingCharge: product.packingCharge,
          addOns: cartProduct.addons
            ? cartProduct.addons.map((addon: any) => ({
                groupName: addon.group?.groupName || "Unknown Group",
                choices: addon.choices
                  ? addon.choices.map((choice: any) => ({
                      choiceName: choice.productTitle,
                      choicePrice: choice.sellingPrice,
                    }))
                  : [],
              }))
            : [],
        });
      } else {
        console.error(`Product data missing for cartProduct: ${cartProduct}`);
      }
    }
    if (couponCode) {
      couponDetails = await coupons.findOne({ code: couponCode, isActive: true }).exec();
      if (couponDetails) {
        const now = new Date();
        const isCouponValid = now <= new Date(couponDetails.expireDate);
        if (isCouponValid) {
          couponIsValid = true;
          if (couponDetails.type === "percentage") {
            discount = (subTotal * couponDetails.discount) / 100;
            discount = Math.min(discount, couponDetails.maxDiscount || discount);
          } else if (couponDetails.type === "flat") {
            discount = couponDetails.discount;
          }
        } else {
          throw new Error("Coupon has expired.");
        }
      } else {
        throw new Error("Invalid coupon code.");
      }
    }
    subTotal -= discount;
    totalAmount = subTotal + deliveryCharge + gstCost + packagingCharge + merchantPackagingCharge;
    savedAmount = actualPrice - productPrice + discount;
    grandTotal = totalAmount;
    return {
      products,
      subTotal,
      gstCost: parseFloat(gstCost.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      actualPrice,
      productPrice,
      deliveryCharge,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      savedAmount,
      discount,
      packagingCharge,
      platformFee,
      merchantName,
      merchantId,
      deliveryTypes: deliveryTypes || [],
      scheduledOrder,
      cartId,
      couponIsValid,
      couponDetails,
      selectedDeliveryType,
    };
  }
  

  async checkout(
    customerId: string,
    cartId: string,
    deliveryType: string,
    couponCode: string,
    addressId: any,
    merchantDetails: any
  ) {
    try {
      const cartProducts: any = await Cart.aggregate([
        {
          $match: {
            customerId: new Types.ObjectId(customerId) || customerId,
            _id: new Types.ObjectId(cartId) || cartId,
          },
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "merchantproducts",
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $lookup: {
            from: "addonmetadatas",
            localField: "items.addons.groupId",
            foreignField: "_id",
            as: "groupDetails",
          },
        },
        {
          $lookup: {
            from: "merchantproducts",
            localField: "items.addons.choiceId",
            foreignField: "_id",
            as: "choiceDetails",
          },
        },
        {
          $lookup: {
            from: "addonmetadatas",
            localField: "productDetails.addOns",
            foreignField: "_id",
            as: "addOnDetails",
          },
        },
        {
          $group: {
            _id: "$_id",
            customerId: { $first: "$customerId" },
            merchantId: { $first: "$merchantId" },
            deliveryType: { $first: "$deliveryType" },
            items: {
              $push: {
                product: {
                  $mergeObjects: [
                    "$productDetails",
                    { addOns: "$addOnDetails" },
                  ],
                },
                quantity: "$items.quantity",
                addons: {
                  $map: {
                    input: {
                      $cond: {
                        if: { $isArray: "$items.addons" },
                        then: "$items.addons",
                        else: [],
                      },
                    },
                    as: "addon",
                    in: {
                      group: { $arrayElemAt: ["$groupDetails", 0] },
                      choices: { $ifNull: ["$choiceDetails", []] },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            customerId: 1,
            merchantId: 1,
            items: 1,
            deliveryType: 1,
          },
        },
      ]);
      if (!cartProducts || cartProducts.length === 0) {
        throw new Error("Cart is empty or does not exist.");
      }

      const cartProductsItems: any[] = cartProducts.flatMap(
        (cart: any) => cart.items
      );

      const merchantLocation = { latitude: 37.8136, longitude: 144.9631 };
      const customerLocation = { latitude: 37.815, longitude: 144.97 };
      const distance = haversine(merchantLocation, customerLocation);
      const distanceInKm = distance / 1000;

      if (
        deliveryType === "66c990a073f5fa2901f02101" ||
        deliveryType === "SELLER DELIVERY"
      ) {
      } else if (
        deliveryType === "6708d03385bac234936a09ac" ||
        deliveryType === "CLOSETOBUY DELIVERY"
      ) {
        // Handle CloseToBuy delivery logic
      }

      let deliveryTypes: any[] = [];

      // if (Array.isArray(merchantDetails?.deliveryTypes)) {
      // await Promise.all(
      // merchantDetails.deliveryTypes.map(async (item: any) => {

      const tracer = trace.getTracer("inventory-service");
      const span: Span = tracer.startSpan("handleCheckoutService");
      const dt = await getDeliveryDetailsById("6708d03385bac234936a09ac", span);

      if (dt && dt.deliveryData) {
        deliveryTypes.push(dt.deliveryData);
      }
      // })
      // );
      // } else {
      //   deliveryTypes = [];
      // }
      const selectedDeliveryType = await getDeliveryDetailsById(
        cartProducts[0].deliveryType,
        span
      );
      const totals = await this.calculateTotals(
        customerId,
        cartProductsItems,
        merchantDetails?.name || "Unknown Merchant",
        merchantDetails?._id || "Unknown Merchant Id",
        deliveryTypes,
        merchantDetails?.scheduledOrder || false,
        cartId,
        merchantDetails?.packagingCharge || 0,
        couponCode,
        selectedDeliveryType?.deliveryData
      );
      return {
        totals,
      };
    } catch (error: any) {
      if (
        error.message.includes(
          "Total weight of products exceeds the maximum allowed weight"
        )
      ) {
        return {
          success: false,
          message: error.message,
        };
      }
      console.error(`Checkout error: ${error.message}`);
      throw error;
    }
  }
}

export default new CheckoutService();
