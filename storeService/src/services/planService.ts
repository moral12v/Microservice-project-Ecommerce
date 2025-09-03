import { CreatePlanDTO, UpdatePlanDTO } from "../dtos/planDTO"; 
import { PlanDoc } from "../models/plan";
import { planRepository } from "../repositories/planRepository";

class PlanService {
  async createPlan(data: CreatePlanDTO): Promise<PlanDoc> {
    return await planRepository.createPlan(data);
  }
  async getAllPlans(): Promise<PlanDoc[]> {
    return await planRepository.getAllPlans();
  }

  async getPlanById(planId: string): Promise<PlanDoc | null> {
    return await planRepository.getPlanById(planId);
  }

  async updatePlan(planId: string, updateData: UpdatePlanDTO): Promise<PlanDoc | null> {
    return await planRepository.updatePlan(planId, updateData);
  }

  async deletePlan(planId: string): Promise<PlanDoc | null> {
    return await planRepository.deletePlan(planId);
  }
}

export const planService = new PlanService();
