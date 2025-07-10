import express from 'express';
import { 
    getUsers,
    updateUser,
    getDeletedOrders,
    restoreOrder,
    deleteUser,
    addUser
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes in this file are protected and only accessible by admins
router.use(protect, authorize('admin'));

router.route('/users')
    .get(getUsers)
    .post(addUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.route('/deleted-orders')
    .get(getDeletedOrders);

router.route('/restore-order/:id')
  .put(restoreOrder);


export default router; 