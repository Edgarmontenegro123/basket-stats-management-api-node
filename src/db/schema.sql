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