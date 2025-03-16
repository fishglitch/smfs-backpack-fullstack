// this is where you will seed starter data
// use arrow functions (see 4.36 for the structure)


const {  
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createMemory,
    updateMemory,
    getAllMemories,
  } = require('./index');
  
  const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
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

/* 
CREATE TABLE MEMORIES
    id 
    title         -- For the item/place/event
    image_url
    description   -- A detailed description of the memory
    dimension     -- "location"; not a foreign key
    author_id     -- unlinked to the registered user submitting this memory; proper foreign key referenc
);
*/
    await client.query(`
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
            author_nickname VARCHAR(150)
            );

            CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            memory_id UUID REFERENCES memories(id),
            CONSTRAINT unique_user_id_and_memory_id UNIQUE (user_id, memory_id)
            );

            `);
    console.log("Finished building tables!");


  } catch (error) {
    console.error("Error building tables!", error);
    throw error;
  }
};


const createInitialUsers = async ()=> {
    try {
        console.log("Starting to create users...");

        const users = await Promise.all([
                    await createUser({
            username: 'grannyfrumps',
            password: 'soup143',
            email: 'grannyfrumps@frumps.com',
            dimension: 'UTC-7'
        }),

        await createUser({
            username: 'grumpycat',
            password: 'bagelseasoning83',
            email: 'grumpy@cat.com',
            dimension: '∞'
        }),

        await createUser({
            username: 'euclid',
            password: 'm1llert1me',
            email: 'euclid@me.com',
            dimension: '∞'
        }),

        ]);


        console.log("Finished creating users!");
        return users;

    } catch (error) {
        console.error("Error creating users!", error);
        throw error;
    }
};

const createInitialMemories = async(users) => {
    try {
        console.log("Starting to retrieve memories...");

        await createMemory({
            title: 'laptop stand',
            imageUrl: '',
            description: 'I remember he always preferred something packable, lightweight, and versatile',
            dimension: users[0].dimension,
            author_nickname: 'mortie'
        });

        await createMemory({
            title: '17" Macbook Pro Mid 2012',
            imageUrl: '',
            description: 'SMF appreciated the durability of the older Mac books',
            dimension: users[1].dimension,
            author_nickname: 'dulce'
        });

        await createMemory({
            title: 'iFixit Repair Business Toolkit',
            imageUrl: '',
            description: 'he was a strong advocate of right to repair, including donating refurbished computers to his alma mater.',
            dimension: users[2].dimension,
            author_nickname: 'pickle'
        });

        console.log("Finished retrieving initial memories!");

    } catch (error){
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
