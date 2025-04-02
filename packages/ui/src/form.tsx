'use client';

import * as React from 'react';
import {
  Box,
  Button,
  styled,
  alpha,
  Paper,
  CircularProgress,
  Typography,
  Alert,
  Stack,
  useTheme,
} from '@mui/material';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  UseFormReturn,
  SubmitErrorHandler,
  Path,
} from 'react-hook-form';
import * as RadixForm from '@radix-ui/react-form';

/**
 * Form field configuration interface
 * @interface FormField
 * @template TFieldValues - The type of the form values.
 */
export interface FormField<TFieldValues extends FieldValues = FieldValues> {
  /**
   * Unique name/id of the field, typed as a path of the form values.
   */
  name: Path<TFieldValues>;

  /**
   * Label text for the field
   */
  label: string;

  /**
   * Type of form field
   */
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'checkbox' | 'radio' | 'select' | 'textarea' | 'custom';

  /**
   * Optional helper text for the field
   */
  helperText?: string;

  /**
   * Default value for the field
   */
  defaultValue?: any;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is read-only
   */
  readOnly?: boolean;

  /**
   * Custom placeholder text
   */
  placeholder?: string;

  /**
   * Custom validation rules
   */
  validation?: Record<string, any>;

  /**
   * Options for select/radio fields
   */
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;

  /**
   * Custom render function for the field
   */
  render?: (fieldProps: {
    field: any;
    formState: any;
    formMethods: UseFormReturn<TFieldValues>;
  }) => React.ReactNode;

  /**
   * Width of the field as a fraction of the container
   * @example 1/2 for half width, 1/3 for one-third, 1 for full width
   * @default 1
   */
  width?: number;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional props to pass to the field component
   */
  fieldProps?: Record<string, any>;
}

/**
 * Form component props interface
 * @interface FormProps
 */
export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  /**
   * Children components to render within the form.
   * Can be standard React nodes or a function accepting form methods (render prop).
   */
  children?: React.ReactNode | ((formMethods: UseFormReturn<TFieldValues>) => React.ReactNode);

  /**
   * Form fields configuration
   */
  fields?: FormField<TFieldValues>[];

  /**
   * Handler for form submission success
   */
  onSubmit: SubmitHandler<TFieldValues>;

  /**
   * Handler for form submission error
   */
  onError?: SubmitErrorHandler<TFieldValues>;

  /**
   * Default values for form fields
   */
  defaultValues?: Record<string, any>;

  /**
   * Whether to render a form reset button
   * @default false
   */
  showReset?: boolean;

  /**
   * Label text for the submit button
   * @default "Submit"
   */
  submitLabel?: string;

  /**
   * Label text for the reset button
   * @default "Reset"
   */
  resetLabel?: string;

  /**
   * Whether form is currently submitting
   * @default false
   */
  isSubmitting?: boolean;

  /**
   * Form layout direction
   * @default "column"
   */
  direction?: 'row' | 'column';

  /**
   * Gap between form fields
   * @default 3
   */
  gap?: number;

  /**
   * Whether to use a container with elevation
   * @default false
   */
  withContainer?: boolean;

  /**
   * Container elevation level (1-24)
   * @default 2
   */
  elevation?: number;

  /**
   * Custom form title
   */
  title?: string;

  /**
   * Custom form description
   */
  description?: string;

  /**
   * Error message to display at the form level
   */
  error?: string;

  /**
   * Success message to display after submission
   */
  successMessage?: string;

  /**
   * Whether to display form buttons at the top
   * @default false
   */
  buttonsAtTop?: boolean;

  /**
   * Custom class name for the form
   */
  className?: string;

  /**
   * Additional props to pass to the form element
   */
  formProps?: React.ComponentProps<'form'>;

  /**
   * Custom React Hook Form options
   */
  formOptions?: Record<string, any>;

  /**
   * Custom validation resolver
   */
  resolver?: any;

  /**
   * Custom render function for form buttons
   */
  renderButtons?: (formMethods: UseFormReturn<TFieldValues>) => React.ReactNode;
}

// Styled components for the form
const StyledForm = styled(RadixForm.Root)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

const FormDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

const FormFieldsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'direction' && prop !== 'gap',
})<{ direction?: 'row' | 'column'; gap?: number }>(
  ({ theme, direction = 'column', gap = 3 }) => ({
    display: 'flex',
    flexDirection: direction,
    flexWrap: direction === 'row' ? 'wrap' : 'nowrap',
    gap: theme.spacing(gap),
    marginBottom: theme.spacing(3),
  })
);

const FormActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

/**
 * Form component that provides a standardized way to create forms
 * Built with React Hook Form and MUI components with Radix UI primitives
 *
 * @component
 * @example
 * ```tsx
 * // Basic form with fields array
 * const fields = [
 *   {
 *     name: 'email',
 *     label: 'Email Address',
 *     type: 'email',
 *     required: true,
 *     validation: { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i },
 *     helperText: 'Enter your email address',
 *   },
 *   {
 *     name: 'password',
 *     label: 'Password',
 *     type: 'password',
 *     required: true,
 *     helperText: 'Enter your password',
 *   },
 *   {
 *     name: 'role',
 *     label: 'Role',
 *     type: 'select',
 *     options: [
 *       { value: 'user', label: 'User' },
 *       { value: 'admin', label: 'Admin' },
 *       { value: 'manager', label: 'Manager' },
 *     ],
 *   },
 * ];
 *
 * return (
 *   <Form
 *     fields={fields}
 *     onSubmit={(data) => console.log(data)}
 *     title="User Registration"
 *     description="Create a new account to get started"
 *     withContainer
 *     submitLabel="Register"
 *   />
 * );
 *
 * // Custom form with children
 * return (
 *   <Form
 *     onSubmit={handleSubmit}
 *     onError={handleError}
 *     defaultValues={{ name: 'John Doe' }}
 *   >
 *     {(formMethods) => (
 *       <>
 *         <TextField
 *           label="Name"
 *           {...formMethods.register('name', { required: true })}
 *           error={!!formMethods.formState.errors.name}
 *         />
 *         <TextField
 *           label="Email"
 *           {...formMethods.register('email', { required: true })}
 *           error={!!formMethods.formState.errors.email}
 *         />
 *       </>
 *     )}
 *   </Form>
 * );
 * ```
 */
export function Form<TFieldValues extends FieldValues = FieldValues>({
  children,
  fields,
  onSubmit,
  onError,
  defaultValues,
  showReset = false,
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  isSubmitting = false,
  direction = 'column',
  gap = 3,
  withContainer = false,
  elevation = 2,
  title,
  description,
  error,
  successMessage,
  buttonsAtTop = false,
  className,
  formProps,
  formOptions,
  resolver,
  renderButtons,
}: FormProps<TFieldValues>): React.ReactElement {
  const theme = useTheme();

  // Initialize React Hook Form
  const formMethods = useForm<TFieldValues>({
    defaultValues: defaultValues as any,
    resolver,
    ...formOptions,
  });

  // Get the object of all form field methods
  const { handleSubmit, reset, formState } = formMethods;

  // Handle form submission with success and error cases
  const handleFormSubmit = (data: TFieldValues) => {
    return onSubmit(data);
  };

  // Handle form errors
  const handleFormError = (errors: any) => {
    if (onError) {
      onError(errors);
    }
  };

  const FormContent = () => (
    <>
      {/* Form title and description */}
      {title && <FormTitle variant="h5">{title}</FormTitle>}
      {description && (
        <FormDescription variant="body2">{description}</FormDescription>
      )}

      {/* Form error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form success message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Form buttons at top if enabled */}
      {buttonsAtTop && (
        <FormActions>
          {renderButtons ? (
            renderButtons(formMethods)
          ) : (
            <>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined
                }
              >
                {submitLabel}
              </Button>
              {showReset && (
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  disabled={isSubmitting}
                  onClick={() => reset()}
                >
                  {resetLabel}
                </Button>
              )}
            </>
          )}
        </FormActions>
      )}

      {/* Form fields from fields prop */}
      {fields && fields.length > 0 && (
        <FormFieldsContainer direction={direction} gap={gap}>
          {/* Render custom field components - this would be expanded based on other components created */}
          {/* The placeholder implementation demonstrates the pattern but would be expanded with actual field renders */}
          {fields.map((field) => (
            <Box
              key={field.name}
              sx={{
                width: field.width ? `${field.width * 100}%` : '100%',
                flex: field.width ? undefined : '1 1 100%',
              }}
            >
              {/* The actual field would be rendered here */}
              {/* For now we have this placeholder */}
              {field.render ? (
                field.render({
                  field: formMethods.register(field.name, field.validation),
                  formState,
                  formMethods,
                })
              ) : (
                <Typography variant="body2" color="error">
                  Field renderers should be implemented for each field type
                </Typography>
              )}
            </Box>
          ))}
        </FormFieldsContainer>
      )}

      {/* Custom form children allowing complete customization */}
      {typeof children === 'function' ? children(formMethods) : children}

      {/* Form buttons at bottom (default) */}
      {!buttonsAtTop && (
        <FormActions>
          {renderButtons ? (
            renderButtons(formMethods)
          ) : (
            <>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined
                }
              >
                {submitLabel}
              </Button>
              {showReset && (
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  disabled={isSubmitting}
                  onClick={() => reset()}
                >
                  {resetLabel}
                </Button>
              )}
            </>
          )}
        </FormActions>
      )}
    </>
  );

  return (
    <FormProvider {...formMethods}>
      <StyledForm
        className={className}
        onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
        {...formProps}
      >
        {withContainer ? (
          <FormContainer elevation={elevation}>
            <FormContent />
          </FormContainer>
        ) : (
          <FormContent />
        )}
      </StyledForm>
    </FormProvider>
  );
}

export default Form;
