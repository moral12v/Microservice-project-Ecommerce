import { createSubscriptionDTO, UpdateSubscriptionDTO } from "../dtos/subscriptionDTO";
import { SubscriptionDoc } from "../models/Subscrition";
import { subscriptionRepository } from "../repositories/subscriptionRepository";

class SubscriptionService {
  async createSubscription(data: createSubscriptionDTO): Promise<SubscriptionDoc> {
    return await subscriptionRepository.createSubscription(data);
  }

  async getAllSubscriptions(): Promise<SubscriptionDoc[]> {
    return await subscriptionRepository.getAllSubscriptions();
  }

  async getSubscriptionById(subscriptionId: string): Promise<SubscriptionDoc | null> {
    return await subscriptionRepository.getSubscriptionById(subscriptionId);
  }

  async updateSubscription(subscriptionId: string,updateData: Partial<SubscriptionDoc>): Promise<SubscriptionDoc | null> {
    return await subscriptionRepository.updateSubscription(subscriptionId, updateData);
  }

  async deleteSubscription(subscriptionId: string): Promise<SubscriptionDoc | null> {
    return await subscriptionRepository.deleteSubscription(subscriptionId);
  }
}

export const subscriptionService = new SubscriptionService();
