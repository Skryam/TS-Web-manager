import { useApolloClient, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next"

import { CREATE_LABEL, GET_LABELS } from "../../../graphql/queries";
import { createLabelSchema, CreateLabelInput } from "../../../zodSchemas/label";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";

export default function NewLabel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApolloClient();
  const [CreateLabel] = useMutation(CREATE_LABEL);

  const methods = useForm<CreateLabelInput>({
    resolver: zodResolver(createLabelSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateLabelInput) => {
    try {
      await CreateLabel({ variables: {
        data: data
      }});
      await client.refetchQueries({ include: [GET_LABELS]});
      navigate('/labels');
    } catch (err: any) {
      console.log(err)
    }
  };

  return (
    <FormLayout title={t('views.labels.new.create')}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
          <TextInput 
            fieldName='name'
            label={t('views.labels.new.name')}
          />

          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  );
};