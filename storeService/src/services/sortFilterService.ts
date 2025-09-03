export const applyFilters = (stores: any[], filters: any) => {
  return stores.filter((store) => {
    for (const key in filters) {
      const filterValues = filters[key];
      if (
        filterValues &&
        filterValues.length &&
        !filterValues.includes(store[key])
      ) {
        return false;
      }
    }
    return true;
  });
};

export const applySorting = (stores: any[], sorts: any | null) => {
  if (!sorts || sorts.length === 0) return stores;
  return stores.sort((a, b) => {
    for (const sort of sorts) {
      const [sortKey, sortOrder] = sort.split("_");
      const order = sortOrder === "asc" ? 1 : -1;

      if (sortKey === "distance") {
        const distanceComparison = (a.distance - b.distance) * order;
        if (distanceComparison !== 0) return distanceComparison;
      } else if (sortKey === "estimatedDeliveryTime") {
        const aTime = parseInt(a.estimatedDeliveryTime.split("-")[0]);
        const bTime = parseInt(b.estimatedDeliveryTime.split("-")[0]);
        const deliveryTimeComparison = (aTime - bTime) * order;
        if (deliveryTimeComparison !== 0) return deliveryTimeComparison;
      } else {
        if (a[sortKey] < b[sortKey]) return -order;
        if (a[sortKey] > b[sortKey]) return order;
      }
    }
    return 0;
  });
};
