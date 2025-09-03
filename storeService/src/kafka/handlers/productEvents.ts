import Store, { StoreDoc } from '../../models/Store';

export const handleProductCreateEvent = async (messageValue: any) => {
  try {
    const parsedResponse = typeof messageValue === 'string' ? JSON.parse(messageValue) : messageValue;
    const { subCategory, merchantId } = parsedResponse;
    const storeId = merchantId;

    if (!subCategory || !storeId) {
      console.error('subCategory and storeId are required');
      return;
    }

    const { _id: subCategoryId } = subCategory;
    const store = await Store.findById(storeId).exec();

    if (!store) {
      console.error(`Store not found for storeId: ${storeId}`);
      return;
    }
    
    const existingSubCategory = store.subCategory.find((subCat: any) => subCat._id.toString() === subCategoryId);
    if (existingSubCategory) {
      existingSubCategory.count = (Number(existingSubCategory.count) || 0) + 1;
      console.log(`Incremented count for existing subCategoryId: ${subCategoryId}`);
    } else {
      store.subCategory.push({
        _id: subCategoryId,
        count: 1,
        ...subCategory,
      });
      console.log(`Added new subCategoryId: ${subCategoryId}`);
    }

    await store.save();
    console.log(`Updated store with ID: ${storeId}, subCategoryId: ${subCategoryId}`);
  } catch (error: any) {
    console.error(`Error processing product create event: ${error.message}`);
  }
};
