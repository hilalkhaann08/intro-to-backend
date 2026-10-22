import { Router } from 'express';
import { createPost, getPosts, updatePosts, deletePosts } from '../controllers/post.controller.js';

const router = Router();

router.route('/create').post(createPost);
router.route('/getPosts').get(getPosts);
router.route('/update/:id').patch(updatePosts);
router.route('/delete/:id').delete(deletePosts);

export default router;