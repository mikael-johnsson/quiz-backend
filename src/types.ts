//remove question marks later
export interface Question {
  id: number;
  question: string;
  questionType?: string;
  answer?: string;
  themes?: string[];
  difficulty?: string;
  isApproved?: boolean;
  createdBy?: string;
  createdWhen?: string;
}

export interface SearchResult {
  totalResults: number;
  questions: Question[];
  statusCode: number;
}

export interface DataObject {
  questions: Question[];
}

export interface Query {
  themes?: string[];
  difficulties?: string[];
  isApproved?: boolean;
}
