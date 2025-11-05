import { useState } from 'react';
import { ChevronDown, ChevronUp, Wrench, AlertCircle } from 'lucide-react';

interface MaintenanceStep {
  step: string;
}

interface MaintenanceGuideData {
  id: string;
  title: string;
  description: string;
  steps: MaintenanceStep[];
  tools_required: string[];
  frequency: string;
  difficulty_level: string;
}

interface MaintenanceGuideProps {
  guides: MaintenanceGuideData[];
}

function MaintenanceGuide({ guides }: MaintenanceGuideProps) {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const difficultyColors = {
    Fácil: 'bg-green-500/20 text-green-300 border-green-500/30',
    Médio: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Difícil: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const getDifficultyColor = (difficulty: string) => {
    return (
      difficultyColors[difficulty as keyof typeof difficultyColors] ||
      'bg-slate-500/20 text-slate-300 border-slate-500/30'
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Wrench size={24} className="text-blue-400" />
        Guias de Manutenção
      </h3>

      <div className="space-y-3">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-slate-800/30 border border-blue-500/20 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all"
          >
            <button
              onClick={() =>
                setExpandedGuide(expandedGuide === guide.id ? null : guide.id)
              }
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-blue-500/5 transition-colors"
            >
              <div className="flex-1 text-left">
                <h4 className="text-lg font-bold text-white mb-1">{guide.title}</h4>
                <p className="text-sm text-slate-300 mb-2">{guide.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(guide.difficulty_level)}`}>
                    {guide.difficulty_level}
                  </span>
                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {guide.frequency}
                  </span>
                </div>
              </div>
              {expandedGuide === guide.id ? (
                <ChevronUp size={24} className="text-blue-400 ml-4 flex-shrink-0" />
              ) : (
                <ChevronDown size={24} className="text-blue-400 ml-4 flex-shrink-0" />
              )}
            </button>

            {expandedGuide === guide.id && (
              <div className="border-t border-blue-500/20 px-4 py-4 space-y-4">
                <div>
                  <h5 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Ferramentas Necessárias
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {guide.tools_required.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded text-sm bg-slate-700/50 text-slate-200 border border-slate-600/30"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-blue-300 font-bold mb-3">Procedimento Passo a Passo</h5>
                  <div className="space-y-2">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-slate-300 pt-1">{step.step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-sm text-blue-200">
                  <p>
                    <strong>Lembrete:</strong> Sempre descarregue completamente a arma antes de
                    qualquer manutenção. Use equipamento de proteção apropriado.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="text-center py-8 text-blue-200">
          Nenhum guia de manutenção disponível para esta arma.
        </div>
      )}
    </div>
  );
}

export default MaintenanceGuide;
