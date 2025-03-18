/* seed.js: initialization and setup aspect; prepares db by creating schema + seeding it with initial data for functional and integration tests
3.17 
1. testDb() is commented out
Errors:
1. seed.js is clean exit, however: 'tag' column in 'memories' table NULL, hence 'tag' and 'memory_tag' tables empty
*/

// imports multiple exports from module from ./db/index.js
import {
  client,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  getAllMemories,
  getMemoryById,
  getMemoriesByUser,
  createMemory,
  updateMemory,
  deleteMemory,
} from "../db/index.js";

const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
            DROP TABLE IF EXISTS email_verifications;
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
      name varchar(255) NOT NULL,
      dimension VARCHAR(150) NOT NULL,
      email VARCHAR(255) UNIQUE
      );

      CREATE TABLE memories(
      id UUID PRIMARY KEY,
      title VARCHAR(150),
      image_url VARCHAR(255),
      description TEXT,
      dimension VARCHAR(150),
      visibility visibility_enum DEFAULT 'public',
      author_nickname VARCHAR(150),
      tags varchar(255)[]
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

      CREATE TABLE email_verifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- Link back to users
      token VARCHAR(255) NOT NULL,  -- The unique verification token
      is_verified BOOLEAN DEFAULT FALSE,  -- Status of the verification
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP  -- Optional: token expiration
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
        name: "granny frumps",
        dimension: "UTC-7",
        email: "grannyfrumps@frumps.com",
      }),

      await createUser({
        username: "grumpycat",
        password: "bagelseasoning83",
        name: "grumpy cat",
        dimension: "∞",
        email: "grumpy@cat.com",
      }),

      await createUser({
        username: "euclid",
        password: "m1llert1me",
        name: "euclid",
        dimension: "∞",
        email: "euclid@me.com",
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

    await dropTables();
    await createTables();

    const users = await createInitialUsers();
    await createInitialMemories(users);
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
};

/* this function focuses on Creation and Retrieval, hence no delete functions */
async function testDB() {
  try {
    console.log("Starting to test database...");

    // USER METHODS
    // test db get All Users
    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);
    if (users.length === 0) {
      throw new Error("No users found. Seeding may have failed.");
    }

    // test db get User By Id
    console.log("Calling getUserById with users[0].id");
    const userDetail = await getUserById(users[0].id);
    console.log("Result:", userDetail);

    // createUser already used in createInitialUsers()

    // test db update User
    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Schrodinger's Cat",
      dimension: "fifth dimension",
    });
    console.log("Result:", updateUserResult);

    // MEMORY METHODS

    // test db get All Memories
    console.log("Calling getAllMemories");
    const memories = await getAllMemories();
    console.log("Result:", memories);
    if (memories.length === 0) {
      throw new Error("No memories found. Seeding may have failed.");
    }

    // test db get memory By Id
    console.log("Calling getMemoryById with memories[0].id");
    const memoryDetail = await getMemoryById(memories[0].id);
    console.log("Result:", memoryDetail);

    // test db get memory By User
    console.log("Calling getMemoryByUser with users[0].id");
    const memoryDetailByUser = await getMemoriesByUser(users[0].id);
    console.log("Result:", memoryDetailByUser);

    // createMemory already used in createInitialMemories()

    // test db update Memory
    console.log("Calling updateMemory on memories[0]");
    const updateMemoryResult = await updateMemory(memories[0].id, {
      title: "New Title",
      description: "Updated Content",
      dimension: "Updated dimension",
    });
    console.log("Result:", updateMemoryResult);

    // test db  update memory tags
    console.log("Calling updateMemory on memories[1], only updating tags");
    const updateMemoryTagsResult = await updateMemory(memories[1].id, {
      tags: ["#remember", "#tender", "#nostalgia"],
    });
    console.log("Result:", updateMemoryTagsResult);

    /* invoke only when implementing tags feature
    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);
    if (allTags.length === 0)
      throw new Error("No tags found. Seeding may have failed.");
    console.log("Result:", tags);

    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);
  */
 
    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }

}

const runSeedAndTest = async () => {
  try {
    // Connect to the client only once
    await client.connect(); // Connect to the database first

    await rebuildDB(); // Call to drop, create tables and seed initial data
    await testDB(); // Call to run tests against the seeded database

  } catch (error) {
    console.error("Error during seed and test:", error);
  } finally {
    await client.end(); // Close connection after everything is done
  }
};

runSeedAndTest();
