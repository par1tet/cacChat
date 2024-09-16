import { rootStoreContext } from "../../app/routes/App";
import { useContext } from "react";

export function useStore() {
    return useContext(rootStoreContext)
}