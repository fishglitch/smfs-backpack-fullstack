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
  getUserByUsername,
  createUser,
  // updateUser,
  deleteUser,
  getAllMemories,
  getMemoryById,
  getMemoriesByUser,
  createMemory,
  // updateMemory,
  deleteMemory,
} from "../db/index.js";

const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    /*
               DROP TABLE IF EXISTS email_verifications;
            DROP TABLE IF EXISTS memory_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS favorites;
    */
    await client.query(`
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

    /* Drop the visibility_enum type if it already exists
    // ENUM--whether a post can be viewed publicly or privately
    await client.query(`
          DO $$ BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visibility_enum') THEN
              DROP TYPE visibility_enum;
            END IF;
          END $$;
        `);
        */

    /* CREATE TABLE MEMORIES
    id 
    title         -- For the item/place/event
    image_url
    description   -- detailed memory description
    dimension     -- "location"; not a foreign key]
    visibility ENUM('public', 'private') DEFAULT 'public' 
    author_nickname     -- unlinked to the registered user submitting this memory; proper foreign key referenc
    tags          -- user generated tags?*/

    // CREATE TYPE visibility_enum AS ENUM ('public', 'private');
    // visibility visibility_enum DEFAULT 'public',
    //
    // tags varchar(255)[]
    await client.query(
      `
      CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR (150) UNIQUE NOT NULL,
      password VARCHAR (150) NOT NULL,
      display_name varchar(255) NOT NULL,
      dimension VARCHAR(150) NOT NULL,
      email VARCHAR(255) UNIQUE
      );

      CREATE TABLE memories(
      id UUID PRIMARY KEY,
      title VARCHAR(150),
      image_url VARCHAR(255),
      description TEXT,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      dimension VARCHAR(150)
      );
      `
      /*
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
    */
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
        username: "granny",
        password: "soup143",
        display_name: "grannyfrumps",
        dimension: "UTC-7",
        email: "granny@frumps.com",
      }),

      await createUser({
        username: "grumpycat",
        password: "bagelseasoning83",
        display_name: "grumpy",
        dimension: "∞",
        email: "grumpy@cat.com",
      }),

      await createUser({
        username: "euclid",
        password: "m1llert1me",
        display_name: "euclid",
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
      userId: 1,
      title: "laptop stand",
      imageUrl:
        "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/9e9962e8-db12-4dd5-ac2b-cdf408dc6bf1/roost-laptop-stand.png?content-type=image%2Fpng",
      description:
        "I remember he always preferred something packable, lightweight, and versatile",
      // display_name: users[0].display_name,
      dimension: users[0].dimension,
      // visibility: "public",
      // tags: ["#gadget", "#technology"],
    });

    await createMemory({
      userId: 1,
      title: '17" Macbook Pro Mid 2012',
      imageUrl:
        "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/96bf2e18-67a5-4372-849c-ea912cc80f11/macbook-pro-mid-2012.png?content-type=image%2Fpng",
      description: "SMF appreciated the durability of the older Mac books",
      // display_name: users[1].display_name,
      dimension: users[1].dimension,
      // visibility: "public",
      // tags: ["#gadget", "#technology"],
    });

    await createMemory({
      userId: 2,
      title: "iFixit Repair Business Toolkit",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/ec3d2ce3-ab4a-4a91-921a-ea05f6dde318/ifixit-repair-business-toolkit.png?content-type=image%2Fpng",
      description:
        "he was a strong advocate of right to repair, including donating refurbished computers to his alma mater.",
      // display_name: users[2].display_name,
      dimension: users[2].dimension,
      // visibility: "public",
      // tags: ["#gadget", "#technology", "right-to-repair"],
    });

    await createMemory({
      userId: 2,
      title: "eagle scout",
      imageUrl:"",
      description:
        "his eagle scout training showed in his passion for camping, including setting up guylines.",
      // display_name: users[2].display_name,
      dimension: users[2].dimension,
      // visibility: "public",
      // tags: ["#camping", "#technology", "#childhood"],
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

    // test db get User By Username
    console.log("Calling getUserByUsername with users[0].id");
    const usernameDetail = await getUserByUsername(users[0].id);
    console.log("Result:", usernameDetail);

    // createUser already used in createInitialUsers()

    /* test db update User
    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Schrodinger's Cat",
      dimension: "fifth dimension",
    });
    console.log("Result:", updateUserResult);
    */

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

    /* test db update Memory
    console.log("Calling updateMemory on memories[0]");
    const updateMemoryResult = await updateMemory(memories[0].id, {
      title: "New Title",
      description: "Updated Content",
      dimension: "Updated dimension",
    });
    console.log("Result:", updateMemoryResult);
    */

    /* test db  update memory tags
    console.log("Calling updateMemory on memories[1], only updating tags");
    const updateMemoryTagsResult = await updateMemory(memories[1].id, {
      tags: ["#remember", "#tender", "#nostalgia"],
    });
    console.log("Result:", updateMemoryTagsResult);
    */

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
