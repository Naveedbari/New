export interface Service {
  number: string;
  name: string;
  description: string;
}

export const services: Service[] = [
  {
    number: '01',
    name: 'Frontend Development',
    description:
      'Building responsive, high-performance interfaces with Angular, ReactJs, TypeScript, and Ionic, translating Figma designs into pixel-perfect, production-ready UI.',
  },
  {
    number: '02',
    name: 'Backend & APIs',
    description:
      'Designing and building robust REST APIs and services with C#, .NET Core, ASP.NET Web API, and Entity Framework Core, backed by well-structured SQL Server databases.',
  },
  {
    number: '03',
    name: 'Full-Stack Web Apps',
    description:
      'Delivering complete platforms end-to-end -- requirements, architecture, clean code, testing, and deployment -- for payroll, HR, and ERP systems used by real businesses.',
  },
  {
    number: '04',
    name: 'Hybrid Mobile Apps',
    description:
      'Building cross-platform mobile apps with Ionic and Cordova, published to the Apple App Store and Google Play, covering everything from UI to native integrations.',
  },
  {
    number: '05',
    name: 'Legacy Modernization',
    description:
      'Migrating legacy codebases to modern frameworks like jQuery to Angular, refactoring for maintainability, and mentoring teams through the transition.',
  },
];
