// this is where you will seed starter data
// use arrow functions (see 4.36 for the structure)

const {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserByDimension,
  createMemory,
  updateMemory,
  getAllMemories,
} = require("./index");

const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
            DROP TABLE IF EXISTS memory_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS favorites;
            DROP TABLE IF EXISTS memories;
            DROP TABLE IF EXISTS users;   
            `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
};

const createTables = async () => {
  try {
    console.log("Starting to build tables...");

    // Drop the visibility_enum type if it already exists
    // ENUM--whether a post can be viewed publicly or privately
    await client.query(`
          DO $$ BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visibility_enum') THEN
              DROP TYPE visibility_enum;
            END IF;
          END $$;
        `);

    /* CREATE TABLE MEMORIES
    id 
    title         -- For the item/place/event
    image_url
    description   -- detailed memory description
    dimension     -- "location"; not a foreign key]
    visibility ENUM('public', 'private') DEFAULT 'public' 
    author_nickname     -- unlinked to the registered user submitting this memory; proper foreign key referenc
    tags          -- user generated tags?*/
    await client.query(
      `
      CREATE TYPE visibility_enum AS ENUM ('public', 'private');

      CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR (150) UNIQUE NOT NULL,
      password VARCHAR (150) NOT NULL,
      dimension VARCHAR(150) NOT NULL
      );

      CREATE TABLE memories(
      id UUID PRIMARY KEY,
      title VARCHAR(150),
      image_url VARCHAR(255),
      description TEXT,
      dimension VARCHAR(150),
      visibility visibility_enum DEFAULT 'public',
      author_nickname VARCHAR(150),
      tags varchar(255)
      );

      CREATE TABLE favorites(
      id UUID PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      memory_id UUID REFERENCES memories(id),
      CONSTRAINT unique_user_id_and_memory_id UNIQUE (user_id, memory_id)
      );

      CREATE TABLE tags (
      id UUID PRIMARY KEY,
      name varchar(255) UNIQUE NOT NULL
      );

      CREATE TABLE memory_tags (
      id UUID PRIMARY KEY,
      memory_id UUID REFERENCES memories(id),
      tag_id UUID REFERENCES tags(id),
      CONSTRAINT unique_memory_id_and_tag_id UNIQUE (memory_id, tag_id)
      );
      `
    );
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!", error);
    throw error;
  }
};

const createInitialUsers = async () => {
  try {
    console.log("Starting to create users...");

    const users = await Promise.all([
      await createUser({
        username: "grannyfrumps",
        password: "soup143",
        email: "grannyfrumps@frumps.com",
        dimension: "UTC-7",
      }),

      await createUser({
        username: "grumpycat",
        password: "bagelseasoning83",
        email: "grumpy@cat.com",
        dimension: "∞",
      }),

      await createUser({
        username: "euclid",
        password: "m1llert1me",
        email: "euclid@me.com",
        dimension: "∞",
      }),
    ]);

    console.log("Finished creating users!");
    return users;
  } catch (error) {
    console.error("Error creating users!", error);
    throw error;
  }
};

const createInitialMemories = async (users) => {
  try {
    console.log("Starting to retrieve memories...");
    /* CREATE TABLE MEMORIES
    id 
    title         -- For the item/place/event
    image_url
    description   -- detailed memory description
    dimension     -- "location"; not a foreign key]
    visibility ENUM('public', 'private') DEFAULT 'public', --hether a post can be viewed publicly or privately 
    author_id     -- unlinked to the registered user submitting this memory; proper foreign key referenc
    tags          -- user generated tags?*/
    await createMemory({
      title: "laptop stand",
      imageUrl:
        "https://drive.google.com/file/d/1_w2HGpeGcKu1pKKZ65d9gtlfvQUi_q2u/",
      description:
        "I remember he always preferred something packable, lightweight, and versatile",
      dimension: users[0].dimension,
      visibility: "public",
      author_nickname: "mortie",
      tags: ["#gadget", "#technology"],
    });

    await createMemory({
      title: '17" Macbook Pro Mid 2012',
      imageUrl:
        "https://drive.google.com/file/d/19dH18llxKaqsMnF0xi1T9qWUGI4DbB_E/",
      description: "SMF appreciated the durability of the older Mac books",
      dimension: users[1].dimension,
      visibility: "public",
      author_nickname: "dulce",
      tags: ["#gadget", "#technology"],
    });

    await createMemory({
      title: "iFixit Repair Business Toolkit",
      imageUrl:
        "https://drive.google.com/file/d/1q5yAY9tDdy8f8MjaAM0PwQpwMpOeoewA/",
      description:
        "he was a strong advocate of right to repair, including donating refurbished computers to his alma mater.",
      dimension: users[2].dimension,
      visibility: "public",
      author_nickname: "link",
      tags: ["#gadget", "#technology", "right-to-repair"],
    });

    await createMemory({
      title: "eagle scout",
      imageUrl:
        "https://drive.google.com/file/d/1q5yAY9tDdy8f8MjaAM0PwQpwMpOeoewA/",
      description:
        "his eagle scout training showed in his passion for camping, including setting up guylines.",
      dimension: users[2].dimension,
      visibility: "public",
      author_nickname: "scout",
      tags: ["#camping", "#technology", "#childhood"],
    });

    console.log("Finished retrieving initial memories!");
  } catch (error) {
    console.error("Error retrieving memories!", error);
    throw error;
  }
};

const rebuildDB = async () => {
  try {
    await client.connect();

    await dropTables();
    await createTables();

    const users = await createInitialUsers();
    await createInitialMemories(users);
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  } finally {
    await client.end(); // close connection
  }
};

rebuildDB();
