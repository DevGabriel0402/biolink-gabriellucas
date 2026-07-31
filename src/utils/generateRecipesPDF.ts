import { recipesData } from '../data/recipes';

declare global {
  interface Window {
    html2pdf?: any;
  }
}

export const generateRecipesPDF = (athleteName?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Create or get hidden container #ebook-content
      let container = document.getElementById('ebook-content');
      if (!container) {
        container = document.createElement('div');
        container.id = 'ebook-content';
        container.style.display = 'none';
        document.body.appendChild(container);
      }

      const name = athleteName || 'Atleta VIP';

      // 2. Build HTML template string
      const htmlString = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; width: 100%; box-sizing: border-box;">
          
          <!-- Capa (Cover Page) -->
          <div style="background-color: #0f172a; color: #ffffff; padding: 100px 40px 80px; text-align: center; border-radius: 0 0 24px 24px; min-height: 270mm; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; box-sizing: border-box;">
            <div>
              <div style="font-size: 14px; text-transform: uppercase; tracking: 3px; color: #ef4444; font-weight: bold; margin-bottom: 20px;">
                E-book Exclusivo de Receitas
              </div>
              <h1 style="font-size: 36px; color: #ef4444; margin: 0 0 16px 0; font-weight: 800; line-height: 1.2;">
                20 RECEITAS FIT & ANABÓLICAS
              </h1>
              <p style="font-size: 16px; color: #94a3b8; margin: 0 0 30px 0; line-height: 1.5;">
                Pratos práticos, deliciosos e com alta densidade proteica para potencializar seus resultados sem passar fome.
              </p>
            </div>

            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 40px;">
              <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;">
                Preparado especialmente para: <strong style="color: #ffffff;">${name}</strong>
              </div>
              <div style="font-size: 12px; color: #64748b;">
                Consultoria Fitness • Consultor Gabriel Lucas
              </div>
            </div>
          </div>

          <!-- Introdução -->
          <div style="padding: 30px 20px 20px;">
            <div style="background: #ffffff; border-left: 5px solid #ef4444; padding: 20px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); margin-bottom: 30px;">
              <h2 style="font-size: 20px; color: #0f172a; margin: 0 0 8px 0; font-weight: 700;">
                Bem-vindo ao seu Guia Culinário Fitness
              </h2>
              <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">
                Este e-book traz 20 opções balanceadas de refeições doces e salgadas, pré e pós-treino, com macros detalhados (Calorias, Proteínas, Carboidratos e Gorduras). Utilize estas receitas para manter a constância e a variedade no seu plano alimentar.
              </p>
            </div>

            <!-- Receitas Grid / List -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
              ${recipesData.map((rec) => `
                <div class="recipe-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); page-break-inside: avoid; margin-bottom: 20px;">
                  
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                    <div>
                      <span style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">
                        RECEITA #${rec.id}
                      </span>
                      <h3 style="font-size: 18px; color: #0f172a; margin: 4px 0 0 0; font-weight: 800;">
                        ${rec.title}
                      </h3>
                    </div>
                  </div>

                  <!-- Tabela Nutricional de Macros -->
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background: #f8fafc; border-radius: 8px; overflow: hidden;">
                    <thead>
                      <tr style="background: #0f172a; color: #ffffff; font-size: 11px; text-transform: uppercase;">
                        <th style="padding: 8px 12px; text-align: center;">Calorias</th>
                        <th style="padding: 8px 12px; text-align: center;">Proteínas</th>
                        <th style="padding: 8px 12px; text-align: center;">Carbos</th>
                        <th style="padding: 8px 12px; text-align: center;">Gorduras</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="font-size: 13px; font-weight: bold; color: #0f172a; text-align: center;">
                        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${rec.macros.kcal} kcal</td>
                        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #ef4444;">${rec.macros.prot}g</td>
                        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${rec.macros.carb}g</td>
                        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${rec.macros.gord}g</td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Ingredientes & Modo de Preparo -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                      <h4 style="font-size: 13px; color: #0f172a; margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase;">
                        🥗 Ingredientes:
                      </h4>
                      <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #334155; line-height: 1.5;">
                        ${rec.ing.map(i => `<li style="margin-bottom: 4px;">${i}</li>`).join('')}
                      </ul>
                    </div>

                    <div>
                      <h4 style="font-size: 13px; color: #0f172a; margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase;">
                        👨‍🍳 Modo de Preparo:
                      </h4>
                      <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #334155; line-height: 1.5;">
                        ${rec.prep.map(p => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
                      </ol>
                    </div>
                  </div>

                </div>
              `).join('')}
            </div>

            <!-- Rodapé Final -->
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b;">
              Consultor Gabriel • Consultoria Fitness & Treinamento Online • Todos os Direitos Reservados
            </div>
          </div>

        </div>
      `;

      container.innerHTML = htmlString;
      container.style.display = 'block';

      // 3. Configure html2pdf options as specified in the prompt
      const opt = {
        margin: 10,
        filename: 'Ebook_Fisico_Funcional_20_Receitas_Fit.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // 4. Generate & Download PDF
      if (window.html2pdf) {
        window.html2pdf().set(opt).from(container).save().then(() => {
          container.style.display = 'none';
          resolve();
        }).catch((err: any) => {
          container.style.display = 'none';
          reject(err);
        });
      } else {
        // Fallback if script loading delayed
        alert("Gerando PDF, aguarde um segundo...");
        setTimeout(() => {
          if (window.html2pdf) {
            window.html2pdf().set(opt).from(container).save().then(() => {
              container.style.display = 'none';
              resolve();
            });
          } else {
            container.style.display = 'none';
            reject("html2pdf.js não encontrado");
          }
        }, 1000);
      }
    } catch (error) {
      reject(error);
    }
  });
};
