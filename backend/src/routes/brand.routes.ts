import { Router } from 'express';
import { getBrandConfig, updateBrandConfig, deleteBrandConfig } from '../controllers/brand.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener configuración de marca
router.get('/', getBrandConfig);

// Actualizar configuración de marca
router.put('/', updateBrandConfig);

// Eliminar configuración de marca
router.delete('/', deleteBrandConfig);

export default router;
