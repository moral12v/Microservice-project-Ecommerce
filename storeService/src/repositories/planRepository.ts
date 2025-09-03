import Plan, { PlanDoc } from "../models/plan";

class PlanRepository {
  async createPlan(data: Partial<PlanDoc>): Promise<PlanDoc> {
    const plan = new Plan(data);
    return await plan.save();
  }

  async updatePlan(planId: string, updateData: Partial<PlanDoc>): Promise<PlanDoc | null> {
    return await Plan.findByIdAndUpdate(planId, updateData, { new: true }).exec();
  }

  async deletePlan(planId: string): Promise<PlanDoc | null> {
    return await Plan.findByIdAndDelete(planId).exec();
  }

  async getAllPlans(): Promise<PlanDoc[]> {
    return await Plan.find().exec();
  }

  async getPlanById(planId: string): Promise<PlanDoc | null> {
    return await Plan.findById(planId).exec();
  }
}

export const planRepository = new PlanRepository();
