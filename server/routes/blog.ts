import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth'; // Assume you have auth middleware

const router = Router();

// Blog Article Model (assuming you are using Mongoose)
const BlogArticle = require('../models/BlogArticle');

// Create a new blog article
router.post('/', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    const { title, content } = req.body;

    try {
        const newArticle = new BlogArticle({ title, content, author: req.user.id });
        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all blog articles
router.get('/', async (req, res) => {
    try {
        const articles = await BlogArticle.find();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single blog article by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const article = await BlogArticle.findById(id);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a blog article
router.put('/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedArticle = await BlogArticle.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!updatedArticle) return res.status(404).json({ error: 'Article not found' });
        res.status(200).json(updatedArticle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a blog article
router.delete('/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    const { id } = req.params;

    try {
        const deletedArticle = await BlogArticle.findByIdAndDelete(id);
        if (!deletedArticle) return res.status(404).json({ error: 'Article not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
