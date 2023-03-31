import { useContext } from "react";
import { userContext } from "src/app/providers";

export const useUser = () => useContext(userContext)