export interface ChatQuestion {
  question: {
    ko: string;
    en: string;
  };
  answer: {
    ko: string;
    en: string;
  };
  action?: 'openContact';
}

export interface ChatCategory {
  id: string;
  icon: string;
  title: {
    ko: string;
    en: string;
  };
  questions: ChatQuestion[];
}

export const chatbotData: ChatCategory[] = [
  {
    id: 'intro',
    icon: '👋',
    title: {
      ko: '자기소개',
      en: 'Introduction'
    },
    questions: [
      {
        question: {
          ko: '당신은 누구인가요?',
          en: 'Who are you?'
        },
        answer: {
          ko: '디자인 감각을 바탕으로 인터페이스를 구현하는 프론트엔드 개발자, 허정연입니다.\n사용자가 \'편안함\'을 느끼는 화면을 만드는 걸 좋아해요.',
          en: 'I\'m Jeongyeon Heo, a frontend developer who implements interfaces based on design sense.\nI love creating screens where users feel \'comfortable\'.'
        }
      },
      {
        question: {
          ko: '어떤 일을 하나요?',
          en: 'What do you do?'
        },
        answer: {
          ko: 'UI/UX 설계부터 실제 화면 개발까지 담당하고 있습니다.\nNuxt, Vue, React 기반의 웹 서비스를 개발하며, 디자인 시스템과 컴포넌트 구조화를 주로 다룹니다.',
          en: 'I handle everything from UI/UX design to actual screen development.\nI develop web services based on Nuxt, Vue, and React, mainly dealing with design systems and component architecture.'
        }
      },
      {
        question: {
          ko: '디자인도 하시나요?',
          en: 'Do you also do design?'
        },
        answer: {
          ko: '네, 디자인도 직접 합니다.\nFigma로 UI를 설계하고, 그 디자인이 실제로 코드에서 얼마나 자연스럽게 구현될 수 있을지를 함께 고민합니다.',
          en: 'Yes, I do design directly.\nI design UI with Figma and consider how naturally the design can be implemented in code.'
        }
      },
      {
        question: {
          ko: '왜 프론트엔드 개발을 선택했나요?',
          en: 'Why did you choose frontend development?'
        },
        answer: {
          ko: '디자인의 감각과 논리를 동시에 표현할 수 있는 영역이 프론트엔드라고 생각했어요.\n\'보여주는 것\' 이상으로 \'느끼게 만드는 경험\'을 만들고 싶었습니다.',
          en: 'I thought frontend is the area where I can express both design sense and logic.\nI wanted to create \'experiences that make you feel\' beyond just \'showing\'.'
        }
      }
    ]
  },
  {
    id: 'tech',
    icon: '🧠',
    title: {
      ko: '기술',
      en: 'Technology'
    },
    questions: [
      {
        question: {
          ko: '어떤 기술을 주로 사용하나요?',
          en: 'What technologies do you mainly use?'
        },
        answer: {
          ko: 'Vue 3, Nuxt 3, TypeScript 그리고 Docker 환경에서 개발합니다.\n개인 프로젝트에선 React, Styled Components, Next.js도 사용해요.',
          en: 'I develop with Vue 3, Nuxt 3, TypeScript, and Docker environment.\nFor personal projects, I also use React, Styled Components, and Next.js.'
        }
      },
      {
        question: {
          ko: '프론트엔드 개발 시 중요하게 생각하는 점은요?',
          en: 'What do you consider important in frontend development?'
        },
        answer: {
          ko: '확장 가능한 구조, 명확한 타입, 그리고 일관된 사용자 경험.\n코드가 단지 \'작동하는 것\'이 아니라, 팀과 함께 \'성장할 수 있는 구조\'여야 한다고 생각합니다.',
          en: 'Scalable structure, clear types, and consistent user experience.\nI believe code should not just \'work\', but be a \'structure that can grow with the team\'.'
        }
      },
      {
        question: {
          ko: '디자인과 개발 중 어떤 쪽이 더 자신 있나요?',
          en: 'Are you more confident in design or development?'
        },
        answer: {
          ko: '개발 쪽이 주력입니다. 하지만 디자인 감각을 함께 살리는 게 제 강점이에요.\n\'디자인을 이해하는 개발자\'로서 두 영역을 자연스럽게 연결하는 걸 좋아합니다.',
          en: 'Development is my main focus. But utilizing design sense together is my strength.\nAs a \'developer who understands design\', I love naturally connecting the two areas.'
        }
      },
      {
        question: {
          ko: '코드 스타일이나 철학이 있나요?',
          en: 'Do you have a code style or philosophy?'
        },
        answer: {
          ko: '읽기 쉬운 코드가 유지보수의 시작이라고 믿습니다.\n명확한 타입 정의, 재사용 가능한 구조, 그리고 불필요한 복잡성을 피하는 것이 제 기본 원칙이에요.',
          en: 'I believe readable code is the beginning of maintenance.\nClear type definitions, reusable structure, and avoiding unnecessary complexity are my basic principles.'
        }
      }
    ]
  },
  {
    id: 'projects',
    icon: '🧩',
    title: {
      ko: '프로젝트',
      en: 'Projects'
    },
    questions: [
      {
        question: {
          ko: '어떤 프로젝트를 진행했나요?',
          en: 'What projects have you worked on?'
        },
        answer: {
          ko: '크게 세 가지 영역에서 프로젝트를 진행했어요.\n\n🏢 기업 보안 솔루션\n동훈아이텍의 \'Keyrke\' 프론트엔드를 담당했습니다. 수만 건의 로그를 다루는 관리 시스템, 권한·정책 UI, 팀 전체가 사용하는 디자인 시스템까지 직접 설계하고 구현했어요.\n\n📦 계약 관리 플랫폼\n통인익스프레스의 통합 계약관리 시스템을 개발했습니다. 이사 신청부터 계약 체결까지의 전 과정을 디지털화하고, 관리자와 고객 양쪽의 흐름을 설계했어요.\n\n🧩 오픈소스 & 개인 프로젝트\nReact 기반 UI 컴포넌트 라이브러리를 직접 개발해 오픈소스로 공개했고, 이 포트폴리오 사이트도 직접 기획·설계·개발했습니다.\n\n자세한 내용은 프로젝트 탭에서 확인해보세요 🙂',
          en: 'I\'ve worked on three main areas.\n\n🏢 Enterprise Security Solution\nI handled the frontend for Donghun I-Tech\'s \'Keyrke\'. I designed and built a log management system handling tens of thousands of records, permission & policy UI, and a design system used across the team.\n\n📦 Contract Management Platform\nI developed an integrated contract management system for Tongin Express. I digitized the entire flow from moving applications to contract signing, designing experiences for both admin and customer sides.\n\n🧩 Open Source & Personal Projects\nI developed a React-based UI component library and released it as open source. This portfolio site was also planned, designed, and developed entirely by me.\n\nCheck out the Projects tab for more details 🙂'
        }
      },
      {
        question: {
          ko: '기억에 남는 프로젝트가 있나요?',
          en: 'Do you have a memorable project?'
        },
        answer: {
          ko: '\'통인익스프레스 통합 계약관리 시스템\' 프로젝트가 가장 기억에 남아요.\n이사 신청부터 계약 관리까지의 전 과정을 디지털화한 시스템을 개발했습니다.',
          en: 'The \'Tongin Express Integrated Contract Management System\' project is the most memorable.\nI developed a system that digitized the entire process from moving application to contract management.'
        }
      }
    ]
  },
  {
    id: 'collaboration',
    icon: '🤝',
    title: {
      ko: '일하는 방식 / 협업 철학',
      en: 'Work Style / Collaboration'
    },
    questions: [
      {
        question: {
          ko: '어떤 방식으로 일하나요?',
          en: 'How do you work?'
        },
        answer: {
          ko: '문제를 빠르게 파악하고, 구조를 시각화해서 해결책을 제시합니다.\n작업 전후에 문서화를 습관처럼 합니다.',
          en: 'I quickly identify problems, visualize the structure, and present solutions.\nI habitually document before and after work.'
        }
      },
      {
        question: {
          ko: '협업 시 중요하게 생각하는 점은요?',
          en: 'What do you consider important in collaboration?'
        },
        answer: {
          ko: '명확한 커뮤니케이션과 투명한 공유.\n"팀 전체가 이해할 수 있는 구조"를 만드는 걸 가장 중요하게 생각해요.',
          en: 'Clear communication and transparent sharing.\nI think creating a \'structure that the entire team can understand\' is most important.'
        }
      },
      {
        question: {
          ko: '문제를 해결할 때 어떤 접근을 하나요?',
          en: 'What approach do you take when solving problems?'
        },
        answer: {
          ko: '먼저 원인을 시각화합니다.\n단순히 증상을 고치기보다, 재발하지 않게 구조를 다시 설계하는 편이에요.',
          en: 'First, I visualize the cause.\nRather than just fixing symptoms, I tend to redesign the structure to prevent recurrence.'
        }
      }
    ]
  },
  {
    id: 'values',
    icon: '🌱',
    title: {
      ko: '가치관 / 목표',
      en: 'Values / Goals'
    },
    questions: [
      {
        question: {
          ko: '당신의 작업을 한 문장으로 표현한다면요?',
          en: 'How would you describe your work in one sentence?'
        },
        answer: {
          ko: '디자인과 코드를 잇는 사람.\n사용자의 시선과 개발자의 논리가 만나는 지점을 찾습니다.',
          en: 'A person who connects design and code.\nI find the point where user\'s eyes and developer\'s logic meet.'
        }
      },
      {
        question: {
          ko: '어떤 사람이 되고 싶나요?',
          en: 'What kind of person do you want to be?'
        },
        answer: {
          ko: '감각과 논리를 동시에 다루는 엔지니어.\n기술이 사람에게 따뜻하게 느껴지게 만드는 개발자가 되고 싶습니다.',
          en: 'An engineer who handles both sense and logic.\nI want to be a developer who makes technology feel warm to people.'
        }
      },
      {
        question: {
          ko: '앞으로의 목표는요?',
          en: 'What are your future goals?'
        },
        answer: {
          ko: '디자인 시스템과 인터랙션에 강한 프론트엔드 엔지니어로 성장하는 것.\n더 나은 사용자 경험을 설계하는 제품 중심 개발자로 나아가고 싶어요.',
          en: 'To grow as a frontend engineer strong in design systems and interactions.\nI want to move forward as a product-centered developer who designs better user experiences.'
        }
      }
    ]
  },
  {
    id: 'contact',
    icon: '📩',
    title: {
      ko: '연락',
      en: 'Contact'
    },
    questions: [
      {
        question: {
          ko: '더 궁금한 게 있어요.',
          en: 'I have more questions.'
        },
        answer: {
          ko: '언제든지 물어보세요🙂\n프로젝트나 기술적인 부분도 편하게 이야기할 수 있어요.',
          en: 'Feel free to ask anytime🙂\nI can comfortably talk about projects or technical aspects.'
        }
      },
      {
        question: {
          ko: '프로젝트를 보고 싶어요.',
          en: 'I want to see your projects.'
        },
        answer: {
          ko: '제 GitHub와 포트폴리오에 정리되어 있습니다.\nhttps://github.com/yourusername 또는 "프로젝트 보기" 버튼을 눌러주세요.',
          en: 'They are organized on my GitHub and portfolio.\nhttps://github.com/yourusername or click the "View Projects" button.'
        }
      },
      {
        question: {
          ko: '연락드려도 될까요?',
          en: 'Can I contact you?'
        },
        answer: {
          ko: '물론입니다.\n협업, 제안, 또는 커피챗이라도 언제든 환영이에요 ☕\nqazseeszaq3219@gmail.com',
          en: 'Of course.\nCollaboration, proposals, or even coffee chat are always welcome ☕\nqazseeszaq3219@gmail.com'
        },
        action: 'openContact'
      }
    ]
  }
];
