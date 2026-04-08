import { commonUtilsComposable } from './blog/common-utils-composable';
import { dashboardWidgetSystem } from './blog/dashboard-widget-system';
import { viewStateStandardization } from './blog/view-state-standardization';
import { rolePermissionSystem } from './blog/role-permission-system';
import { tableComponentStructuring } from './blog/table-component-structuring';
import { filterSystemImplementation } from './blog/filter-system-implementation';
import { treeStructureManagement } from './blog/tree-structure-management';
import { iconSystemImplementation } from './blog/icon-system-implementation';
import { reactPageRefactoring } from './blog/react-page-refactoring';
import { dynamicStaticImport } from './blog/dynamic-static-import';
import { cssPrintLayerConflict } from './blog/css-print-layer-conflict';
import { hiddenDivReactRendering } from './blog/hidden-div-react-rendering';
import { apiMismatchUsememoCrash } from './blog/api-mismatch-usememo-crash';

export interface BlogPost {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  excerpt: {
    ko: string;
    en: string;
  };
  category: {
    ko: string;
    en: string;
  };
  date: string;
  readTime: {
    ko: string;
    en: string;
  };
  tags: string[];
  thumbnail: string;
  component: string; // Component identifier
}

export const blogPosts: BlogPost[] = [
  commonUtilsComposable,
  dashboardWidgetSystem,
  viewStateStandardization,
  rolePermissionSystem,
  tableComponentStructuring,
  filterSystemImplementation,
  treeStructureManagement,
  iconSystemImplementation,
  reactPageRefactoring,
  dynamicStaticImport,
  cssPrintLayerConflict,
  hiddenDivReactRendering,
  apiMismatchUsememoCrash
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
