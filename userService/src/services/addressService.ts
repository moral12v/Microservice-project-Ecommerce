import { AddressDoc } from '../models/addressModel';
import { addressRepository } from '../repositories/addressRepository';
import { CreateAddressDTO, UpdateAddressDTO } from '../dtos/addressDTO';

export const createAddress = async (addressDto: CreateAddressDTO): Promise<AddressDoc> => {
  return await addressRepository.createAddress(addressDto);
};

export const getAllAddress = async (): Promise<AddressDoc[]> => {
  return await addressRepository.getAllAddresses();
};

export const getAddressById = async (addressId: string): Promise<AddressDoc | null> => {
  return await addressRepository.getAddressById(addressId);
};

export const updateAddress = async (addressId: string, addressDto: UpdateAddressDTO): Promise<AddressDoc | null> => {
  return await addressRepository.updateAddress(addressId, addressDto);
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  await addressRepository.deleteAddress(addressId);
};

export const getAddressesByCustomerId = async (customerId: string): Promise<AddressDoc[]> => {
  return await addressRepository.getAddressesByCustomerId(customerId);
};
