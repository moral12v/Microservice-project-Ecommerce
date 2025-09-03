import Subscription, { SubscriptionDoc } from "../models/Subscrition";

class SubscriptionRepository {
  async createSubscription(data: Partial<SubscriptionDoc>): Promise<SubscriptionDoc> {
    const subscription = new Subscription(data);
    return await subscription.save();
  }

  async updateSubscription(subscriptionId: string, updateData: Partial<SubscriptionDoc>): Promise<SubscriptionDoc | null> {
    return await Subscription.findByIdAndUpdate(subscriptionId, updateData, { new: true }).exec();
  }
  

  async deleteSubscription(subscriptionId: string): Promise<SubscriptionDoc | null> {
    return await Subscription.findByIdAndDelete(subscriptionId).exec();
  }

  async getAllSubscriptions(): Promise<SubscriptionDoc[]> {
    return await Subscription.find().exec();
  }

  async getSubscriptionById(subscriptionId: string): Promise<SubscriptionDoc | null> {
    return await Subscription.findById(subscriptionId).exec();
  }
}

export const subscriptionRepository = new SubscriptionRepository();
