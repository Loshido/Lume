CREATE TABLE collections(
    id TEXT PRIMARY KEY, -- id in kebab-case
    name VARCHAR(55) NOT NULL UNIQUE, -- collection's label name
    description TEXT DEFAULT NULL -- An optionnal description 
);

CREATE TABLE article(
    collection TEXT references collections(id),
    id TEXT PRIMARY KEY, -- id in kebab-case
    title TEXT, -- article name
    content TEXT,
    createdAt TIMESTAMP DEFAULT NOW(), 
    updatedAt TIMESTAMP DEFAULT NOW(),
    draft BOOLEAN DEFAULT true
);