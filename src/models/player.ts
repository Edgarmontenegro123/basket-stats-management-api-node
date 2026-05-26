export interface Player {
    id: string
    team_id: string
    first_name: string
    last_name: string
    number: number
    position?: string | null
    height_cm?: number | null
    weight_kg?: number | null
    birth_date?: string | null
    photo_url?: string | null
    created_at?: string
    updated_at?: string
}

export interface CreatePlayerInput {
    team_id: string
    first_name: string
    last_name: string
    number: number
    position?: string
    height_cm?: number
    weight_kg?: number
    birth_date?: string
    photo_url?: string
}