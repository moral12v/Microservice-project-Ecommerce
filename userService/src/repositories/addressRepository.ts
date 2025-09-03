import Address, { AddressDoc } from '../models/addressModel';

export default class AddressRepository {
  async createAddress(addressData: Partial<AddressDoc>): Promise<AddressDoc> {
    const address = new Address(addressData);
    return await address.save();
  }

  async getAddressById(addressId: string): Promise<AddressDoc | null> {
    return await Address.findById(addressId).exec();
  }

  async updateAddress(addressId: string, updateData: Partial<AddressDoc>): Promise<AddressDoc | null> {
    return await Address.findByIdAndUpdate(addressId, updateData, { new: true }).exec();
  }

  async deleteAddress(addressId: string): Promise<AddressDoc | null> {
    return await Address.findByIdAndDelete(addressId).exec();
  }

  async getAllAddresses(): Promise<AddressDoc[]> {
    return await Address.find().exec();
  }

  async getAddressesByCustomerId(customerId: string): Promise<AddressDoc[]> {
    return await Address.find({
      customerId: customerId,
    });
  }
}

export const addressRepository = new AddressRepository();
