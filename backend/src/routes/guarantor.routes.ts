import { Router } from 'express';
import { createGuarantor, getGuarantors, getGuarantor, updateGuarantor, deleteGuarantor } from '../controllers/guarantor.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear garante
router.post('/', createGuarantor);

// Obtener todos los garantes del usuario
router.get('/', getGuarantors);

// Obtener un garante específico
router.get('/:id', getGuarantor);

// Actualizar garante
router.put('/:id', updateGuarantor);

// Eliminar garante
router.delete('/:id', deleteGuarantor);

export default router;
