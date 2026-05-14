import { Router } from 'express';
import {createTeam, deleteTeam, getTeamById, listTeams} from '../handlers/teamHandler';

const router = Router();

router.get('/teams', listTeams);
router.get('/teams/:id', getTeamById);
router.post('/teams', createTeam);
router.delete('/teams/:id', deleteTeam);

export default router;