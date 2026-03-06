export interface HorizonError {
  response?: {
    status?: number;
    data?: {
      title?: string;
      detail?: string;
      extras?: {
        result_codes?: {
          transaction?: string;
        };
      };
    };
  };
}
