import { Router } from 'express';
import { createUser, updateUser, getAllUsers, getUserByDimension, getUserByUsername, createMemory, updateMemory, getAllMemories, getMemoryById, getMemoriesByUser } from '../db/index'; // Adjust the import according to your structure
import {apiRouter} from 'schrodingers-backpack-fullstack/server/index.js';

const router = Router();

// User Routes
router.post('/users', async (req, res) => {
  const { username, password, dimension } = req.body;
  try {
    const user = await createUser({ username, password, dimension });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { username, password, dimension } = req.body;
  try {
    const user = await updateUser(userId, { username, password, dimension });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

router.get('/users/dimension/:dimension', async (req, res) => {
  const { dimension } = req.params;
  try {
    const user = await getUserByDimension(dimension);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user by dimension' });
  }
});

router.get('/users/username/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user by username' });
  }
});

// Memory Routes
router.post('/memories', async (req, res) => {
  const { title, imageUrl, description, dimension, author_nickname } = req.body;
  try {
    const memory = await createMemory({ title, imageUrl, description, dimension, author_nickname });
    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Error creating memory' });
  }
});

router.put('/memories/:memoryId', async (req, res) => {
  const { memoryId } = req.params;
  const { title, imageUrl, description, dimension } = req.body;
  try {
    const memory = await updateMemory(memoryId, { title, imageUrl, description, dimension });
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Error updating memory' });
  }
});

router.get('/memories', async (req, res) => {
  try {
    const memories = await getAllMemories();
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving all memories' });
  }
});

router.get('/memories/:memoryId', async (req, res) => {
  const { memoryId } = req.params;
  try {
    const memory = await getMemoryById(memoryId);
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving memory by ID' });
  }
});

router.get('/users/:userId/memories', async (req, res) => {
  const { userId } = req.params;
  try {
    const memories = await getMemoriesByUser(userId);
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving memories by user' });
  }
});

// Export the router
export default apiRouter