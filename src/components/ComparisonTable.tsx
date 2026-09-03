import React, { useState } from 'react';
import { Check, X, Sparkles, ShieldCheck, Laptop, HelpCircle, ArrowRight } from 'lucide-react';
import { Product } from '../types.ts';

interface ComparisonTableProps {
  currentCategory?: 'windows' | 'office' | 'combos' | 'project-visio';
  onSelectProduct?: (productSlug: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  currentCategory = 'windows',
  onSelectProduct
}) => {
  const [activeTab, setActiveTab] = useState<'windows' | 'office'>(
    currentCategory === 'office' ? 'office' : 'windows'
  );

  const windowsFeatures = [
    {
      name: 'Licencia para 1 PC (Permanente)',
      home: true,
      pro: true,
      enterprise: true,
      tooltip: 'Activación digital permanente de por vida en un equipo'
    },
    {
      name: 'Menú de Inicio y Rendimiento DirectStorage',
      home: true,
      pro: true,
      enterprise: true,
      tooltip: 'Carga ultrarrápida para juegos y multitarea fluida'
    },
    {
      name: 'Cifrado de Unidad BitLocker',
      home: false,
      pro: true,
      enterprise: true,
      tooltip: 'Protección de datos y discos duros mediante cifrado de grado militar'
    },
    {
      name: 'Escritorio Remoto (Remote Desktop Host)',
      home: false,
      pro: true,
      enterprise: true,
      tooltip: 'Conéctese a su equipo de forma remota desde cualquier lugar'
    },
    {
      name: 'Virtualización Hyper-V y Windows Sandbox',
      home: false,
      pro: true,
      enterprise: true,
      tooltip: 'Entorno aislado y seguro para probar software y máquinas virtuales'
    },
    {
      name: 'Unión a Dominios / Active Directory y Azure AD',
      home: false,
      pro: true,
      enterprise: true,
      tooltip: 'Ideal para redes corporativas, oficinas y universidades'
    },
    {
      name: 'Windows Defender Application Guard (WDAG)',
      home: false,
      pro: false,
      enterprise: true,
      tooltip: 'Máxima seguridad avanzada para infraestructuras empresariales'
    },
    {
      name: 'DirectAccess y BranchCache',
      home: false,
      pro: false,
      enterprise: true,
      tooltip: 'Optimización de redes corporativas globales sin necesidad de VPN'
    }
  ];

  const officeFeatures = [
    {
      name: 'Tipo de Licencia',
      m365: 'Cuenta Anual (5 Disp.)',
      off24: 'Permanente (1 PC)',
      off21: 'Permanente (1 PC)',
      tooltip: 'Modalidad de pago y asignación de equipos'
    },
    {
      name: 'Word, Excel, PowerPoint, OneNote',
      m365: true,
      off24: true,
      off21: true,
      tooltip: 'Suite base esencial para productividad'
    },
    {
      name: 'Outlook, Access y Publisher (Para PC)',
      m365: true,
      off24: true,
      off21: true,
      tooltip: 'Gestión de correo corporativo y bases de datos'
    },
    {
      name: 'Nuevas Fórmulas de Texto y Matrices Dinámicas',
      m365: true,
      off24: true,
      off21: 'Parcial',
      tooltip: 'Funciones TEXTBEFORE, TEXTAFTER, ARRAYTOTEXT y optimizaciones 2024'
    },
    {
      name: 'Almacenamiento en la Nube (OneDrive)',
      m365: '100 GB Cloud',
      off24: 'Local / Básico',
      off21: 'Local / Básico',
      tooltip: 'Espacio en la nube para sincronizar fotos, archivos y copias de seguridad'
    },
    {
      name: 'Integración Copilot AI y Herramientas Web',
      m365: true,
      off24: false,
      off21: false,
      tooltip: 'Asistente de inteligencia artificial en aplicaciones Microsoft'
    },
    {
      name: 'Sin Pagos Mensuales ni Renovaciones Forzosas',
      m365: false,
      off24: true,
      off21: true,
      tooltip: 'Pague una sola vez y use la licencia para siempre'
    }
  ];

  return (
    <section id="comparison-table-section" className="my-10 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guía de Elección Rápida</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Tabla Comparativa de Ediciones
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Compare las funciones principales de cada versión y elija la licencia ideal para su equipo.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('windows')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'windows'
                ? 'bg-white text-[#0066FF] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sistemas Windows
          </button>
          <button
            onClick={() => setActiveTab('office')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'office'
                ? 'bg-white text-[#0066FF] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Suites Microsoft Office
          </button>
        </div>
      </div>

      {activeTab === 'windows' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-900 text-xs uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 px-4 font-extrabold text-slate-700 w-2/5">Características</th>
                <th className="py-3.5 px-4 font-extrabold text-center text-slate-600 w-1/5">
                  <div>Windows 11 Home</div>
                  <div className="text-[10px] text-slate-400 font-medium lowercase">Para el Hogar</div>
                </th>
                <th className="py-3.5 px-4 font-extrabold text-center text-[#0066FF] bg-blue-50/50 rounded-t-xl w-1/5 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1">
                    <span>Windows 11 Pro</span>
                    <span className="bg-[#0066FF] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">Top</span>
                  </div>
                  <div className="text-[10px] text-blue-600/80 font-medium lowercase">Profesionales & PyMEs</div>
                </th>
                <th className="py-3.5 px-4 font-extrabold text-center text-slate-700 w-1/5">
                  <div>Win 11 Enterprise</div>
                  <div className="text-[10px] text-slate-400 font-medium lowercase">Grandes Empresas</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {windowsFeatures.map((feat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    {feat.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feat.home ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center bg-blue-50/30 border-x border-blue-100 font-bold">
                    {feat.pro ? (
                      <Check className="w-4 h-4 text-[#0066FF] mx-auto font-black" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feat.enterprise ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-900 text-xs uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 px-4 font-extrabold text-slate-700 w-2/5">Características</th>
                <th className="py-3.5 px-4 font-extrabold text-center text-[#0066FF] bg-blue-50/50 rounded-t-xl w-1/5 border-x border-blue-100">
                  <div className="flex items-center justify-center gap-1">
                    <span>Office 2024 Pro Plus</span>
                    <span className="bg-[#0066FF] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">Nuevo</span>
                  </div>
                  <div className="text-[10px] text-blue-600/80 font-medium lowercase">Pago Único (1 PC)</div>
                </th>
                <th className="py-3.5 px-4 font-extrabold text-center text-slate-700 w-1/5">
                  <div>Office 2021 Pro Plus</div>
                  <div className="text-[10px] text-slate-400 font-medium lowercase">Pago Único (1 PC)</div>
                </th>
                <th className="py-3.5 px-4 font-extrabold text-center text-indigo-700 w-1/5">
                  <div>Microsoft 365</div>
                  <div className="text-[10px] text-indigo-500 font-medium lowercase">100 GB Cloud (5 Disp.)</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {officeFeatures.map((feat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-xs font-semibold text-slate-800">
                    {feat.name}
                  </td>
                  <td className="py-3 px-4 text-center bg-blue-50/30 border-x border-blue-100 font-bold text-xs">
                    {typeof feat.off24 === 'boolean' ? (
                      feat.off24 ? (
                        <Check className="w-4 h-4 text-[#0066FF] mx-auto font-black" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-blue-900 font-bold">{feat.off24}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    {typeof feat.off21 === 'boolean' ? (
                      feat.off21 ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-slate-700 font-semibold">{feat.off21}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    {typeof feat.m365 === 'boolean' ? (
                      feat.m365 ? (
                        <Check className="w-4 h-4 text-indigo-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-indigo-900 font-bold">{feat.m365}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary recommendation */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Garantía UpClic Perú:</strong> Todas nuestras licencias de 1 PC incluyen activación permanente y soporte oficial en línea.
          </span>
        </div>
        <div className="text-slate-500 text-[11px] font-medium">
          ¿Dudas sobre su equipo? Escríbanos por WhatsApp al +51 924 934 949
        </div>
      </div>
    </section>
  );
};
