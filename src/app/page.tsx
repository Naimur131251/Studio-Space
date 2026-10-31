import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldInput() {
  return (
    <FieldSet className="w-full max-w-xs mx-auto mt-30">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" type="text" placeholder="Max Leiter" />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          <Input id="password" type="password" placeholder="••••••••" />
        </Field>
        <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
      </FieldGroup>
    </FieldSet>
  );
}
