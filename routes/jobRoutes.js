import express from 'express';
const router = express.Router();

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from '../controllers/jobController.js';

// moglo je i ovako
// router.post('/', createJob);
// router.get('/', getAllJobs);
// router.get('/stats', showStats);
// router.delete('/:id', deleteJob);
// router.patch('/:id', updateJob);

router.route('/').post(createJob).get(getAllJobs);
router.route('/stats').get(showStats);
router.route('/:id').delete(deleteJob).patch(updateJob);

export default router;
