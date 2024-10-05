import express from 'express';
import { contactDelete, contactGet, contactPost } from '../controller/contact.controller.js';
import { isAuthenticated } from '../midelware/user.auth.js';
import { isAdmin } from '../midelware/admin.js';
const router=express.Router();

router.post('/contact',contactPost);
router.get('/all',isAuthenticated,isAdmin,contactGet);

export default router