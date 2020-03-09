export interface Movie {
  userId: string
  id: string
  createdAt: string
  name: string
  directorName: string
  summary: string
  type: string
  url?: string
  isWatched: boolean
}
