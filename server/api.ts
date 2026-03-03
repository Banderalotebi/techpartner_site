import express, { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Domain } from '../models/Domain';

const api = express.Router();

api.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

api.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

api.get('/domains', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const domains = await Domain.findAll();
    res.json(domains);
  } catch (error) {
    next(error);
  }
});

api.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

api.post('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    next(error);
  }
});

api.post('/domains', async (req: Request, res: Response, NextFunction) => {
  try {
    const domain = await Domain.create(req.body);
    res.json(domain);
  } catch (error) {
    next(error);
  }
});

api.get('/blog', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogPosts = await BlogPost.findAll();
    res.json(blogPosts);
  } catch (error) {
    next(error);
  }
});

api.post('/blog', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogPost = await BlogPost.create(req.body);
    res.json(blogPost);
  } catch (error) {
    next(error);
  }
});

export default api;
