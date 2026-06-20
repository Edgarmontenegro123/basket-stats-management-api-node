export interface Game {
    id: string;
    season_id: string;
    home_team_id: string;
    away_team_id: string;
    game_date: string;
    location: string;
    video_url: string | null;
    is_friendly: boolean;
    home_score: number;
    away_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}