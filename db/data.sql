CREATE TABLE collections(
    id TEXT PRIMARY KEY, -- id in kebab-case
    name VARCHAR(55) NOT NULL UNIQUE, -- collection's label name
    description TEXT DEFAULT NULL -- An optionnal description 
);

CREATE TABLE articles(
    collection TEXT references collections(id),
    id TEXT PRIMARY KEY, -- id in kebab-case
    title TEXT, -- article name
    content TEXT,
    createdAt TIMESTAMP DEFAULT NOW(), 
    updatedAt TIMESTAMP DEFAULT NOW(),
    draft BOOLEAN DEFAULT true
);

CREATE TABLE users(
    id TEXT PRIMARY KEY,
    email VARCHAR(55) NOT NULL UNIQUE,
    name VARCHAR,
    permission VARCHAR(3) DEFAULT '000',
    password TEXT NOT NULL
);

CREATE TABLE media(
    id TEXT PRIMARY KEY,
    description TEXT,
    origin TEXT references users(id),
    createdat TIMESTAMP DEFAULT NOW()
);