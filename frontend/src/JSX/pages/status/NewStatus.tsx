import { useApolloClient, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-bootstrap";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next"

import { CREATE_STATUS, GET_STATUSES } from "../../../graphql/queries";
import { CreateStatusInput, createStatusSchema } from "../../../zodSchemas/status";
import { TextInput } from "../../components/TextInput";
import { SubmitButton } from "../../components/SubmitButton";
import { FormLayout } from "../../components/FormLayout";
import { useFlash } from "../../components/FlashProvider";

export default function NewStatus() {
  const flash = useFlash();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = useApolloClient();
  const [CreateStatus] = useMutation(CREATE_STATUS);

  const methods = useForm<CreateStatusInput>({
    resolver: zodResolver(createStatusSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateStatusInput) => {
    console.log(data)
    try {
      await CreateStatus({ variables: {
        data: data
      }});
      await client.refetchQueries({ include: [GET_STATUSES]});
      flash(t('flash.statuses.create.success'), 'success');
      navigate('/statuses');
    } catch (err: any) {
      flash(t('flash.statuses.create.error'), 'danger');
      console.log(err)
    }
  };

  return (
    <FormLayout title={t('views.statuses.new.create')}>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
        
          <TextInput 
            fieldName='name'
            label={t('views.statuses.new.name')}
          />

          <SubmitButton />

        </Form>
      </FormProvider>
    </FormLayout>
  );
};