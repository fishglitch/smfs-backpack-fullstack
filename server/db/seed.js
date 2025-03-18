/* this is where you will seed starter data
 use arrow functions (see 4.36 for the structure)

3.17 
1. testDb() is commented out
Errors:
1. seed.js is clean exit, however: 'tag' column in 'memories' table NULL, hence 'tag' and 'memory_tag' tables empty

*/
const {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  
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
      name varchar(255) NOT NULL,
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
        name: "granny frumps",
        dimension: "UTC-7",
      }),

      await createUser({
        username: "grumpycat",
        password: "bagelseasoning83",
        email: "grumpy@cat.com",
        name: "grumpy cat",
        dimension: "∞",
      }),

      await createUser({
        username: "euclid",
        password: "m1llert1me",
        email: "euclid@me.com",
        name: "euclid",
        dimension: "∞"
      })
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
  }

};


/*
const {
  client,
  createUser,
  getAllUsers,
  updateUser,
  getUserById,
  deleteUser,
  
  getAllMemories,
  createMemory,
  updateMemory,

} = require("./index");
*/
async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);


    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      dimension: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);


    console.log("Calling getAllMemories");
    const memories = await getAllMemories();
    console.log("Result:", memories);

    console.log("Calling updateMemory on memories[0]");
    const updateMemoryResult = await updateMemory(memories[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updateMemoryResult);

    console.log("Calling updateMemory on memories[1], only updating tags");
    const updateMemoryTagsResult = await updateMemory(memories[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"]
    });
    console.log("Result:", updateMemoryTagsResult);



    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);

    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

const runSeedAndTest = async () => {
  try {
    await rebuildDB();
    await testDB();
  } catch (error) {
    console.error("Error during seed and test:", error);
  } finally {
    await client.end(); // Close connection after everything is done
  }
};

runSeedAndTest();