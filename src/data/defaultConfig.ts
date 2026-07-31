import { BioLinkConfig } from '../types/config';
import profileImg from '../image/profile.jpeg';

export const defaultConfig: BioLinkConfig = {
  profile: {
    name: "Gabriel Lucas",
    title: "Personal Trainer & Consultor Online",
    bio: "⚡ Conquiste o corpo dos seus sonhos em 90 dias com meu método de treino individualizado e dieta sem passar fome. +500 vidas transformadas.",
    avatarUrl: profileImg,
    isVerified: true,
    openSpotsBadge: "🔴 RESTAM APENAS 3 VAGAS PARA ESTE MÊS",
    whatsappNumber: "5531991660594",
    stats: [
      { id: "1", value: "-25kg", label: "em 180 dias" },
      { id: "2", value: "100%", label: "Natural" },
      { id: "3", value: "Foco", label: "E Disciplina" }
    ]
  },
  socials: {
    instagram: "https://instagram.com/ogabriielvieira",
    whatsapp: "https://wa.me/5531991660594",
    // youtube: "https://youtube.com",
    // tiktok: "https://tiktok.com",
    email: "gabriellucas2301@gmail.com"
  },
  links: [
    {
      id: "link-plans",
      title: "🔥 CONSULTORIA ONLINE VIP 1-ON-1",
      subtitle: "Treino sob medida + Plano Alimentar Flexível + Acompanhamento diário no WhatsApp",
      iconName: "Flame",
      badge: "⭐ O MAIS PEDIDO",
      badgeColor: "amber",
      type: "modal_plans",
      featured: true,
      animation: "glow"
    },
    {
      id: "link-macro",
      title: "📊 CALCULADORA DE MACROS, CALORIAS & IMC",
      subtitle: "Calcule grátis seu IMC, calorias e proteínas diárias para trincar ou ganhar massa",
      iconName: "Calculator",
      badge: "FERRAMENTA GRÁTIS",
      badgeColor: "emerald",
      type: "modal_macro",
      featured: false,
      animation: "none"
    },
    {
      id: "link-ebook",
      title: "📚 E-BOOKS GRÁTIS: HIPERTROFIA (GANHO DE MASSA)",
      subtitle: "Aprenda os 5 erros fatais que travam sua hipertrofia (ganho de massa muscular)",
      iconName: "BookOpen",
      badge: "DOWNLOAD GRÁTIS",
      badgeColor: "purple",
      type: "modal_ebook",
      featured: false,
      animation: "none"
    },
    {
      id: "link-whatsapp-direct",
      title: "📲 FALAR DIRETO NO WHATSAPP",
      subtitle: "Tire suas dúvidas diretamente com o Consultor Gabriel sobre a consultoria",
      iconName: "MessageCircle",
      type: "whatsapp",
      whatsappMsg: "Olá Gabriel! Vi seu link no Instagram e quero saber mais sobre as vagas da Consultoria Online.",
      featured: false,
      animation: "none"
    }
  ],
  plans: [
    {
      id: "plan-fit-mensal",
      title: "Plano Fit (Mensal)",
      tagline: "Plano completo para secar e definir. Ajustes constantes de volume e intensidade (quantidade de séries e peso) para quebrar platôs (quando o corpo para de evoluir).",
      price: "R$ 39,90",
      period: "/mês",
      featured: false,
      features: [
        "Ficha de treino 100% personalizada (Academia ou Em Casa)",
        "Ajustes constantes de volume e intensidade (peso e séries) para quebrar platôs (estagnação)",
        "Planilha de acompanhamento e progressão de cargas (aumento gradual de peso)",
        "Suporte direto no WhatsApp com o Consultor Gabriel"
      ],
      whatsappMsg: "Olá Gabriel! Gostaria de assinar o Plano Fit Mensal (R$ 39,90)."
    },
    {
      id: "plan-fit-trimestral",
      title: "Plano Fit (Trimestral)",
      tagline: "Plano completo para secar e definir com cobrança recorrente no cartão (sem ocupar todo o limite do cartão).",
      price: "R$ 96,90",
      period: "/a cada 3 meses",
      originalPrice: "R$ 119,70",
      featured: true,
      badge: "👑 MAIS POPULAR",
      features: [
        "Tudo do Plano Fit Mensal",
        "Economia garantida com renovação recorrente no cartão (cobrança automática)",
        "Análise de fotos de postura e evolução muscular",
        "Acesso ao aplicativo de treino em HD",
        "Suporte prioritário via WhatsApp com o Gabriel"
      ],
      whatsappMsg: "Olá Gabriel! Quero garantir minha vaga no Plano Fit Trimestral (R$ 96,90)!"
    },
    {
      id: "plan-fit-semestral",
      title: "Plano Fit (Semestral)",
      tagline: "Mude seu físico com o melhor custo-benefício. Cobrança recorrente no cartão (cobrança semestral).",
      price: "R$ 189,90",
      period: "/a cada 6 meses",
      originalPrice: "R$ 239,40",
      featured: false,
      badge: "🏆 MELHOR VALOR",
      features: [
        "Tudo dos planos anteriores",
        "Maior desconto mensal (~R$ 31,65 por mês)",
        "Atualização ilimitada de treinos a cada troca de fase",
        "Mentoria e acompanhamento contínuo",
        "Acesso a todos os e-books e guias bônus"
      ],
      whatsappMsg: "Olá Gabriel! Tenho interesse no Plano Fit Semestral (R$ 189,90) e quero assinar."
    }
  ],
  testimonials: [],
  ebooks: [
    {
      id: "ebook-sweet-recipes",
      title: "E-book 20 Doces Proteicos & Fit",
      description: "20 sobremesas anabólicas com tabela de macros (Brigadeiro de Whey, Mousse de Limão, Sorvete de Banana, Petit Gâteau e mais).",
      pdfUrl: "",
      badge: "⭐ 20 DOCES FIT",
      authorCredit: "Consultor Gabriel Lucas"
    },
    {
      id: "ebook-20-recipes",
      title: "E-book 20 Receitas Salgadas & Anabólicas",
      description: "20 receitas exclusivas com tabela de macros detalhada (Panqueca de Whey, Crepioca, Strogonoff Leve e mais).",
      pdfUrl: "",
      badge: "⭐ 20 RECEITAS FIT",
      authorCredit: "Consultor Gabriel Lucas"
    },
    {
      id: "ebook-1",
      title: "E-book de Receitas Fit & Anabólicas",
      description: "Pratos práticos, deliciosos e proteicos para manter a dieta sem passar fome.",
      pdfUrl: "https://tiagonutri.com.br/wp-content/uploads/2024/06/E-book-de-receitas-Tiagonuti.pdf",
      badge: "RECEITAS FIT",
      authorCredit: "Tiago Nutri (tiagonutri.com.br)"
    },
    {
      id: "ebook-2",
      title: "Guia de Treino Funcional para Fazer em Casa",
      description: "Manual completo de rotina de exercícios utilizando o peso do corpo.",
      pdfUrl: "https://www.subsecmilitar.rj.gov.br/sites/default/files/2020-03/TREINO%20FUNCIONAL%20PARA%20FAZER%20EM%20CASA.pdf",
      badge: "TREINO EM CASA",
      authorCredit: "Subsecretaria Militar do Estado do Rio de Janeiro"
    },
    {
      id: "ebook-3",
      title: "Guia da Hipertrofia Acelerada",
      description: "Os 5 pilares definitivos para ganhar massa magra sem acumular gordura desnecessária.",
      pdfUrl: "",
      badge: "HIPERTROFIA VIP",
      authorCredit: "Consultor Gabriel"
    }
  ],
  theme: {
    accentColor: "#00e5a3", // Clean Emerald Mint Green
    secondaryAccent: "#ff5500",
    bgStyle: "dark-onyx"
  }
};
