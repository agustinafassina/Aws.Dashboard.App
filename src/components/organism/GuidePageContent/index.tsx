'use client'

import Link from 'next/link'
import { GUIDE_SECTION_IDS } from '@/config/siteGuide'
import { useTranslation } from '@/i18n/useTranslation'
import { guidePageStyles } from '@/app/guide/styles'

export default function GuidePageContent() {
  const { dictionary } = useTranslation()
  const { guide } = dictionary

  return (
    <div className={guidePageStyles.page}>
      <article className={guidePageStyles.article}>
        <header className={guidePageStyles.header}>
          <p className={guidePageStyles.eyebrow}>{guide.eyebrow}</p>
          <h1 className={guidePageStyles.title}>{guide.title}</h1>
          <p className={guidePageStyles.description}>{guide.description}</p>
          <Link href="/home/dashboard" className={guidePageStyles.backLink}>
            {guide.backToDashboard}
          </Link>
        </header>

        <nav className={guidePageStyles.toc} aria-label={guide.tocAriaLabel}>
          <p className={guidePageStyles.tocLabel}>{guide.tocLabel}</p>
          <ul className={guidePageStyles.tocList}>
            {GUIDE_SECTION_IDS.map((sectionId) => (
              <li key={sectionId}>
                <a href={`#${sectionId}`} className={guidePageStyles.tocLink}>
                  {guide.sections[sectionId].title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={guidePageStyles.sections}>
          {GUIDE_SECTION_IDS.map((sectionId) => {
            const section = guide.sections[sectionId]
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={guidePageStyles.section}
              >
                <h2 className={guidePageStyles.sectionTitle}>{section.title}</h2>
                <div className={guidePageStyles.sectionBody}>
                  {section.content.split('\n\n').map((paragraph) => (
                    <p key={`${sectionId}-${paragraph.slice(0, 24)}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </article>
    </div>
  )
}
