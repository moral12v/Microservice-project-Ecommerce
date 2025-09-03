import Admin, { AdminDoc } from '../models/Admin';

export default class AdminRepository {
  async createAdmin(adminData: Partial<AdminDoc>): Promise<AdminDoc> {
    const admin = new Admin(adminData);
    return await admin.save();
  }

  async getAdminById(adminId: string): Promise<AdminDoc | null> {
    return await Admin.findById(adminId).exec();
  }

  async updateAdmin(adminId: string, updateData: Partial<AdminDoc>): Promise<AdminDoc | null> {
    return await Admin.findByIdAndUpdate(adminId, updateData, { new: true }).exec();
  }

  async deleteAdmin(adminId: string): Promise<AdminDoc | null> {
    return await Admin.findByIdAndDelete(adminId).exec();
  }

  async findByUsername(username: string): Promise<AdminDoc | null> {
    return await Admin.findOne({ username }).exec();
  }

  async getAllAdmins(): Promise<AdminDoc[]> {
    return await Admin.find({}).exec();
  }

  async findByEmail(email: string): Promise<AdminDoc | null> {
    return await Admin.findOne({ email }).exec();
  }

  async createAdminLogout(adminId: string): Promise<AdminDoc | null> {
    return await Admin.findByIdAndUpdate(
      adminId,
      {
        $set: {
          isLogout: true,
        },
      },
      { new: true },
    ).exec();
  }
}

export const adminRepository = new AdminRepository();
