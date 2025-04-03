import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function jsonData(res: Response): any {
  if (!res.ok) {
    return Promise.reject(`status code: ${res.status}`)
  }
  return res.json().then((res) => {
    if (res.code !== 0) {
      return Promise.reject(res)
    }
    return res.data
  })
}

export function blobData(res: Response): any {
  if (!res.ok) {
    return Promise.reject(`status code: ${res.status}`)
  }
  return res.blob()
}
