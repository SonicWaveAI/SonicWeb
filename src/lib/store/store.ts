import { atom } from "nanostores"
import { persistentAtom } from "@nanostores/persistent"

export const $models = atom<string[]>([])

export const $customModel = persistentAtom<string>("customModel", "")
