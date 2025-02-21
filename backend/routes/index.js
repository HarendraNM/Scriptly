import express from "express";
import {login, signup} from "../controllers/userController.js";
import {createProject, deleteProject, getProject, getProjects, saveProject, updateProject} from "../controllers/projectController.js";

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/createProject',createProject);
router.post('/saveProject',saveProject);
router.post('/getProjects',getProjects);
router.post('/getProject',getProject);
router.post('/deleteProject',deleteProject);
router.post('/updateProject',updateProject);



export default router;