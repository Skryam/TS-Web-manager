import 'bootstrap/dist/css/bootstrap.css';

export const submit = (attributes?: Record<string, string>) => {
  return (
    <>
      <input className='btn btn-primary'
      type='submit'
      {...attributes}
      />
    </>
  )
};

export const input = (entity, propertyName, errors: {}, labelName = null) => {
  
}