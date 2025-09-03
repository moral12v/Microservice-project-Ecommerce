import Customer, { CustomerDoc } from '../models/Customer';

export class CustomerRepository {
  async createCustomer(CustomerData: Partial<CustomerDoc>): Promise<CustomerDoc> {
    const customer = new Customer(CustomerData);
    return await customer.save();
  }

  async getCustomerById(customerId: string): Promise<CustomerDoc | null> {
    return await Customer.findById(customerId).exec();
  }

  async updateCustomer(customerId: string, updateData: Partial<CustomerDoc>): Promise<CustomerDoc | null> {
    return await Customer.findByIdAndUpdate(customerId, updateData, { new: true }).exec();
  }

  async deleteAccount(customerId: string): Promise<boolean> {
    const customer = await Customer.findByIdAndUpdate(customerId, {
      isdeleted: true,
    });
    return !!customer;
  }

  async getAllCustomer(
    page: number, 
    limit: number, 
    isPagination: string
  ): Promise<{ customers: CustomerDoc[], total: number }> {
    const skip = (page - 1) * limit;
  
    const query = Customer.find({});
  
    if (isPagination === "true") {
      query.skip(skip).limit(limit);
    }
  
    const customers = await query.exec();
    const total = await Customer.countDocuments();
  
    return { customers, total };
  }
  

  async findByMobile(mobile: string): Promise<CustomerDoc | null> {
    return await Customer.findOne({ mobile, isdeleted:false }).exec();
  }

  async updatePassword(customerId: string, hashedPassword: string): Promise<CustomerDoc | null> {
    return await Customer.findByIdAndUpdate(
      customerId,
      {
        password: hashedPassword,
      },
      { new: true },
    ).exec();
  }
  async updateDeviceId(userId: string, deviceId: string): Promise<CustomerDoc | null> {
    return Customer.findByIdAndUpdate(userId, { deviceToken: deviceId }).exec();
  }


  async getDeviceByCustomerId(customerId: string): Promise<CustomerDoc | null> {
    return await Customer.findById(customerId).exec();
  }
}
export const customerRepository = new CustomerRepository();
