
import { where } from "firebase/firestore";
import { collections, getDocuments } from "src/fire-base/db";
import { generatePincode } from "src/utils/util";

export const createPincode = async () => {
  while (true) {
    const pincode = generatePincode()

    const groups = await getDocuments({
      collection: collections.groups,
      constraints: [where("pincode", "==", pincode)]
    })

    if (groups?.length === 0) return pincode
  }
};
