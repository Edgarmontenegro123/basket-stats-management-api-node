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