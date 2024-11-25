import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ControllerRenderProps } from "react-hook-form";
import { type ProviderField, type ProviderFormValues } from "./types";

interface FormControlProps {
  field: ProviderField;
  formField: ControllerRenderProps<
    ProviderFormValues,
    keyof ProviderFormValues
  >;
}

export function ProviderFormControl({ field, formField }: FormControlProps) {
  switch (field.type) {
    case "select":
      return (
        <FormControl>
          <Select
            value={(formField.value as string) ?? ""}
            onValueChange={formField.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case "text":
    case "password":
      const { onChange, value, ...rest } = formField;
      return (
        <FormControl>
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={onChange}
            {...rest}
          />
        </FormControl>
      );
  }
}
