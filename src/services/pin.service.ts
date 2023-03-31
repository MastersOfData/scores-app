import {
  getDocument,
  groupsCol,
  pincodesDocumentId,
  setDocument,
} from "src/fire-base/db";
import { generatePincode } from "src/utils/util";

type PincodeDocumentData = {
  pincodes: string[];
};

const getPincodes = async () => {
  return await getDocument<PincodeDocumentData>(groupsCol, pincodesDocumentId);
};

export const createPincode = async () => {
  const pincodes = (await getPincodes())?.pincodes;

  let pincode: string;

  do {
    pincode = generatePincode();
  } while (pincodes && pincodes.includes(pincode));

  await setDocument<PincodeDocumentData>(groupsCol, pincodesDocumentId, {
    pincodes: [...(pincodes ?? []), pincode],
  });

  return pincode;
};
