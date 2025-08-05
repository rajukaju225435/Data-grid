export interface User {
  id: number;
  name: string;
}

export interface UserFetchRequestedAction {
  type: "USER_FETCH_REQUESTED";
  payload: number;
}

export interface UserFetchSucceededAction {
  type: "USER_FETCH_SUCCEEDED";
  payload: User;
}

export interface UserFetchFailedAction {
  type: "USER_FETCH_FAILED";
  message: string;
}

export type UserAction =
  | UserFetchRequestedAction
  | UserFetchSucceededAction
  | UserFetchFailedAction;

export interface Root {
  statusCode: number;
  message: string;
  success: boolean;
  responseTime: string;
  data: Data;
}

export interface Data {
  items: Item[];
  sections: Section[];
  all_item_total: AllItemTotal;
}

export interface Item {
  item_id: number;
  estimate_id: number;
  directory_id: number;
  company_id: number;
  equipment_id: any;
  material_id: any;
  cost_code_id: number;
  tax_id: any;
  subject: string;
  quantity: number;
  unit: string;
  unit_cost: string;
  hidden_markup: number;
  markup: string;
  description: string;
  is_deleted: number;
  date_added: string;
  date_modified: string;
  total: string;
  estimate_item_no: number;
  parent_item_id: number;
  item_type: number;
  reference_item_id: number;
  assigned_to: number;
  assigned_to_contact_id: number;
  is_temaplate: number;
  quickbook_estimateitem_id: number;
  quickbook_item_id: number;
  qbc_id: string;
  item_on_database: number;
  apply_global_tax: number;
  section_id: number;
  is_markup_percentage: number;
  markup_amount: string;
  bidder_item_id: number;
  is_optional_item: number;
  variation_id: number;
  internal_notes: string;
  one_build_id: any;
  is_project_template: number;
  project_template_id: any;
  origin: number;
  modified_unit_cost: string;
  item_type_display_name: string;
  item_type_name: string;
  item_type_key: string;
  company_estimate_id: string;
  assignee_type: any;
  assignee_name: any;
  assigned_to_name_only: string;
  assigned_to_company_name: string;
  user_image: string;
  section_name: string;
  custom_section_id: number;
  source_name: string;
  item_total: number;
  cost_code_name?: string;
  cost_code: any;
  code_id?: string;
  updated_unit_cost: string;
  quickbook_costcode_id?: number;
  tax_rate: number;
  origin_date_modified: string;
  variation_name: string;
  code_is_deleted?: number;
  cod_deleted_archived?: number;
  no_mu_total: number;
}

export interface Section {
  section_id: number;
  estimate_id: number;
  custom_section_id: number;
  section_name: string;
  cost_code_id: number;
  description: string;
  user_id: number;
  company_id: number;
  modify_by: number;
  parent_section_id: number;
  demo_data: number;
  date_added: string;
  date_modified: string;
  is_optional_section: number;
  is_project_template: number;
  project_template_id: any;
  cost_code_name: any;
  section_total: string;
  section_total_with_optional_item: string;
  taxable_total: string;
  markup_total: number;
  total_w_o_tax_markup: number;
  items: Item2[];
}

export interface Item2 {
  item_id: number;
  estimate_id: number;
  directory_id: number;
  company_id: number;
  equipment_id: any;
  material_id: any;
  cost_code_id: number;
  tax_id: any;
  subject: string;
  quantity: number;
  unit: string;
  unit_cost: string;
  hidden_markup: number;
  markup: string;
  description: string;
  is_deleted: number;
  date_added: string;
  date_modified: string;
  total: string;
  estimate_item_no: number;
  parent_item_id: number;
  item_type: number;
  reference_item_id: number;
  assigned_to: number;
  assigned_to_contact_id: number;
  is_temaplate: number;
  quickbook_estimateitem_id: number;
  quickbook_item_id: number;
  qbc_id: string;
  item_on_database: number;
  apply_global_tax: number;
  section_id: number;
  is_markup_percentage: number;
  markup_amount: string;
  bidder_item_id: number;
  is_optional_item: number;
  variation_id: number;
  internal_notes: string;
  one_build_id: any;
  is_project_template: number;
  project_template_id: any;
  origin: number;
  modified_unit_cost: string;
  item_type_display_name: string;
  item_type_name: string;
  item_type_key: string;
  company_estimate_id: string;
  assignee_type: any;
  assignee_name: any;
  assigned_to_name_only: string;
  assigned_to_company_name: string;
  user_image: string;
  section_name: string;
  custom_section_id: number;
  source_name: string;
  item_total: number;
  cost_code_name?: string;
  cost_code: any;
  code_id?: string;
  updated_unit_cost: string;
  quickbook_costcode_id?: number;
  tax_rate: number;
  origin_date_modified: string;
  variation_name: string;
  code_is_deleted?: number;
  cod_deleted_archived?: number;
  no_mu_total: number;
}

export interface AllItemTotal {
  material: Material;
  labor: Labor;
  equipment: Equipment;
  sub_contractor: SubContractor;
  other_item: OtherItem;
  unassigned_item: UnassignedItem;
  total: Total;
}

export interface Material {
  estimated_total: number;
  actual_total: number;
  item_title: string;
  due: number;
}

export interface Labor {
  estimated_total: number;
  actual_total: number;
  item_title: string;
  due: number;
}

export interface Equipment {
  estimated_total: number;
  actual_total: number;
  item_title: string;
  due: number;
}

export interface SubContractor {
  estimated_total: number;
  actual_total: number;
  item_title: string;
  due: number;
}

export interface OtherItem {
  estimated_total: number;
  actual_total: number;
  item_title: string;
  due: number;
}

export interface UnassignedItem {
  estimated_total: number;
  actual_total: number;
  item_title: string;
  due: number;
}

export interface Total {
  estimated_total: number;
  actual_total: number;
  item_title: string;
  due: number;
}

export interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  responseTime: string;
  data: {
    items: EstimateItem[];
  };
}

export interface EstimateItem {
  item_id: number;
  estimate_id: number;
  subject: string;
  quantity: number;
  unit: string;
  unit_cost: string;
  markup: string;
  total: string;
  item_type_display_name: string;
  item_type_name: string;
  section_name: string;
  item_total: number;
  assigned_to_name_only?: string;
}

export interface GridState {
  data: EstimateItem[];
  loading: boolean;
  error: string | null;
  groupedItems: {
    section_id: number;
    section_name: string;
    items: EstimateItem[];
  }[];
}
export interface ZeroItemsFilterProps {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export interface MarkupToggleProps {
  showMarkup: boolean;
  setShowMarkup: (show: boolean) => void;
}

export interface SectionBlockProps {
  section: any;
  index: number;
  moveSection: (from: number, to: number) => void;
  displayedSections: any[];
  children: React.ReactNode;
  onViewSection: (sec: any) => void;
  onAddItem: (secId: number) => void;
  copysection: (secId: number) => void;
  deletesection: (secId: number) => void;
  expandedKeys: string[];
  setExpandedKeys: (keys: string[]) => void;
  onUnmount?: () => void;
  hideActions?: boolean; // <-- Add this
}

export interface UnifiedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "addSection" | "itemDetails" | "sectionDetails" | "addItem";
  onAddSection: (data: {
    name: string;
    description: string;
    isOptional?: any;
  }) => void;
  onUpdateSection?: (sectionId: number, updates: any) => void;
  sectionData?: Section;
  itemData?: Item;
  onAddItem?: (sectionId: number, itemData: any) => void;
  currentSectionId?: number;
}

export interface Estimate {
  id: string;
  title: string;
  customer: string;
  estimateNumber: string;
  total: number;
  cost: number;
  profit: number;
  mu: number;
  pm: string;
  type: string;
  status: string;
  progress: number;
  details: Record<string, any>;
  createdAt: string;
}
export interface StatusConfig {
  color: string;
  icon: any;
  bgColor: string;
  textColor: string;
}
