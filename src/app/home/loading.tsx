import { homeLoadingStyles } from './styles'

export default function HomeLoading() {
  return (
    <div
      className={homeLoadingStyles.root}
      aria-busy="true"
      aria-label="Cargando"
    >
      <div className={homeLoadingStyles.title} />
      <div className={homeLoadingStyles.body} />
    </div>
  )
}
