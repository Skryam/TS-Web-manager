import { useTranslation } from "react-i18next"

export default () => {
  const { t } = useTranslation();
  return (
  <div className='p-5 bg-light'>
    <h1 className='display-4'>{t('views.welcome.index.hello')}</h1>
      <p className='lead'>{t('views.welcome.index.description')}</p>
  </div>
  )
}