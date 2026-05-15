CREATE TABLE teams (
                       id TEXT PRIMARY KEY,
                       name TEXT NOT NULL,
                       short_name TEXT NOT NULL,
                       logo_url TEXT,
                       primary_color TEXT,
                       secondary_color TEXT,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL
);

CREATE TABLE seasons (
                         id TEXT PRIMARY KEY,
                         team_id TEXT NOT NULL,
                         name TEXT NOT NULL,
                         year INTEGER NOT NULL,
                         is_active BOOLEAN NOT NULL,
                         created_at TIMESTAMP NOT NULL,
                         updated_at TIMESTAMP NOT NULL,
                         CONSTRAINT fk_seasons_team
                             FOREIGN KEY (team_id)
                                 REFERENCES teams(id)
                                 ON DELETE CASCADE
);

CREATE TABLE games (
                       id TEXT PRIMARY KEY,
                       season_id TEXT NOT NULL,
                       home_team_id TEXT NOT NULL,
                       away_team_id TEXT NOT NULL,
                       game_date TIMESTAMP NOT NULL,
                       location TEXT,
                       is_friendly BOOLEAN NOT NULL,
                       home_score INTEGER,
                       away_score INTEGER,
                       status TEXT NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL,
                       CONSTRAINT fk_games_season
                           FOREIGN KEY (season_id)
                               REFERENCES seasons(id)
                               ON DELETE CASCADE,
                       CONSTRAINT fk_games_home_team
                           FOREIGN KEY (home_team_id)
                               REFERENCES teams(id)
                               ON DELETE CASCADE,
                       CONSTRAINT fk_games_away_team
                           FOREIGN KEY (away_team_id)
                               REFERENCES teams(id)
                               ON DELETE CASCADE,
                       CONSTRAINT chk_games_different_teams
                           CHECK (home_team_id <> away_team_id)
);