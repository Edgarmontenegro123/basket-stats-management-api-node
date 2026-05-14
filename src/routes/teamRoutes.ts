import { Router } from 'express';
import { createTeam, getTeamById, listTeams } from '../handlers/teamHandler';

const router = Router();

router.get('/teams', listTeams);
router.get('/teams/:id', getTeamById);
router.post('/teams', createTeam);

export default router;