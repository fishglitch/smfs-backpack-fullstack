/* seed.js: initialization and setup aspect; prepares db by creating schema + seed w/ initial data for functional and integration tests
*/

// imports multiple exports from module from ./db/index.js
import {
  client,
  getAllUsers,
  getUserById,
  getUserByUsername,
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

    /* Removed for MVP; future features to TBA
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

    /* MVP features; commented out features TBA
    * removed: 
    * from users(display_name varchar(255) NOT NULL, email VARCHAR(255) UNIQUE )
    * ENUM--whether a post can be viewed publicly or privately CREATE TYPE visibility_enum AS ENUM ('public', 'private');
    */
    await client.query(
      `
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
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      dimension VARCHAR(150)
      );
      `
      /* currently MVP; features TBA
      * if email verification is to be implemented, research deployment process
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
      );*/
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
        dimension: "UTC-7",
      }),

      await createUser({
        username: "grumpycat",
        password: "bagelseasoning83",
        dimension: "makerspace",
      }),

      await createUser({
        username: "euclid",
        password: "m1llert1me",
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

    await createMemory({ // granny's memory
      user_id: 1,
      title: "laptop stand",
      imageUrl:
        "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/9e9962e8-db12-4dd5-ac2b-cdf408dc6bf1/roost-laptop-stand.png?content-type=image%2Fpng",
      description:
        "I remember he always preferred something packable, lightweight, and versatile",
      dimension: users[0].dimension,
    });

    await createMemory({ // granny 
      user_id: 1,
      title: '17" Macbook Pro Mid 2012',
      imageUrl:
        "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/96bf2e18-67a5-4372-849c-ea912cc80f11/macbook-pro-mid-2012.png?content-type=image%2Fpng",
      description: "SMF appreciated the durability of the older Mac books",
      dimension: users[0].dimension,
    });

    await createMemory({
      user_id: 2,
      title: "iFixit Repair Business Toolkit",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/ec3d2ce3-ab4a-4a91-921a-ea05f6dde318/ifixit-repair-business-toolkit.png?content-type=image%2Fpng",
      description:
        "a strong advocate of right to repair, including donating refurbished computers to his alma mater.",
      dimension: users[1].dimension,
    });

    await createMemory({
      user_id: 2,
      title: "LAN parties",
      imageUrl:"",
      description:
        "at our dorms we went to the computer lab for LAN parties to talk to friends past curfew",
      dimension: users[1].dimension,
    });

    await createMemory({
      user_id: 2,
      title: "eagle scout",
      imageUrl:"https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/7e26b7f6-4409-4f56-acfa-f2bf8dbbbf7d/Eagle_Scout_medal_%28Boy_Scouts_of_America%29.png?content-type=image%2Fpng",
      description:
        "his eagle scout training showed in his passion for camping, including setting up guylines.",
      dimension: users[1].dimension,
    });
    
    await createMemory({ // granny 
      user_id: 1,
      title: "focaccia",
      imageUrl:"https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/2d95ed7a-6654-457f-b53c-0d9fde7d627c/focaccia-bread.png?content-type=image%2Fpng",
      description:
        "talented and precise at making bread",
      dimension: users[0].dimension,
    });

    await createMemory({ // granny 
      user_id: 1,
      title: "movie quotes",
      imageUrl:"",
      description:
        "so good at quipping random movie quotes at both timely and unexpected times",
      dimension: users[0].dimension,
    });

    await createMemory({
      user_id: 2,
      title: "DeWalt Laser Level",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/850257be-7314-448a-8317-2ddf3e223e18/dewalt-laser-level.png?content-type=image%2Fpng",
      description: "never was without a measurement tool when installing various items from curtain rods to light fixtures",
      dimension: users[1].dimension,
    });

    await createMemory({
      user_id: 2,
      title: "Pay the Maintainers Tee",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/30690af7-ef46-4eee-b175-178c2ef2f82c/pay-the-maintainers-tee.png?content-type=image%2Fpng",
      description: "he believed in the ethics of paying open source maintainers, many who lack the funding necessary to maintain their projects to a professional standard",
      dimension: users[1].dimension,
    });

    await createMemory({
      user_id: 2,
      title: "collasible chopsticks",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/69558e7e-89b2-4c01-8220-c6aa747e0ebb/collapsible-chopsticks.png?content-type=image%2Fpng",
      description: "always kept a metal set in his backpack",
      dimension: users[1].dimension,
    });

    await createMemory({
      user_id: 2,
      title: "mozzarella cheese",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/7d9bc5ff-1dc4-4fe8-b0fb-fe102e52d891/mozzarella-block-shred.png?content-type=image%2Fpng",
      description: "super duper cheese lover and made the best mac and cheese with various cheese types",
      dimension: users[1].dimension
    });

    await createMemory({
      user_id: 2,
      title: "bulk order of colorful hand sanitizer holders",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/0cc0f11a-e9b7-4a96-8464-02faea5b43e4/hand-sanitizer-holder-bulk.png?content-type=image%2Fpng",
      description: "this is the very same set he had and would attach one on his backpack and on a belt loop on his pants",
      dimension: users[1].dimension
    });

    await createMemory({
      user_id: 2,
      title: "Everything But Bagel Seasoning",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/2275e5a3-147f-400e-8ad7-57def2e3d32b/everything-but-bagel-seasoning.png?content-type=image%2Fpng",
      description: "an SMF pantry essential. He'd make tomato sandwiches and this would simply and deliciously season the tomato",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "Red Camping Chair from Walmart",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/62203542-c433-401b-9c7f-818521171806/Camping-Chair-with-Carrying-Bag.png?content-type=image%2Fpng",
      description: "he dreamed about getting the hi-tech ones from REI, but a practical and affordable chair also sufficed",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "Raspberry Pi",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/61fdf363-c308-4ea1-91de-502cdd801079/respberry-pi5-16gb.png?content-type=image%2Fpng",
      description: "would have several of these on hand for various projects, including am=n unrealized CD player that became more complicated than the boombox he wanted to replace!",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "Workshap Knife Sharpener Kit",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/88d2089e-11e3-4bac-89e0-5fcfb1b994fb/worksharp-knife-sharpener-kit.png?content-type=image%2Fpng",
      description: "he used and favored this sharpening set because of its ergonimic design, and also still kept an eye out for and researched other models",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "Cajun Style Gumbo",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/8ebe53b3-7af4-4c6f-9a3f-3ce7bb10430d/gumbo-by-courtney-made.png?content-type=image%2Fpng",
      description: "used roasted chicken and ensured we cooked with fresh andouille sausages",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "CeraVe Face Lotiom",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/70825320-4317-482b-9415-eec8c3fd149e/CeraVe-Facial-Lotion+Background+Removed.png?content-type=image%2Fpng",
      description: "was also curious about skin care and had good skin :)",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "reading glasses",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/9778ed55-3bb6-48a3-8c2d-8d1002618f1f/reading-glasses.png?content-type=image%2Fpng",
      description: "kept one sole pair and would forget it would be atop his head :P",
      dimension: users[1].dimension
    });

    await createMemory({
      user_id: 2,
      title: "heated toilet seat",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/5debbdb3-db7d-438b-8e37-30c8bcb6538c/heated-toilet-seat.png?content-type=image%2Fpng",
      description: "top priority anywhere he lived where one could be installed!",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "guylines for camping",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/479bac94-5214-41e8-8419-6f958ea04212/guylines.png?content-type=image%2Fpng",
      description: "deeply enthusiastic that we had a set on hand (and they were useful every single time!)",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "coffee scale",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/4c9a9471-93cb-4bee-89da-0883144672c1/acaia_white_pearl_scale.png?content-type=image%2Fpng",
      description: "measured his ground coffee every morning",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 2,
      title: "mercurial",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/22056bbd-9fab-4a2e-9543-7449ee52d2ab/mercurial+logo.png?content-type=image%2Fpng",
      description: "contributed to Mercurial version control",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 1,
      title: "outlet spacers",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/1b6b51f7-f0a2-4fa1-aa14-f80b3bf1831a/outlet-spacers.png?content-type=image%2Fpng",
      description: "with patience and care, gave me an extensive tutorial and Ted Talk on the use of and effectiveness of outlet spacers",
      dimension: users[0].dimension
    });


    await createMemory({
      user_id: 2,
      title: "voltage tester",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/1888b19d-e67e-419c-b25b-50c2a888c718/voltage-tester.png?content-type=image%2Fpng",
      description: "he had something simpler but I think he'd like this and study and use its features to its full capacity",
      dimension: users[1].dimension
    });


    await createMemory({
      user_id: 1,
      title: "electrolysis diagram",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/0a89e36a-e572-480a-9d91-37a881c6bb8d/electrolysis-diagram.png?content-type=image%2Fpng",
      description: "deeply enthusiastic about restoration projects including use of electrolysis solutions; his original kit was in storage",
      dimension: users[0].dimension
    });

    await createMemory({
      user_id: 1,
      title: "Spinzall centrifuge",
      imageUrl: "https://images.squarespace-cdn.com/content/567b33680ab37790ca47a564/3f901c18-520f-4eb8-944a-bf713a08ea47/spinzall-centrifuge.jpeg?content-type=image%2Fjpeg",
      description: "SMF's love for mixology and science was embodied in the machine that would separate solids from liquids, creating delicious drinks like watermelon margaritas",
      dimension: users[0].dimension
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

    // test db update User
    console.log("Calling updateUser on users[2]");
    const updateUserResult = await updateUser(users[2].id, {
      username: "Schrodinger's Cat",
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
    const updateMemoryResult = await updateMemory(memories[3].id, {
      title: "New Title",
      description: "Updated Content",
      dimension: "Updated dimension",
    });
    console.log("Result:", updateMemoryResult);
   

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
