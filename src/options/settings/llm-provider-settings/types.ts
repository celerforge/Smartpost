export interface ProviderFormValues {
  apiKey: string;
  baseUrl?: string;
  model: string;
}

export interface BaseField {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export interface TextInputField extends BaseField {
  type: "text" | "password";
}

export interface SelectField extends BaseField {
  type: "select";
  options: Array<{ value: string; label: string }>;
}

export type ProviderField = TextInputField | SelectField;

export interface LLMProvider {
  id: "smartpost" | "openai" | "anthropic";
  name: string;
  description: string;
  fields: ProviderField[];
}
