export type LanguageType = {
  languageName: string;
  scoreOutof100: number;
};

export type ProgressType = {
  label: string;
  score: number;
};

export type EmployeeType = {
  lastName: string;
  firstName: string;
  employeeID: number;
  designation: string;
  knownLanguages: LanguageType[];
};
export type EmployeeSearchType = Omit<EmployeeType, "knownLanguages"> & {
  searchKeys: string[];
  sortBy: string;
  minScore?: number;
  maxScore?: number;
  languageName?: string;
  scoreRange?: [number, number];
  [key: string]: any;
};
