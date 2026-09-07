import { dashboardMockup, editorMockup, mobileMockup } from '../utils/graphics';

export interface Project {
  number: string;
  category: string;
  name: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
}

const TEAL = '#4FD1C5';
const PURPLE = '#B57EDC';
const GOLD = '#E8B34A';
const BLUE = '#5B9BD5';

export const projects: Project[] = [
  {
    number: '01',
    category: 'Client',
    name: 'US Payroll System',
    col1Image1: dashboardMockup(TEAL),
    col1Image2: mobileMockup(TEAL),
    col2Image: editorMockup(TEAL),
  },
  {
    number: '02',
    category: 'Client',
    name: 'Employee Access App',
    col1Image1: mobileMockup(PURPLE),
    col1Image2: dashboardMockup(PURPLE),
    col2Image: editorMockup(PURPLE),
  },
  {
    number: '03',
    category: 'Client',
    name: 'Squibler Writing Platform',
    col1Image1: editorMockup(GOLD),
    col1Image2: dashboardMockup(GOLD),
    col2Image: mobileMockup(GOLD),
  },
  {
    number: '04',
    category: 'Client',
    name: 'Inventory Management System',
    col1Image1: dashboardMockup(BLUE),
    col1Image2: editorMockup(BLUE),
    col2Image: mobileMockup(BLUE),
  },
];
