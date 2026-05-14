import { Router } from 'express';
import {createTeam, getTeamById, listTeams, updateTeam, deleteTeam  } from '../handlers/teamHandler';

const router = Router();

router.get('/teams', listTeams);
router.get('/teams/:id', getTeamById);
router.post('/teams', createTeam);
router.put('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);

export default router;