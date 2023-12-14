export type LanguageType = {
  languageName: string;
  scoreOutof100: number;
};

export type EmployeeType = {
  lastName: string;
  firstName: string;
  employeeID: number;
  designation: string;
  knownLanguages: LanguageType[];
};

export type ProgressType = {
  label: string;
  score: number;
};
