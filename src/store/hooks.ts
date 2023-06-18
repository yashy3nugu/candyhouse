import { useDispatch } from "react-redux";
import type { AppDispatch } from ".";

export const useAppDispatch = () => useDispatch<AppDispatch>();
