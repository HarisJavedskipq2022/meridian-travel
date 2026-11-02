/** Builds an Unsplash CDN URL. next/image appends its own width/quality, so only crop hints go here. */
export function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop`;
}

export const photos = {
  planeWing: "1436491865332-7a61a109cc05",
  documents: "1554224155-6726b3ff858f",
  hotelPool: "1566073771259-6a8506099945",
  resortPalms: "1520250497591-112f2f40a3f4",
  hotelNight: "1542314831-068cd1dbfeeb",
  waterVillas: "1514282401047-d79a71a590e8",
  hotelDining: "1555396273-367ea4eb4db5",
  driving: "1449965408869-eaa3f722e40d",
  friends: "1539635278303-d4002c07eae3",
} as const;
