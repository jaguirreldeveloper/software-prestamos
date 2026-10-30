import { useState } from 'react';
import { useBrand } from '../contexts/BrandContext';
import { Palette, Save, RotateCcw } from 'lucide-react';

export default function BrandSettings() {
  const { brand, updateBrand, resetBrand } = useBrand();
  const [formData, setFormData] = useState(brand);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de restablecer la configuración de marca?')) {
      resetBrand();
      setFormData(brand);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Configuración de Marca
        </h1>
        <p style={{ color: 'var(--text-tertiary)' }}>
          Personaliza la apariencia y branding de tu sistema
        </p>
      </div>

      {/* Preview */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Vista Previa
        </h2>
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-4 mb-4">
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="Logo" className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl" style={{ background: formData.primaryColor }}>
                💰
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formData.appName}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {formData.tagline}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: formData.primaryColor }}>
              Botón Primario
            </div>
            <div className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: formData.secondaryColor }}>
              Botón Secundario
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Configuración de Marca
          </h2>
        </div>

        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Información Básica
          </h3>
          
          <div>
            <label className="label">Nombre de la Aplicación</label>
            <input
              type="text"
              value={formData.appName}
              onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
              className="input"
              placeholder="Sistema de Préstamos"
            />
          </div>

          <div>
            <label className="label">Lema / Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="input"
              placeholder="Gestión completa de amortización"
            />
          </div>

          <div>
            <label className="label">Empresa</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input"
              placeholder="Mi Empresa"
            />
          </div>
        </div>

        {/* Colores */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Colores de Marca
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Color Primario</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="input flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <label className="label">Color Secundario</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="input flex-1"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Logo
          </h3>
          
          <div>
            <label className="label">URL del Logo</label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="input"
              placeholder="https://ejemplo.com/logo.png"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Ingresa la URL de tu logo o deja vacío para usar el ícono predeterminado
            </p>
          </div>
        </div>

        {/* Contacto */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Información de Contacto
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email de Contacto</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="input"
                placeholder="soporte@prestamos.com"
              />
            </div>

            <div>
              <label className="label">Teléfono de Contacto</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="input"
                placeholder="+591 70000000"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn btn-primary flex-1">
            <Save className="w-4 h-4" />
            {saved ? '¡Guardado!' : 'Guardar Cambios'}
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            <RotateCcw className="w-4 h-4" />
            Restablecer
          </button>
        </div>
      </form>

      {/* Info */}
      <div className="card" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
        <h3 className="text-md font-semibold mb-2" style={{ color: 'var(--accent-primary)' }}>
          💡 Consejos
        </h3>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li>• Los colores se aplican automáticamente a toda la aplicación</li>
          <li>• Usa colores con buen contraste para mejor accesibilidad</li>
          <li>• El logo debe ser una imagen cuadrada (recomendado: 200x200px)</li>
          <li>• Los cambios se guardan automáticamente en el navegador</li>
          <li>• Puedes restablecer la configuración en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
}
