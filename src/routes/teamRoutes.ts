import { Router } from 'express';
import { createTeam, listTeams } from '../handlers/teamHandler';

const router = Router();

router.get('/teams', listTeams);
router.post('/teams', createTeam);

export default router;